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
                const button = document.createElement('button');
                button.textContent = `Level ${level.level_id}: ${level.level_name}`;
                button.classList.add('level-button');

                // when each button is click, handle the function
                button.onclick = () => {
                    selectLevel(level.level_id);
                };

                li.appendChild(button);
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

