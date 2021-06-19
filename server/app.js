const express = require('express');
const app = express();
const ratesByCountryName = require('./utils/conversionRates');

const axios = require('axios')

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Hello from api!' });
});

/*
 * Returns the currencies that this currency converter supports.
*/
app.get('/api/currencies', (req, res) => {
  return res.status(200).send(Object.values(ratesByCountryName));
});

/*
 * Returns the converted currency amount.
*/
app.get('/api/currencyConverter', (req, res) => {
  const fromCurrency = req.query.from;
  const toCurrency = req.query.to;
  const amountCurrency = req.query.amount;

  if (!Number(amountCurrency)) {
    return res.status(400).send('invalid "amount" param');
  }
  const rates = Object.values(ratesByCountryName);

  const fromConversionRate = rates.find(rate => rate.currencyCode === fromCurrency);
  if (!fromConversionRate) {
    return res.status(400).send('invalid "from" param');
  }

  const toConversionRate = rates.find(rate => rate.currencyCode === toCurrency);
  if (!toConversionRate) {
    return res.status(400).send('invalid "to" param');
  }

  const newConversionRate = 1.0 / fromConversionRate['rateFromUSDToCurrency'] * toConversionRate['rateFromUSDToCurrency'];

  const amountInToCurrency = amountCurrency * newConversionRate;

  const responseObject = {
    amount: amountInToCurrency,
    conversionRate: newConversionRate,
  }

  return res.status(200).send(responseObject);
});

/*
 * Returns the user's local currency type based on the user geolocation.
*/
app.get('/api/locationToCurrency', (req, res) => {
  const ipAddress = req.ip;
  if (!ipAddress) {
    return res.status(400).send('could not get the request IP address');
  }

  const uri = `https://ipapi.co/${ipAddress}/currency`;
  axios.get(uri)
  .then((response) => {
    const responseObject = {
      currency: response.data,
    };
    return res.status(200).send(responseObject);
  })
  .catch((error) => {
    console.log(error);
    if (error.status == 404) {
      return res.status(404).send('could not get currency for region');
    }
    return res.status(500).send('unexpected error');
  });
});

module.exports = app;