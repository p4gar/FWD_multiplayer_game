// Function to fetch and display the highest score for a specific level
function fetchAndDisplayScore(levelName, scoreLabel) {
    console.log(`Fetching score for level: ${levelName}`);

    fetch(`/api/score?level_name=${levelName}`)
        .then(response => {
            console.log('Response status:', response.status);
            return response.json(); // Attempt to parse JSON
        })
        .then(data => {
            console.log('Fetched data:', data);
            // Update the score label with the fetched highest score
            scoreLabel.textContent = `Highest Score: ${data.highest_score || "N/A"}`;
        })
        .catch(error => {
            console.error(`Error fetching score for level ${levelName}:`, error);
            scoreLabel.textContent = 'Highest Score: N/A';
        });
}


// Function to fetch levels and display them with highest scores
function fetchLevels() {
    // Hide the play button
    document.getElementById('play-button').style.display = 'none';

    // Create a text element for the title
    const text = document.createElement('div');
    text.innerHTML = 'Python Quizzes';
    text.style.textAlign = 'center'; // Center the text
    text.style.fontSize = '30px'; // Set font size
    text.style.color = 'white'; // Set text color
    text.style.margin = '20px 0'; // Add some margin around it
    text.style.fontFamily = 'Source Code Pro';

    const levelsContainer = document.querySelector('.levels-list');
    levelsContainer.insertBefore(text, levelsContainer.firstChild); // Insert the text at the top

    // Fetch the levels from the server
    fetch('/api/get-levels')
        .then(response => response.json())
        .then(levels => {
            const levelsList = document.getElementById('levels-ul');
            const levelsContainer = document.querySelector('.levels-list');

            // Show the levels list container
            levelsContainer.style.display = 'block';

            // Populate the levels list
            levels.forEach(level => {
                const li = document.createElement('li');

                // Create a container for the highest score and button
                const scoreContainer = document.createElement('div');
                scoreContainer.classList.add('score-container');

                // Create the "Highest Score" label
                const scoreLabel = document.createElement('span');
                scoreLabel.textContent = 'Highest Score: ';
                scoreLabel.classList.add('score-label');

                // Call fetchAndDisplayScore to get the score and update scoreLabel
                fetchAndDisplayScore(level.level_id, scoreLabel);

                // Create the level button
                const button = document.createElement('button');
                button.textContent = `Level ${level.level_id}: ${level.level_name}`;
                button.classList.add('level-button');

                // Handle button click
                button.onclick = () => {
                    selectLevel(level.level_id);
                };

                // Append the score label and button to the container
                scoreContainer.appendChild(scoreLabel);
                scoreContainer.appendChild(button);

                // Append the container to the list item
                li.appendChild(scoreContainer);
                levelsList.appendChild(li);
            });

        })
        .catch(error => {
            console.error('Error fetching levels:', error);
        });
}


function selectLevel(levelNumber) {
    // Prompt user to choose game mode
    const mode = confirm("Press OK for Single Player or Cancel for Multiplayer.");

    if (mode) {
        // User chose Single Player
        alert(`You selected Level ${levelNumber} in Single Player mode`);
        window.location.href = `/game?level=${levelNumber}&mode=single`;
    } else {
        // User chose Multiplayer
        alert(`You selected Level ${levelNumber} in Multiplayer mode`);
        window.location.href = `/game?level=${levelNumber}&mode=multi`;
    }
}

