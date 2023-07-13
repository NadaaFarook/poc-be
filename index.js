require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const { ORIGIN } = process.env;
var corsOptions = {
  origin: ORIGIN,
};

app.use(cors());


app.use("/api", router);

app.get("/api", (req, res) => {
  res.send("Api Working!!");
});

const { PORT } = process.env;

app.listen(PORT, function () {
  console.log(
    "Server running on http://localhost:" + PORT + " at origin " + ORIGIN
  );
});
