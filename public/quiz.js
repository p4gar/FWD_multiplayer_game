document.addEventListener("DOMContentLoaded", function () {
    const questionElement = document.getElementById("question");
    const answerButtonsElement = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");

    let questions = []; // Initialize an empty questions array
    let currentQuestionIndex = 0;
    let score = 0;

    // Get levelNumber from localStorage
    // const levelNumber = localStorage.getItem('levelNumber');
    const levelNumber = 1;

    // Fetch questions from the backend based on levelNumber
    async function fetchQuestions() {
        try {
            const response = await fetch(`/api/get-questions/${levelNumber}`);
            console.log(await response.text()); // Log the raw response for debugging
            questions = await response.json(); // Save questions to global array
            startQuiz(); // Start the quiz after fetching questions
        } catch (error) {
            console.error('Error fetching questions:', error);
            questionElement.innerText = 'Failed to load questions. Please try again later.';
        }
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        nextButton.style.display = "none"; // Hide the next button initially
        showQuestion();
    }

    function showQuestion() {
        resetState(); // Clear previous answers and reset button styles

        const currentQuestion = questions[currentQuestionIndex];
        questionElement.innerText = currentQuestion.question;

        // Populate answer buttons
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement("button");
            button.innerText = answer.text;
            button.classList.add("btn");
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener("click", selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        nextButton.style.display = "none"; // Hide the next button until an answer is chosen
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === "true";

        // If the selected answer is correct
        if (correct) {
            setButtonStatus(selectedButton, true);
            score++; // Increment score for the correct answer
        } else {
            setButtonStatus(selectedButton, false); // Mark the selected button as incorrect
            highlightCorrectAnswer(); // Highlight the correct answer
        }

        // Disable all buttons after one is clicked
        disableButtons();

        // Show the "Next" button
        nextButton.style.display = "block"; // Show the button
    }

    function setButtonStatus(button, correct) {
        button.classList.remove("correct", "incorrect");
        if (correct) {
            button.classList.add("correct"); // Green if correct
        } else {
            button.classList.add("incorrect"); // Red if incorrect
        }
    }

    function highlightCorrectAnswer() {
        const correctAnswer = Array.from(answerButtonsElement.children).find(button => button.dataset.correct === "true");
        if (correctAnswer) {
            setButtonStatus(correctAnswer, true); // Highlight the correct answer
        }
    }

    function disableButtons() {
        const buttons = answerButtonsElement.children;
        for (let button of buttons) {
            button.disabled = true; // Disable each button
        }
    }

    function handleNextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endQuiz();
        }
    }

    function endQuiz() {
        questionElement.innerText = `Quiz finished! Your score: ${score}/${questions.length}`;
        answerButtonsElement.innerHTML = "";
        nextButton.style.display = "none"; // Hide the next button when the quiz ends
    }

    nextButton.addEventListener("click", handleNextQuestion); // Handle going to the next question

    // Fetch questions and start quiz
    fetchQuestions();
});
