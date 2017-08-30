var overlay = document.getElementById("overlay");
var score = document.getElementsByClassName("score");
var nextBtn = document.getElementById("next");
var tryAgainBtn = document.getElementById("try-again");
var matchMsg = document.getElementById("match");
var newGameBtn = document.getElementById("new-game");

let cardsInPlay = [];
const cards = [
	{
		rank: "queen",
		suit: "hearts"
	},
	{
		rank: "queen",
		suit: "diamonds"
	},
	{
		rank: "king",
		suit: "hearts"
	},
	{
		rank: "king",
		suit: "diamonds"
	},	
];


console.log("working")
// Add the event listeners to the the buttons.

nextBtn.addEventListener("click", nextRound);
tryAgainBtn.addEventListener("click", tryAgain);
newGameBtn.addEventListener("click", newGame);


// tryAgain will be invoked when the try again button is click. It hides the overlay, flips the cards back, and puts the event listeners
// back on the cards.

function tryAgain() {
	overlay.setAttribute("class", "hide");
	showBackOfCards();
	hideBtns();
	addEventListenerToCards();
}

// The nextRound function will be attached to the the next button. It hides the overlay and buttons, resets the cardsInPlay array, it add the
// event listeners to the cards, and then will shuffle them after a 275 millisecond delay.

function nextRound () {
	overlay.setAttribute("class", "hide");
	hideBtns();
	cardsInPlay = [];
	showBackOfCards();
	addEventListenerToCards();
	setTimeout(shuffleCards, 275);
}

// Create the board - section and divs, and appends them to the game-board div. I used a Self-Invoking Function so that it will call itself.

function createBoard() {
	debugger;
	for (var i = 0; i < cards.length; i++) {
		const section = createSection();
		const cardDiv = createCardDiv(i)
		const frontDiv = createFrontCard(i);
		const backDiv = createBackCard();

		section.appendChild(cardDiv);
		cardDiv.appendChild(frontDiv);
		cardDiv.appendChild(backDiv);
		document.getElementById("game-board").appendChild(section);
		addEventListenerToCards();
	}
	shuffleCards();
	hideBtns();
	return;
}

// These functions below will create the actual card - front and back. 

function createSection() {
	const section = document.createElement("section");
	section.setAttribute("class", "container");
	return section;
}

function createCardDiv(index) {
	const cardDiv = document.createElement("div");
	cardDiv.setAttribute("class", "card");
	cardDiv.setAttribute("data-id", index);
	return cardDiv;
}

function createFrontCard(index) {
	const frontOfCard = document.createElement("div");
	const cardRank = cards[index].rank;
	const cardSuit = cards[index].suit;
	const cardClass = "front" + " " + cardRank + "-" + cardSuit;
	frontOfCard.setAttribute("class", cardClass);
	return frontOfCard;
}

function createBackCard() {
	const backOfCard = document.createElement("div");
	backOfCard.setAttribute('class', "back");
	return backOfCard;
}

function hideBtns() {
	tryAgainBtn.setAttribute("class", "hide");
	nextBtn.setAttribute("class", "hide");
	return;
}


// foundMatch function is passed a boolean and then is ran through two different fucntions to see what button and message to display. 

function foundMatch (match) {
	showMsg(match);
	showBtns(match);
	return overlay.setAttribute("class", "show");
}


function showBtns(match) {
	return match ? nextBtn.setAttribute("class", "show") : tryAgainBtn.setAttribute("class", "show");
}

function showMsg(match) {
	return matchMsg.innerHTML = match ? "You found a match!" : "Sorry, try again."
}

// showBackOfCards will get all the cards and see which ones are "flipped" and if they are it will flip them back so the back of the card is showing.

function showBackOfCards() {
	const cards = document.getElementsByClassName("card");
	for (var i = 0; i < cards.length; i++) {
		const classList = cards[i].classList
		if (classList.contains("flipped")) {
			classList.remove("flipped");
		}
	}
}


function changeScore(num) {
	for (var i = 0; i < score.length; i++) {
		const currentScore = parseInt(score[i].innerHTML);
		score[i].innerHTML = currentScore + num;
	}
	return;
}

function checkForMatch() {
	if (cardsInPlay[0] === cardsInPlay[1]) {
		changeScore(1)
		foundMatch(true);
	}
	else {
		foundMatch(false);
		cardsInPlay = [];
	}
}


function addEventListenerToCards() {
	const cards = document.getElementsByClassName("card");
	for (var i = 0; i < cards.length; i++) {
		cards[i].addEventListener("click", filpCard);
	}
	return;
}

// flipCard will add the class of "flipped" and is animated with CSS thats why i put a setTimeOut on the checkForMatch function - so the animation can
// complete before checking.

function filpCard(card) {
	const cardClasses = this.classList;
	const cardId = this.getAttribute("data-id");
	cardClasses.contains("flipped") === true ? cardClasses.remove("flipped") : cardClasses.add("flipped");
	cardsInPlay.push(cards[cardId].rank);
	this.removeEventListener("click", filpCard);
	if (cardsInPlay.length === 2) {
		setTimeout(checkForMatch, 600);
	}
}

function shuffleCards() {
	const cards = document.querySelectorAll("section");
	for (var i = cards.length; i >= 0; i--) {
		document.getElementById("game-board").appendChild(cards[Math.floor(Math.random() * i) | 0]);
	}
}

function newGame() {
	return document.location.reload();
}

createBoard();
