const express = require("express");
const exApp = express();
const http = require("http").createServer(exApp);
const io = require("socket.io")(http);
const port = 3000;

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
    console.log(`Name: ${name}`);
    clients[socket.id].name = name;
  });

  // listen for msg
  socket.on("chat message", message => {
    console.log(`received: ${message}`);
    // send message back to everyone who is connected
    if (clients[socket.id].name) {
      io.emit("chat message", clients[socket.id], message);
    }
  });
});
