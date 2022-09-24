const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./app/routes/auth.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Lsitening at http://localhost:${PORT}`);
});