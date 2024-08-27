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

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

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
    }

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
     * Handle matched cards by making them stay visible.
     */
    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        resetBoard();
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

    createGrid(); // Start the game by creating the grid
});
