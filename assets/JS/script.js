/**
 * Card data for Normal mode (4x4) and Hard mode (6x6)
 */
const normalCards = [
    { number: 1 }, { number: 2 },
    { number: 3 }, { number: 4 },
    { number: 5 }, { number: 6 },
    { number: 7 }, { number: 8 },
    { number: 1 }, { number: 2 },
    { number: 3 }, { number: 4 },
    { number: 5 }, { number: 6 },
    { number: 7 }, { number: 8 }
  ];
  
  const hardCards = [
    { number: 1 }, { number: 2 },
    { number: 3 }, { number: 4 },
    { number: 5 }, { number: 6 },
    { number: 7 }, { number: 8 },
    { number: 9 }, { number: 10 },
    { number: 11 }, { number: 12 },
    { number: 13 }, { number: 14 },
    { number: 15 }, { number: 16 },
    { number: 17 }, { number: 18 },
    { number: 1 }, { number: 2 },
    { number: 3 }, { number: 4 },
    { number: 5 }, { number: 6 },
    { number: 7 }, { number: 8 },
    { number: 9 }, { number: 10 },
    { number: 11 }, { number: 12 },
    { number: 13 }, { number: 14 },
    { number: 15 }, { number: 16 },
    { number: 17 }, { number: 18 }
  ];
  
  let mode = 'normal'; // Start with normal mode
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let correctPairs = 0;
  let remainingPairs = 0;
  let hardWins = 0;
  let normalWins = 0;
  
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
   * Start the game by initializing the board and starting the timer.
   */
  function startGame() {
      firstCard = null;
      secondCard = null;
      lockBoard = false;
      correctPairs = 0;
      remainingPairs = mode === 'normal' ? 8 : 18;
      updateScore();
      updateRemainingPairs();
  
      // Reset and start the timer
      clearInterval(timerInterval);  // Clear any existing timer
      timerSeconds = 0;
      updateTimer();  // Initialize timer display
      timerInterval = setInterval(updateTimer, 1000);  // Start the timer
  
      const gameBoard = document.getElementById('game-board');
      const cards = mode === 'normal' ? [...normalCards] : [...hardCards];
      shuffle(cards);
  
      // Clear previous cards if any
      gameBoard.innerHTML = '';
  
      // Set grid class based on mode
      if (mode === 'normal') {
          gameBoard.className = 'grid-container grid-4x4'; // Ensure both classes are applied
      } else {
          gameBoard.className = 'grid-container grid-6x6'; // Ensure both classes are applied
      }
  
      // Generate the card elements on the game board
      cards.forEach((card, index) => {
          const cardElement = document.createElement('div');
          cardElement.classList.add('card');
          cardElement.dataset.number = card.number;
          cardElement.setAttribute('id', `card-${index}`);
          cardElement.addEventListener('click', flipCard);
          gameBoard.appendChild(cardElement);
      });
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
   * Flip a card when clicked and check for matches.
   */
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
  
  /**
   * Handle unmatched cards by flipping them back over after a delay.
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
   * Reset the board for the next turn by unlocking and clearing the selected cards.
   */
  function resetBoard() {
      [firstCard, secondCard, lockBoard] = [null, null, false];
  }
  
  /**
   * Update the display of the score.
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
   * End the game, stop the timer, and check if the player achieved a new best time.
   */
  function endGame() {
      clearInterval(timerInterval);  // Stop the timer
  
      setTimeout(() => {
          if (remainingPairs === 0) {
              alert("Congratulations, you've won!");
              const bestTimeKey = mode === 'normal' ? 'bestTimeNormal' : 'bestTimeHard';
              let bestTime = mode === 'normal' ? bestTimeNormal : bestTimeHard;
  
              // Update wins
              if (mode === 'normal') {
                  normalWins++;
                  document.getElementById('wins-count').textContent = normalWins;
              } else {
                  hardWins++;
                  document.getElementById('wins-count').textContent = hardWins;
              }
  
              // Check if this is a new best time
              if (!bestTime || timerSeconds < bestTime) {
                  bestTime = timerSeconds;
                  localStorage.setItem(bestTimeKey, bestTime);
                  document.getElementById('best-time-display').textContent = formatTime(bestTime);
                  alert('New best time!');
              }
          }
      }, 500);
  }
  
  /**
   * Update the best time display based on the current mode.
   */
  function updateBestTimeDisplay() {
      const bestTimeDisplay = document.getElementById('best-time-display');
      if (mode === 'normal') {
          bestTimeDisplay.textContent = bestTimeNormal ? formatTime(bestTimeNormal) : '--:--';
      } else {
          bestTimeDisplay.textContent = bestTimeHard ? formatTime(bestTimeHard) : '--:--';
      }
  }
  
  /**
   * Switch to Normal mode when the Normal button is clicked.
   */
  document.getElementById('normal-mode').addEventListener('click', function () {
      mode = 'normal';
      document.getElementById('normal-mode').classList.add('active');
      document.getElementById('hard-mode').classList.remove('active');
      updateBestTimeDisplay();
      startGame();
  });
  
  /**
   * Switch to Hard mode when the Hard button is clicked.
   */
  document.getElementById('hard-mode').addEventListener('click', function () {
      mode = 'hard';
      document.getElementById('normal-mode').classList.remove('active');
      document.getElementById('hard-mode').classList.add('active');
      updateBestTimeDisplay();
      startGame();
  });
  
  /**
   * Toggle the "How to Play" pane.
   */
  document.getElementById('how-to-play-btn').addEventListener('click', function () {
      const howToPlayPane = document.getElementById('how-to-play-pane');
      howToPlayPane.style.display = howToPlayPane.style.display === 'block' ? 'none' : 'block';
  });
  
  // Start the game initially in Normal mode
  startGame();


