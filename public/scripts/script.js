import Deck, { Card } from "./deck.js";

{
  //init socket var
  let socket;
  socket = io();

  const init = () => {
    // game code
    const game = () => {
      const CARD_VALUE_MAP = {
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        J: 11,
        Q: 12,
        K: 13,
        A: 14,
      };

      const $computerCardSlot = document.querySelector(".computer-card-slot");
      const $playerCardSlot = document.querySelector(".player-card-slot");
      const $computerDeckElement = document.querySelector(".computer-deck");
      const $playerDeckElement = document.querySelector(".player-deck");
      const $main = document.querySelector("main");
      const $text = document.querySelector(".text");

      let playerDeck, computerDeck, inRound, stop;

      $main.addEventListener("click", () => {
        if (stop) {
          startGame();
          return;
        }
        if (inRound) {
          cleanBeforeRound();
        } else {
          flipCards();
        }
      });

      const flipCards = () => {
        inRound = true;

        const playerCard = playerDeck.pop();
        const computerCard = computerDeck.pop();

        $playerCardSlot.appendChild(playerCard.getHTML());
        $computerCardSlot.appendChild(computerCard.getHTML());

        updateDeckCount();

        if (isRoundWinner(playerCard, computerCard)) {
          $text.textContent = "Win";
          playerDeck.push(playerCard);
          playerDeck.push(computerCard);
        } else if (isRoundWinner(computerCard, playerCard)) {
          $text.textContent = "Lose";
          computerDeck.push(playerCard);
          computerDeck.push(computerCard);
        } else {
          $text.textContent = "Draw";
          playerDeck.push(playerCard);
          computerDeck.push(computerCard);
        }

        if (isGameOver(playerDeck)) {
          $text.textContent = "You Lose!";
          stop = true;
        } else if (isGameOver(computerDeck)) {
          $text.textContent = "You Win!";
          stop = true;
        }
      };

      const updateDeckCount = () => {
        $computerDeckElement.textContent = computerDeck.numOfCards;
        $playerDeckElement.textContent = playerDeck.numOfCards;
      };

      const cleanBeforeRound = () => {
        inRound = false;
        $text.textContent = "";
        $computerCardSlot.innerHTML = "";
        $playerCardSlot.innerHTML = "";

        updateDeckCount();
      };

      const isRoundWinner = (cardOne, cardTwo) => {
        return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value];
      };

      const isGameOver = deck => {
        return deck.numOfCards === 0;
      };

      const startGame = () => {
        const deck = new Deck();
        // shuffle cards in random order
        deck.shuffle();

        //console.log(deck.cards);
        // distribute cards evenly between players
        const deckMidPoint = Math.ceil(deck.numOfCards / 2);
        playerDeck = new Deck(deck.cards.slice(0, deckMidPoint));
        computerDeck = new Deck(
          deck.cards.slice(deckMidPoint, deck.numOfCards)
        );
        //computerDeck = new Deck([new Card("S", 2)]);

        inRound = false;
        stop = false;

        console.log(playerDeck);
        console.log(computerDeck);

        cleanBeforeRound();

        //   $computerCardSlot.appendChild(deck.cards[0].getHTML());
      };

      startGame();
    };

    // multiplayer code
    const mp = () => {
      //get message form
      const $msgForm = document.getElementById("msgForm");
      const $msgInput = document.getElementById("msgInput");
      //get chat element to display msges
      const $messagesList = document.querySelector(".messagesList");
      //get name form
      const $nameForm = document.getElementById("nameForm");
      const $nameInput = document.getElementById("nameInput");

      //login in: listen for submit event on nameForm
      $nameForm.addEventListener("submit", e => {
        e.preventDefault();
        //emit the name
        socket.emit("name", $nameInput.value);
      });

      //sending a msg: listen for submit event on form
      $msgForm.addEventListener("submit", e => {
        e.preventDefault();
        //emit the msg
        socket.emit("chat message", $msgInput.value);
        $msgForm.reset();
      });

      //receiving msgs: listen for incoming msgs
      socket.on("chat message", (client, message) => {
        console.log(`Received: ${message}`);
        console.log(client);

        // Display Chat
        const $el = document.createElement("li");
        $el.textContent = `${client.name}: ${message}`;
        $messagesList.appendChild($el);
      });
    };

    game();
    mp();
  };

  init();
}
