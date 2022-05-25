const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");
const dbURL = require("./utils/db");
const app = express();

app.use(bodyParser.json());
app.use(userRoutes);
console.log(dbURL);
mongoose.connect(dbURL.DB_URL).then((result) => app.listen(8080));
