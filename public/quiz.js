document.addEventListener("DOMContentLoaded", function () {
    const questionElement = document.getElementById("question");
    const answerButtonsElement = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");

    let questions = []; // Initialize an empty questions array
    let currentQuestionIndex = 0;
    let score = 0;

    // Get levelNumber from localStorage
    const levelNumber = localStorage.getItem('levelNumber');

    // Fetch questions from the backend based on levelNumber
    async function fetchQuestions() {
        try {
            const response = await fetch(`/api/get-questions/${levelNumber}`);
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

        // Shuffle the answers array to randomize answer options
        const shuffledAnswers = shuffleArray(currentQuestion.answers);

        // Populate answer buttons with shuffled answers
        shuffledAnswers.forEach(answer => {
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

    // Function to shuffle an array
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
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
        answerButtonsElement.innerHTML = "";
        nextButton.style.display = "none"; // Hide the next button when the quiz ends
        document.getElementById("back-btn").style.display = "block"; // Show the back button

        const game_score = parseInt(localStorage.getItem('game_score')) || 0;
        const errors = parseInt(localStorage.getItem('errors')) || 0;
        const score_percentage = (score / questions.length) * 100;
        const penalty = errors * 50;

        const finalScore = game_score + score_percentage - penalty;

        questionElement.innerText = `Quiz finished! Your score: ${score}/${questions.length}
        Final score: ${finalScore}`;

        const data = {
            username: localStorage.getItem('username'), 
            level_name: levelNumber,
            score_value: Math.round(finalScore) 
        };

        fetch('/api/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Score saved:', data.message);
            })
            .catch(error => {
                console.error('Error saving score:', error);
            });
    }

    nextButton.addEventListener("click", handleNextQuestion); // Handle going to the next question

    document.getElementById("back-btn").addEventListener("click", function () {
        window.location.href = "/index"; // Redirect to index.pug
    });

    // Fetch questions and start quiz
    fetchQuestions();
});
