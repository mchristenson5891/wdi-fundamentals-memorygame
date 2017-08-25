const cards = ["queen", "queen", "king", "king"];
const cardsInPlay = [];
let cardOne = cards[0];
let cardTwo = cards[2];
cardsInPlay.push(cardOne);
console.log("user flipped " + cardOne);
cardsInPlay.push(cardTwo);
console.log("user flipper " + cardTwo);

if (cardsInPlay.length === 2) {
	if (cardsInPlay[0] === cardsInPlay[1]) {
		alert("You found a match!");
	}
	else {
		alert("Sorry, try again.");
	}
}