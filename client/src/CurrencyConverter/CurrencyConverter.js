import React, {useState, useEffect} from "react";
import "./CurrencyConverter.scss";

import "@alaskaairux/auro-header";
import "@alaskaairux/auro-alerts";
import "@alaskaairux/auro-button";

const CurrencyConverter = () => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('');
  const [conversionError, setConversionError] = useState('');

  const updateAmount = (event) => {
    reset();
    setAmount(Number(event.target.value));
  };
  const updateFromCurrency = (event) => {
    reset();
    setFromCurrency(event.target.value);
  };
  const updateToCurrency = (event) => {
    reset();
    setToCurrency(event.target.value);
  };

  const reset = () => {
    setConvertedAmount(0);
    setConversionRate(0);
    setConversionError(null);
  }

  const convertFunds = () => {
    fetch(`/api/currencyConverter?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`)
      .then(async (response) => {
        if (!response.ok) {
          throw await response.json();
        }
        return response.json()
      })
      .then((body) => {
        setConvertedAmount(body.amount);
        setConversionRate(body.conversionRate);
      }).catch(error => {
        console.error(error);    
        setConversionError(error.message);
      });
  }

  const roundToCent = (x) => {
    return x.toFixed(2);
  }

  const setLocalCurrency = () => {
    fetch('/api/locationToCurrency')
      .then((res) => res.json())
      .then((body) => {
        const isSupported = supportedCurrencies.some(c => c.currency === body.currency)
        if (isSupported) {
          setFromCurrency(body.currency);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    fetch("/api/currencies")
      .then((res) => res.json())
      .then((body) => setSupportedCurrencies(body))
      .then(() => setLocalCurrency())
  }, []);

  return (
    <div className="container-sm">
      <auro-header display="650">Currency Converter</auro-header>
      <p>Select amount and currency you would like to convert.</p>
      <div className="form-group col">
        <label htmlFor="amount" className="control-label">Amount: </label>
        <input id="amount" type="number" onChange={updateAmount} className="form-control"></input>
      </div>
      <div className="form-group col">
        <label htmlFor="from" className="control-label">From this currency </label>
        <select
          value = {fromCurrency}
          onChange={updateFromCurrency}
          id="from"
          className="form-control"
        >
          <option value="" disabled>
            Select a currency
          </option>
          {supportedCurrencies.map((currency, index) => (
            <option key={index} value={currency.currencyCode}>
              {currency.fullCurrencyName} ({currency.currencyCode})
            </option>
          ))}
        </select>
      </div>
      <div className="form-group col">
        <label htmlFor="to" className="control-label">To this currency </label>
        <select
          onChange={updateToCurrency}
          id="to"
          defaultValue=""
          className="form-control"
        >
          <option value="" disabled>
            Select a currency
          </option>
          {supportedCurrencies.map((currency, index) => (
            <option key={index} value={currency.currencyCode}>
              {currency.fullCurrencyName} ({currency.currencyCode})
            </option>
          ))}
        </select>
      </div>
      <div className="col text-center p-3">
        {/* auro-button disabled prop doesn't work, can't use it for gated validation */}
        <auro-button onClick={convertFunds}>Convert</auro-button>
      </div>
      <div>
        {(convertedAmount && conversionRate) ? 
        <>
            <p className="text-center util_body--lg">{roundToCent(amount)} ({fromCurrency}) = {roundToCent(convertedAmount)} ({toCurrency})</p>
            <small className="text-muted">Conversion rate (updates daily): 1 {fromCurrency} =  {roundToCent(conversionRate)} {toCurrency}</small>
        </> : ``}
        {conversionError ? <auro-alerts error role="error">{conversionError}</auro-alerts>: ``}
        <div className="row">
          <small className="col text-muted">Purchases at alaskaair.com are in U.S. dollars.</small>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;