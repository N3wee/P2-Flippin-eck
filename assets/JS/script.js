document.addEventListener('DOMContentLoaded', function () {
    const normalCards = [
        { number: 1 }, { number: 2 }, { number: 3 }, { number: 4 },
        { number: 5 }, { number: 6 }, { number: 7 }, { number: 8 },
        { number: 1 }, { number: 2 }, { number: 3 }, { number: 4 },
        { number: 5 }, { number: 6 }, { number: 7 }, { number: 8 }
    ];

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let correctPairs = 0;
    let remainingPairs = normalCards.length / 2;
    let gamesWon = 0; // Track games won

    let timerInterval;  // Interval ID for the timer
    let timerSeconds = 0;  // Track elapsed time in seconds
    let bestTimeNormal = localStorage.getItem('bestTimeNormal') || null;  // Retrieve best time for Normal mode from localStorage
    let bestTimeHard = localStorage.getItem('bestTimeHard') || null;  // Retrieve best time for Hard mode from localStorage

    // Display the best times on load
    updateBestTimeDisplay();

    /**
     * Shuffle the elements of an array in place.
     * @param {Array} array - The array to shuffle.
     */
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Create and display the grid of cards on the game board.
     */
    function createGrid() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.classList.add('grid-4x4');

        shuffle(normalCards);

        normalCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.number = card.number;
            cardElement.setAttribute('id', `card-${index}`);
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });

        updateRemainingPairs();
    }

    /**
     * Start the timer when the game starts.
     */
    function startTimer() {
        timerSeconds = 0;
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    /**
     * Update the timer display with the elapsed time.
     */
    function updateTimer() {
        timerSeconds++;
        document.getElementById('timer').textContent = formatTime(timerSeconds);
    }

    /**
     * Format time in seconds to a mm:ss format.
     * @param {number} seconds - The number of seconds elapsed.
     * @returns {string} - The formatted time string.
     */
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    /**
     * Flip a card when clicked, revealing its number.
     * @this {HTMLElement} The card element being clicked.
     */
    function flipCard() {
        if (lockBoard) return; // Prevent clicking if the board is locked
        if (this === firstCard) return; // Prevent double-clicking on the same card

        this.classList.add('face-up');
        this.textContent = this.dataset.number;

        if (!firstCard) {
            firstCard = this;
        } else {
            secondCard = this;
            lockBoard = true; // Lock the board until cards are checked

            checkForMatch();
        }
    }

    /**
     * Check if the two selected cards match.
     */
    function checkForMatch() {
        const isMatch = firstCard.dataset.number === secondCard.dataset.number;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    /**
     * Handle matched cards by making them invisible and updating the score.
     */
    function disableCards() {
        setTimeout(() => {
            firstCard.classList.add('invisible');
            secondCard.classList.add('invisible');

            correctPairs++;
            remainingPairs--;

            updateScore();
            updateRemainingPairs();

            resetBoard();

            if (remainingPairs === 0) {
                endGame();
            }
        }, 500);  // Adding a slight delay to allow the flip animation to finish
    }

    /**
     * Handle unmatched cards by flipping them back over after a short delay.
     */
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('face-up');
            secondCard.classList.remove('face-up');
            firstCard.textContent = '';
            secondCard.textContent = '';

            resetBoard();
        }, 1000);
    }

    /**
     * Reset the board after a pair has been processed.
     */
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    /**
     * Update the display of the correct pairs.
     */
    function updateScore() {
        document.getElementById('correct-pairs').textContent = correctPairs;
    }

    /**
     * Update the display of the remaining pairs.
     */
    function updateRemainingPairs() {
        document.getElementById('pairs-remaining').textContent = remainingPairs;
    }

    /**
     * Update the display of games won.
     */
    function updateGamesWon() {
        document.getElementById('games-won').textContent = gamesWon;
    }

    /**
     * End the game, check for best time, increment games won, and reset the game.
     */
    function endGame() {
        clearInterval(timerInterval);  // Stop the timer

        setTimeout(() => {
            alert("Congratulations, you've won!");
            gamesWon++;
            updateGamesWon();

            const bestTimeKey = 'bestTimeNormal';
            const currentBestTime = bestTimeNormal;

            if (!currentBestTime || timerSeconds < currentBestTime) {
                bestTimeNormal = timerSeconds;
                localStorage.setItem(bestTimeKey, bestTimeNormal);
                alert('New best time!');
            }

            updateBestTimeDisplay();
            resetGame();
        }, 500);
    }

    /**
     * Update the display of the best time for the current mode.
     */
    function updateBestTimeDisplay() {
        const bestTimeDisplay = document.getElementById('best-time-display');
        bestTimeDisplay.textContent = bestTimeNormal ? formatTime(bestTimeNormal) : '--:--';
    }

    /**
     * Reset the game by reinitializing the variables and regenerating the grid.
     */
    function resetGame() {
        // Reset game state variables
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        correctPairs = 0;
        remainingPairs = normalCards.length / 2;

        // Clear the game board
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = ''; // Clear the board

        // Re-create the grid
        createGrid();

        // Start the timer for the new game
        startTimer();
    }

    // Start the game initially in Normal mode
    createGrid();
    startTimer();
});
