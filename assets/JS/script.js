document.addEventListener('DOMContentLoaded', function () {
    // Card data for Normal mode (4x4) and Hard mode (6x6)
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

    let mode = 'normal'; // Start with normal mode
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let correctPairs = 0;
    let remainingPairs = 0;
    let hardWins = 0;
    let normalWins = 0;
    let timerInterval;
    let timerSeconds = 0;
    let bestTimeNormal = localStorage.getItem('bestTimeNormal') || null;
    let bestTimeHard = localStorage.getItem('bestTimeHard') || null;

    updateBestTimeDisplay();

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startGame() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        correctPairs = 0;
        remainingPairs = mode === 'normal' ? 8 : 18;
        updateScore();
        updateRemainingPairs();

        clearInterval(timerInterval);
        timerSeconds = 0;
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);

        const gameBoard = document.getElementById('game-board');
        const cards = mode === 'normal' ? [...normalCards] : [...hardCards];
        shuffle(cards);

        gameBoard.innerHTML = '';

        gameBoard.className = mode === 'normal' ? 'grid-container grid-4x4' : 'grid-container grid-6x6';

        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.number = card.number;
            cardElement.setAttribute('id', `card-${index}`);
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
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
        if (lockBoard) return;
        if (this === firstCard) return;

        this.textContent = this.dataset.number;
        this.classList.add('face-up');

        if (!firstCard) {
            firstCard = this;
        } else {
            secondCard = this;
            lockBoard = true;
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
        firstCard.classList.add('invisible');
        secondCard.classList.add('invisible');

        correctPairs++;
        remainingPairs--;
        updateScore();
        updateRemainingPairs();

        if (remainingPairs === 0) {
            endGame();
        } else {
            resetBoard();
        }
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

    function endGame() {
        clearInterval(timerInterval);

        setTimeout(() => {
            if (remainingPairs === 0) {
                alert("Congratulations, you've won!");
                const bestTimeKey = mode === 'normal' ? 'bestTimeNormal' : 'bestTimeHard';
                let bestTime = mode === 'normal' ? bestTimeNormal : bestTimeHard;

                if (mode === 'normal') {
                    normalWins++;
                    document.getElementById('games-won-count').textContent = normalWins;
                } else {
                    hardWins++;
                    document.getElementById('games-won-count').textContent = hardWins;
                }

                if (!bestTime || timerSeconds < bestTime) {
                    bestTime = timerSeconds;
                    localStorage.setItem(bestTimeKey, bestTime);
                    document.getElementById('best-time-display').textContent = formatTime(bestTime);
                    alert('New best time!');
                }
            }
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

    document.getElementById('normal-mode').addEventListener('click', function () {
        mode = 'normal';
        document.getElementById('normal-mode').classList.add('active');
        document.getElementById('hard-mode').classList.remove('active');
        updateBestTimeDisplay();
        startGame();
    });

    document.getElementById('hard-mode').addEventListener('click', function () {
        mode = 'hard';
        document.getElementById('normal-mode').classList.remove('active');
        document.getElementById('hard-mode').classList.add('active');
        updateBestTimeDisplay();
        startGame();
    });

    document.getElementById('how-to-play-btn').addEventListener('click', function () {
        const howToPlayPane = document.getElementById('how-to-play-pane');
        howToPlayPane.style.display = howToPlayPane.style.display === 'block' ? 'none' : 'block';
    });

    startGame();
});


