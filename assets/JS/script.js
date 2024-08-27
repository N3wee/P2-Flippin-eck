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
     * End the game, increment games won, and reset the game.
     */
    function endGame() {
        setTimeout(() => {
            alert("Congratulations, you've won!");
            gamesWon++;
            updateGamesWon();
            resetGame();
        }, 500);
    }

    /**
     * Reset the game by reinitializing the variables and regenerating the grid.
     */
    function resetGame() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        correctPairs = 0;
        remainingPairs = normalCards.length / 2;

        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = ''; // Clear the board

        createGrid(); // Create a new grid
    }

    createGrid(); // Start the game by creating the grid
});
