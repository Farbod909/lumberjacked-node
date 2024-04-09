const express = require('express');

const app = new express();

app.listen(8080, (req, res) => {
  console.log("Listening on port 8080.");
})

app.get("/", (req, res) => {
  res.end("Hello there!");
})