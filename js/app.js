/*
 * Create a list that holds all of your cards
 */

 /*
  * Display the cards on the page
  *   - shuffle the list of cards using the provided "shuffle" method below
  *   - loop through each card and create its HTML
  *   - add each card's HTML to the page
  */

  /*
   * set up the event listener for a card. If a card is clicked:
   *  - display the card's symbol (put this functionality in another function that you call from this one)
   *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
   *  - if the list already has another card, check to see if the two cards match
   *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
   *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
   *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
   *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/

const deck = document.querySelector('.deck');
const cards = document.querySelectorAll('.card');
const closeModal = document.querySelectorAll('.close-modal')
const replay = document.querySelectorAll('.replay');
const clock = document.querySelector('.clock');
const starList = document.querySelectorAll('.stars li');
const movesText = document.querySelector('.moves');

let toggledCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockID;
let matched = 0;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function shuffelDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for(card of shuffledCards) {
    deck.appendChild(card);
  }
}

shuffelDeck(); // shuffel deck on page load

// add event listner for card clicks
deck.addEventListener('click', event => {
  const clickTarget = event.target;
  if( isClickValid(clickTarget) ){
    if(clockOff){
      startClock();
      clockOff = false;
    }
  }

  toggleCard(clickTarget);
  addToggleCard(clickTarget);
  if(toggledCards.length === 2) {
    checkForMatch(clickTarget);
    addMove();
    checkScore();
  }
  console.log(matched);
  const totalPairs = 8;
  if(matched === totalPairs){
    gameOver();
  }
});

// add add event listners to close modals
document.querySelector('.restart').addEventListener('click', event =>{
  resetGame();
})

// add add event listners to close modals
document.querySelector('.modal-button-replay').addEventListener('click', event =>{
  toggleModel();
  resetGame();
})

// add event listner to close modal
Array.from(closeModal).forEach( element => {
  element.addEventListener('click', event => {
    toggleModel();
  });
});

// add event listners to restart game
function resetCards() {
  Array.from(cards).forEach(element => {
    element.classList.remove('open');
    element.classList.remove('show');
    element.classList.remove('match');
  });
}


// toggle cards
function toggleCard(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

// add to tggled card to array
function addToggleCard(clickTarget) {
  toggledCards.push(clickTarget)
}

// check for match
function checkForMatch() {
  if(
    toggledCards[0].firstElementChild.className ===
    toggledCards[1].firstElementChild.className
  ) {
    toggledCards[0].classList.toggle('match');
    toggledCards[1].classList.toggle('match');
    toggleCard(toggledCards[0]);
    toggleCard(toggledCards[1]);
    toggledCards = [];
    matched++;
  } else {
    setTimeout(() => {
      toggleCard(toggledCards[0]);
      toggleCard(toggledCards[1]);
      toggledCards = [];
    }, 1000)
  }
}

// check if click is valid
function isClickValid(clickTarget) {
  return(
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)
  );
}

// keep track of moves made
function addMove() {
  moves++
  movesText.innerHTML = moves;
}

function resetMoves() {
  moves = 0;
  movesText.innerHTML = moves;

}

function checkScore() {
  if(moves === 16 || moves === 24){
    hideStar();
  }
}

function hideStar() {

  for (star of starList) {
    if(star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  }
}

// start clock
function startClock() {
  clockID = setInterval(() => {
    time++;
    displayTime();
  }, 1000);
}

// stop clock
function stopClock() {
  clearInterval(clockID);
}

function resetClock() {
  clearInterval(clockID);
  clockOff = true;
  time = 0;
  displayTime();
}

// display time
function displayTime() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (seconds < 10){
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}

// set stars
function getStars() {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for(star of stars) {
    if (star.style.display !== 'none'){
      starCount++;
    };
  }
  return starCount;
}

//reset stars
function resetStars() {
  for (star of starList) {
      star.style.display = 'inline-block';
  }
}

// toggle modal
function toggleModel(){
  const modal = document.querySelector('.modal-background');
  modal.classList.toggle('hide');
}

// write stats to modal
function writeModalStats() {
  const timeStat = document.querySelector('.stats-time');
  const clockTime = document.querySelector('.clock').innerHTML;
  const movesStat = document.querySelector('.stats-moves');
  const starsStat = document.querySelector('.stats-stars');
  const stars = getStars();

  timeStat.innerHTML = `Time = ${clockTime}`;
  movesStat.innerHTML = `Moves = ${moves}`;
  starsStat.innerHTML = `Stars = ${stars}`;
}

function gameOver() {
  writeModalStats()
  stopClock();
  toggleModel();
}

function restart() {
  resetClock();
  resetStars();
  resetMoves();
  toggleModel();
  shuffelDeck();
}

function resetGame() {
  resetCards();
  resetClock();
  resetStars();
  resetMoves();
  shuffelDeck();
  matched = 0;
}
