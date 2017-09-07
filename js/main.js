const overlayElement = document.getElementById("overlay");
const scoreElement = document.getElementsByClassName("score");
const nextBtn = document.getElementById("next");
const tryAgainBtn = document.getElementById("try-again");
const matchMsg = document.getElementById("match");
const newGameBtn = document.getElementById("new-game");
const instructionsElement = document.getElementById("instructions");
const instructionLink = document.getElementById("instruction-link");
const closeBtn = document.getElementById("close");
const messageBox = document.getElementById("message-box");
const playingCards = document.getElementById("playing-cards");
const marvelElement = document.getElementById("marvel");
let usersPick;
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
const marvelCards = [
	{
		rank: "captain"
	},
	{
		rank: "captain"
	},
	{
		rank: "ironMan"
	},
	{
		rank: "ironMan"
	},	
];

// Add the event listeners to the the buttons.

nextBtn.addEventListener("click", nextRound);
tryAgainBtn.addEventListener("click", tryAgain);
newGameBtn.addEventListener("click", newGame);
instructionLink.addEventListener("click", showInstructions);
closeBtn.addEventListener("click", showInstructions);
playingCards.addEventListener("click", pickCards);
marvelElement.addEventListener("click", pickCards);



// tryAgain will be invoked when the try again button is click. It hides the overlay, flips the cards back, and puts the event listeners
// back on the cards.

function tryAgain() {
	toggleOverlay();
	showBackOfCards();
	hideBtns();
	addEventListenerToCards();
}

// The nextRound function will be attached to the the next button. It hides the overlay and buttons, resets the cardsInPlay array, it add the
// event listeners to the cards, and then will shuffle them after a 275 millisecond delay.

function nextRound () {
	toggleOverlay();
	hideBtns();
	cardsInPlay = [];
	showBackOfCards();
	addEventListenerToCards();
	setTimeout(shuffleCards, 275);
}

// Create the board - section and divs, and appends them to the game-board div.

function createBoard() {
	for (var i = 0; i < cards.length; i++) {
		const section = createSection();
		const cardDiv = createCardDiv(i)
		const frontDiv = createFrontCard(i, usersPick);
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
};

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

function createFrontCard(index, typeOfCard) {
	let cardsToUse = typeOfCard === "cards" ? true : false;
	const frontOfCard = document.createElement("div");
	const cardRank = cardsToUse ? cards[index].rank : marvelCards[index].rank;
	const cardSuit = cardsToUse ? cards[index].suit : "marvel";
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
	messageBox.setAttribute("class", "show");
	showMsg(match);
	showBtns(match);
	return toggleOverlay();
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
	for (var i = 0; i < scoreElement.length; i++) {
		const currentScore = parseInt(scoreElement[i].innerHTML);
		scoreElement[i].innerHTML = currentScore + num;
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

function pickCards() {
	const typeOfGame = document.getElementById("type-of-game");
	const usersCardPick = this.getAttribute("id");
	let choice = usersCardPick === "marvel" ? "marvel" : "cards" || "cards";
	usersPick = choice;
	typeOfGame.setAttribute("class", "hide");
	toggleOverlay();
	return createBoard();
}


function showInstructions() {
	const instructionsClassList = instructionsElement.classList;
	let showOrHide = instructionsClassList.contains("show") === true ? "hide" : "show";
	instructionsElement.setAttribute("class", showOrHide)
	return toggleOverlay();
}

function toggleOverlay() {
	const overlayClassList = overlayElement.classList;
	let toggle = overlayClassList.contains("show") === true ? "hide" : "show";
	return overlayElement.setAttribute("class", toggle);
}
