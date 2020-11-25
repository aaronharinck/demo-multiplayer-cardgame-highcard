const express = require("express");
const exApp = express();
const port = 3000;

exApp.use(express.static("public"));

exApp.listen(port, () => {
  console.log(`Demo app listening at http://localhost:${port}`);
});
