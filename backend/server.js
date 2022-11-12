require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 1333;
const bodyParser = require("body-parser");

const app = express();
const cors = require("cors");
const databaseConnect = require("./config/connect");

app.use(express.json());
app.use(bodyParser.json());

app.use("/images", express.static("images"));
app.use(
  cors({
    origin: "*",
  })
);

app.use(require("./routes/hamsters"));

app.listen(port, () => {
  databaseConnect.connectToServer(function (err) {
    if (err) {
      console.error(err);
    }
  });
});
