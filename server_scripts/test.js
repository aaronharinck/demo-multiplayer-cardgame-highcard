const testje = () => {
  const date = new Date();
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
};

const SUITS = ["♠", "♣", "♦", "♥"]; // array with card suits metadata
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

class Deck {
  // pass cards into constructor (could be 52 cards or even 2 x 54,... depending on the game)
  constructor(cards = newDeck()) {
    this.cards = cards;
  }

  get numOfCards() {
    return this.cards.length;
  }

  pop() {
    return this.cards.shift(); //pop returns the last array element, shift the first
  }

  push(card) {
    this.cards.push(card);
  }

  /* 
  shuffle cards in a random order
  https://thenewcode.com/1095/Shuffling-and-Sorting-JavaScript-Arrays
  https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
  */
  shuffle() {
    // flip all cards, go from the back of your list to the front
    // take current card and swap with a card that comes earlier in the deck
    for (let i = this.numOfCards - 1; i > 0; i--) {
      //get a random index before current card
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = this.cards[newIndex];
      // swap card we are currently on with the new card we got randomly
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }
}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  get color() {
    return this.suit === "♣" || "♠" ? "black" : "red";
  }

  getHTML() {
    const cardDiv = document.createElement("div");
    cardDiv.TextContent = this.suit;
    cardDiv.classList.add("card", this.color);
    cardDiv.dataset.value = `${this.value} ${this.suit}`;
    return cardDiv;
  }
}

const newDeck = () => {
  //flatMap combines multiple arrays within an array to one array [[0,1], 2] => [0,1,2]
  return SUITS.flatMap(suit => {
    // return for each suit an array of values
    return VALUES.map(value => {
      return new Card(suit, value);
    });
  });
};

module.exports = { testje, Deck };
