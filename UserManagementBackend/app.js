const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(userRoutes);

mongoose
  .connect(
    "mongodb+srv://suraj:Suraj123@cluster0.yizdy.mongodb.net/user?retryWrites=true&w=majority"
  )
  .then((result) => app.listen(8080));
