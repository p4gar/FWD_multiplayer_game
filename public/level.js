function fetchLevels() {
    // Hide the play button
    document.getElementById('play-button').style.display = 'none';

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
    alert(`You selected Level ${levelNumber}`);
    window.location.href = `/game?level=${levelNumber}`;
}

