const express = require("express");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () =>
  console.log("App is listening on http://localhost:3000")
);
