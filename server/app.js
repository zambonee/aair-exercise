const express = require('express');
const app = express();
const rates = require('../utils/conversionRates');

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Hello from api!' });
});

/*
 * Returns the converted currency amount.
*/
app.get('/api/currencyConverter', (req, res) => {
  const fromCurrency = req.query.from;
  const toCurrency = req.query.to;
  const amountCurrency = req.query.amount;

  res.status(503).send('Not Implemented');
});

/*
 * Returns the user's local currency type based on the user geolocation.
*/
app.get('/api/locationToCurrency', (req, res) => {

  res.status(503).send('Not Implemented');
});

module.exports = app;