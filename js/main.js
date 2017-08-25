const cards = [
	{
		rank: "queen",
		suit: "hearts",
		cardImage: "images/queen-of-hearts.png"
	},
	{
		rank: "queen",
		suit: "diamonds",
		cardImage: "images/queen-of-hearts.png"
	},
	{
		rank: "king",
		suit: "hearts",
		cardImage: "images/queen-of-hearts.png"
	},
	{
		rank: "king",
		suit: "diamonds",
		cardImage: "images/queen-of-hearts.png"
	},	
];

const cardsInPlay = [];

const checkForMatch = () => {
	if (cardsInPlay.length === 2) {
		if (cardsInPlay[0] === cardsInPlay[1]) {
			alert("You found a match!");
		}
		else {
			alert("Sorry, try again.");
		}
	}
}

const flipCard = cardId => {
	console.log("User flipped " + cards[cardId].rank);
	console.log(cards[cardId].suit);
	console.log(cards[cardId].cardImage);
	cardsInPlay.push(cards[cardId].rank);
	checkForMatch();
}

flipCard(0);
flipCard(2);