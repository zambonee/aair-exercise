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

  const fromConversionRate = rates.find(rate => rate.currencyCode === fromCurrency);
  const toConversionRate = rates.find(rate => rate.currencyCode === toCurrency);
  const newConversionRate = 1.0 / fromConversionRate['rateFromUSDToCurrency'] * toConversionRate['rateFromUSDToCurrency'];

  const amountInToCurrency = amountCurrency * newConversionRate;

  const responseObject = {
    amount: amountInToCurrency.toFixed(2),
    conversionRate: newConversionRate.toFixed(2),
  }

  return res.status(200).send(responseObject)
});

/*
 * Returns the user's local currency type based on the user geolocation.
*/
app.get('/api/locationToCurrency', (req, res) => {

  res.status(503).send('Not Implemented');
});

module.exports = app;