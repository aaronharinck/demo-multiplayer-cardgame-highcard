const express = require("express");
const exApp = express();
const http = require("http").createServer(exApp);
const io = require("socket.io")(http);
const port = 3000;

exApp.use(express.static("public"));

http.listen(port, () => {
  console.log(`Demo app listening at http://localhost:${port}`);
});

io.on("connection", socket => {
  console.log("a user connected");

  // listen for msg
  socket.on("chat message", message => {
    console.log(`received: ${message}`);
  });
});
