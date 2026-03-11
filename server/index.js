const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')
const cookieParser = require('cookie-parser'); // 1. Import it

require('dotenv').config()

const uri = process.env.ATLAS_URI;

const mongoose = require("mongoose");
const connect = mongoose.connect(uri)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(cors())
app.use(cookieParser()); // 2. Tell Express to use it! Make sure this is BEFORE your routes.

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/product', require('./routes/product'));

app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV === "production") {

  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}


const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});
