document.addEventListener('DOMContentLoaded', function () {
    const normalCards = [
        { number: 1 }, { number: 2 }, { number: 3 }, { number: 4 },
        { number: 5 }, { number: 6 }, { number: 7 }, { number: 8 },
        { number: 1 }, { number: 2 }, { number: 3 }, { number: 4 },
        { number: 5 }, { number: 6 }, { number: 7 }, { number: 8 }
    ];

    const hardCards = [
        { number: 1 }, { number: 2 }, { number: 3 }, { number: 4 },
        { number: 5 }, { number: 6 }, { number: 7 }, { number: 8 },
        { number: 9 }, { number: 10 }, { number: 11 }, { number: 12 },
        { number: 13 }, { number: 14 }, { number: 15 }, { number: 16 },
        { number: 17 }, { number: 18 }, { number: 1 }, { number: 2 },
        { number: 3 }, { number: 4 }, { number: 5 }, { number: 6 },
        { number: 7 }, { number: 8 }, { number: 9 }, { number: 10 },
        { number: 11 }, { number: 12 }, { number: 13 }, { number: 14 },
        { number: 15 }, { number: 16 }, { number: 17 }, { number: 18 }
    ];

    let mode = 'normal'; // Default mode is normal
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let correctPairs = 0;
    let remainingPairs = normalCards.length / 2;
    let gamesWon = 0;

    let timerInterval;  // Interval ID for the timer
    let timerSeconds = 0;  // Track elapsed time in seconds
    let bestTimeNormal = localStorage.getItem('bestTimeNormal') || null;
    let bestTimeHard = localStorage.getItem('bestTimeHard') || null;

    // Display the best times on load
    updateBestTimeDisplay();

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createGrid() {
        const gameBoard = document.getElementById('game-board');
        const cards = mode === 'normal' ? normalCards : hardCards;

        shuffle(cards);
        gameBoard.innerHTML = ''; // Clear previous grid

        if (mode === 'normal') {
            gameBoard.className = 'grid-container grid-4x4';
        } else {
            gameBoard.className = 'grid-container grid-6x6';
        }

        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.number = card.number;
            cardElement.setAttribute('id', `card-${index}`);
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });

        remainingPairs = cards.length / 2;
        updateRemainingPairs();
    }

    function startTimer() {
        timerSeconds = 0;
        updateTimer();
        clearInterval(timerInterval); // Clear any existing timer
        timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        timerSeconds++;
        document.getElementById('timer').textContent = formatTime(timerSeconds);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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

    function checkForMatch() {
        const isMatch = firstCard.dataset.number === secondCard.dataset.number;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

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
        }, 500);
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('face-up');
            secondCard.classList.remove('face-up');
            firstCard.textContent = '';
            secondCard.textContent = '';

            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    function updateScore() {
        document.getElementById('correct-pairs').textContent = correctPairs;
    }

    function updateRemainingPairs() {
        document.getElementById('pairs-remaining').textContent = remainingPairs;
    }

    function updateGamesWon() {
        document.getElementById('games-won').textContent = gamesWon;
    }

    function endGame() {
        clearInterval(timerInterval);  // Stop the timer

        setTimeout(() => {
            alert("Congratulations, you've won!");
            gamesWon++;
            updateGamesWon();

            const bestTimeKey = mode === 'normal' ? 'bestTimeNormal' : 'bestTimeHard';
            let bestTime = mode === 'normal' ? bestTimeNormal : bestTimeHard;

            if (!bestTime || timerSeconds < bestTime) {
                bestTime = timerSeconds;
                localStorage.setItem(bestTimeKey, bestTime);
                alert('New best time!');
            }

            updateBestTimeDisplay();
            resetGame();
        }, 500);
    }

    function updateBestTimeDisplay() {
        const bestTimeDisplay = document.getElementById('best-time-display');
        if (mode === 'normal') {
            bestTimeDisplay.textContent = bestTimeNormal ? formatTime(bestTimeNormal) : '--:--';
        } else {
            bestTimeDisplay.textContent = bestTimeHard ? formatTime(bestTimeHard) : '--:--';
        }
    }

    function resetGame() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        correctPairs = 0;

        createGrid();
        startTimer();
    }

    document.getElementById('normal-mode').addEventListener('click', function () {
        mode = 'normal';
        document.getElementById('normal-mode').classList.add('active');
        document.getElementById('hard-mode').classList.remove('active');
        updateBestTimeDisplay();
        resetGame();
    });

    document.getElementById('hard-mode').addEventListener('click', function () {
        mode = 'hard';
        document.getElementById('normal-mode').classList.remove('active');
        document.getElementById('hard-mode').classList.add('active');
        updateBestTimeDisplay();
        resetGame();
    });

    // Initialize the game in Normal mode when the page loads
    createGrid();
    startTimer();
});
