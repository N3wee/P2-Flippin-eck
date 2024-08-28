document.addEventListener("DOMContentLoaded", () => {
    let mode = "normal"; // Start with normal mode
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let correctPairs = 0;
    let remainingPairs = 0;
    let hardWins = 0;
    let normalWins = 0;

    let timerInterval; // Interval ID for the timer
    let timerSeconds = 0; // Track elapsed time in seconds
    const bestTimeNormal = localStorage.getItem("bestTimeNormal") || null; // Retrieve best time for Normal mode from localStorage
    const bestTimeHard = localStorage.getItem("bestTimeHard") || null; // Retrieve best time for Hard mode from localStorage

    const normalCards = createCardArray(8);
    const hardCards = createCardArray(18);

    // Display the best times on load
    updateBestTimeDisplay();

    // Event listeners for mode buttons and how to play button
    document.getElementById("normal-mode").addEventListener("click", () => setMode("normal"));
    document.getElementById("hard-mode").addEventListener("click", () => setMode("hard"));
    document.getElementById("how-to-play-btn").addEventListener("click", toggleHowToPlay);

    // Initialize the game
    startGame();

    /**
     * Create an array of card objects with pairs for the given size.
     * @param {number} size - The number of pairs to create.
     * @returns {Array} - Array of card objects.
     */
    function createCardArray(size) {
        return Array.from({ length: size }, (_, i) => ({ number: i + 1 }))
            .concat(Array.from({ length: size }, (_, i) => ({ number: i + 1 })));
    }

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
     * Set the current game mode and start a new game.
     * @param {string} selectedMode - The selected game mode ("normal" or "hard").
     */
    function setMode(selectedMode) {
        mode = selectedMode;
        document.getElementById("normal-mode").classList.toggle("active", mode === "normal");
        document.getElementById("hard-mode").classList.toggle("active", mode === "hard");
        updateBestTimeDisplay();
        startGame();
    }

    /**
     * Start the game by initializing the board and starting the timer.
     */
    function startGame() {
        resetGameVariables();
        setupTimer();
        setupGameBoard();
    }

    /**
     * Reset game-related variables.
     */
    function resetGameVariables() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        correctPairs = 0;
        remainingPairs = mode === "normal" ? 8 : 18;
        updateScore();
        updateRemainingPairs();
    }

    /**
     * Setup and start the game timer.
     */
    function setupTimer() {
        clearInterval(timerInterval); // Clear any existing timer
        timerSeconds = 0;
        updateTimer(); // Initialize timer display
        timerInterval = setInterval(updateTimer, 1000); // Start the timer
    }

    /**
     * Setup the game board with shuffled cards.
     */
    function setupGameBoard() {
        const gameBoard = document.getElementById("game-board");
        const cards = mode === "normal" ? [...normalCards] : [...hardCards];
        shuffle(cards);
        gameBoard.innerHTML = ""; // Clear previous cards if any
        gameBoard.className = `grid-container ${mode === "normal" ? "grid-4x4" : "grid-6x6"}`; // Set grid class

        cards.forEach((card, index) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card");
            cardElement.dataset.number = card.number;
            cardElement.setAttribute("id", `card-${index}`);
            cardElement.addEventListener("click", flipCard);
            gameBoard.appendChild(cardElement);
        });
    }

    /**
     * Update the timer display with the elapsed time.
     */
    function updateTimer() {
        timerSeconds++;
        document.getElementById("timer").textContent = formatTime(timerSeconds);
    }

    /**
     * Format time in seconds to a mm:ss format.
     * @param {number} seconds - The number of seconds elapsed.
     * @returns {string} - The formatted time string.
     */
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    /**
     * Flip a card when clicked and check for matches.
     */
    function flipCard() {
        if (lockBoard || this === firstCard) return;

        this.textContent = this.dataset.number;
        this.classList.add("face-up");

        if (!firstCard) {
            firstCard = this;
        } else {
            secondCard = this;
            lockBoard = true;
            checkForMatch();
        }
    }

    /**
     * Check if the two selected cards match.
     */
    function checkForMatch() {
        const isMatch = firstCard.dataset.number === secondCard.dataset.number;
        isMatch ? disableCards() : unflipCards();
    }

    /**
     * Handle matched cards by making them invisible and updating the score.
     */
    function disableCards() {
        firstCard.classList.add("invisible");
        secondCard.classList.add("invisible");

        correctPairs++;
        remainingPairs--;
        updateScore();
        updateRemainingPairs();

        remainingPairs === 0 ? endGame() : resetBoard();
    }

    /**
     * Handle unmatched cards by flipping them back over after a delay.
     */
    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove("face-up");
            secondCard.classList.remove("face-up");
            firstCard.textContent = "";
            secondCard.textContent = "";
            resetBoard();
        }, 1000);
    }

    /**
     * Reset the board for the next turn by unlocking and clearing the selected cards.
     */
    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    /**
     * Update the display of the score.
     */
    function updateScore() {
        document.getElementById("correct-pairs").textContent = correctPairs;
    }

    /**
     * Update the display of the remaining pairs.
     */
    function updateRemainingPairs() {
        document.getElementById("pairs-remaining").textContent = remainingPairs;
    }

    /**
     * End the game, stop the timer, and check if the player achieved a new best time.
     */
    function endGame() {
        clearInterval(timerInterval); // Stop the timer

        setTimeout(() => {
            if (remainingPairs === 0) {
                alert("Congratulations, you've won!");
                const bestTimeKey = mode === "normal" ? "bestTimeNormal" : "bestTimeHard";
                let bestTime = mode === "normal" ? bestTimeNormal : bestTimeHard;

                // Update wins
                if (mode === "normal") {
                    normalWins++;
                    document.getElementById("wins-count").textContent = normalWins;
                } else {
                    hardWins++;
                    document.getElementById("wins-count").textContent = hardWins;
                }

                // Check if this is a new best time
                if (!bestTime || timerSeconds < bestTime) {
                    bestTime = timerSeconds;
                    localStorage.setItem(bestTimeKey, bestTime);
                    document.getElementById("best-time-display").textContent = formatTime(bestTime);
                    alert("New best time!");
                }
            }
        }, 500);
    }

    /**
     * Update the best time display based on the current mode.
     */
    function updateBestTimeDisplay() {
        const bestTimeDisplay = document.getElementById("best-time-display");
        bestTimeDisplay.textContent = mode === "normal"
            ? bestTimeNormal ? formatTime(bestTimeNormal) : "--:--"
            : bestTimeHard ? formatTime(bestTimeHard) : "--:--";
    }

    /**
     * Toggle the "How to Play" pane.
     */
    function toggleHowToPlay() {
        const howToPlayPane = document.getElementById("how-to-play-pane");
        howToPlayPane.style.display = howToPlayPane.style.display === "block" ? "none" : "block";
    }
});



