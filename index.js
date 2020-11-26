const express = require("express");
const exApp = express();
const http = require("http").createServer(exApp);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

/* TEST */
//game
const test = require("./server_scripts/test");
const testVal = test.testje();
console.log(testVal);

const deck = new test.Deck();
// shuffle cards in random order
deck.shuffle();
console.log(deck);

exApp.use(express.static("public"));

http.listen(port, () => {
  console.log(`Demo app listening at http://localhost:${port}`);
});

const clients = {};

io.on("connection", socket => {
  console.log("a user connected");

  // each client gets an id from socket.io, we can use it here
  clients[socket.id] = {
    id: socket.id,
  };
  // delete the id on disconnect
  socket.on("disconnect", () => {
    delete clients[socket.id];
  });

  // listen for login (name)
  socket.on("name", name => {
    console.log(`unSanitized name: ${name}`);

    if (name) {
      // trim unwanted characters
      name = name.match(/[A-Z-a-z-0-9]/g);
      // join the array of remaining letters
      name = name.join("");
      console.log(`Sanitized name: ${name}`);
    }
    if (name.length === 0) {
      socket.emit("name-error", "please enter a valid name");
      return;
    }

    // check if name is not already in use
    let nameInUse = false;
    for (const socketId in clients) {
      if (clients.hasOwnProperty(socketId)) {
        const otherClient = clients[socketId];
        if (otherClient.name === name) {
          nameInUse = true;
        }
      }
    }

    if (nameInUse) {
      socket.emit("name-error", "name is already in use");
      return;
    }

    clients[socket.id].name = name;
    socket.emit("name", clients[socket.id]);
  });

  // listen for msg
  socket.on("chat message", message => {
    console.log(`received: ${message}`);
    // send message back to everyone who is connected
    if (clients[socket.id].name) {
      io.emit("chat message", clients[socket.id], message);
      io.emit("test", testVal);
    }
  });
});
