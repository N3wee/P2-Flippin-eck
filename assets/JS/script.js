document.addEventListener('DOMContentLoaded', function () {
    /**
     * Card data for Normal mode (4x4 grid).
     */
    const normalCards = [
        { number: 1 }, { number: 2 }, { number: 3 }, { number: 4 },
        { number: 5 }, { number: 6 }, { number: 7 }, { number: 8 },
        { number: 1 }, { number: 2 }, { number: 3 }, { number: 4 },
        { number: 5 }, { number: 6 }, { number: 7 }, { number: 8 }
    ];

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
        gameBoard.classList.add('grid-4x4');  // Set the grid layout for 4x4

        shuffle(normalCards);  // Shuffle the cards

        normalCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.number = card.number;
            cardElement.setAttribute('id', `card-${index}`);
            cardElement.addEventListener('click', flipCard);  // Add click event to flip card
            gameBoard.appendChild(cardElement);
        });
    }

    /**
     * Flip a card when clicked, revealing its number.
     * @this {HTMLElement} The card element being clicked.
     */
    function flipCard() {
        this.classList.add('face-up');
        this.textContent = this.dataset.number;
    }

    // Start the game by creating the grid
    createGrid();
});
