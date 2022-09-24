const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

const db = require("./app/models");
const dbConfig = require("./app/config/db.config");

try {
    db.mongoose.connect(dbConfig.DB)
    .then(() => { 
          console.log('Successfully connected to MongoDB') })
} catch (err) {
    console.log('Cannot connect to the database' + err)
}

//routes
require('./app/routes/auth.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Lsitening at http://localhost:${PORT}`);
});