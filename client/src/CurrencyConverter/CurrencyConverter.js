import React, {useState, useEffect} from "react";
import "./CurrencyConverter.css";

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
    <div className="CurrencyConverter">
      <auro-header display="500">Currency Converter</auro-header>
      <div>
        <div>
          <label htmlFor="amount">Amount: </label>
          <input name="amount" type="number" onChange={updateAmount}></input>
        </div>
        <div>
          <label htmlFor="from">From this currency </label>
          <select
            value = {fromCurrency}
            onChange={updateFromCurrency}
            name="from"
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
        <div>
          <label htmlFor="to">To this currency </label>
          <select
            onChange={updateToCurrency}
            name="to"
            defaultValue=""
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
      </div>
      <button onClick={convertFunds}>Convert</button>
      <div>
        {(convertedAmount && conversionRate) ? 
        <>
            <p>
            <strong>{amount} ({fromCurrency}) = {convertedAmount} ({toCurrency})</strong>
            </p>
            <p>Conversion rate (updates daily): 1 {fromCurrency} =  {conversionRate} {toCurrency}</p>
        </> : ``}
        {conversionError != null ? <p>{conversionError}</p>: ``}
        <p>Purchases at alaskaair.com are in U.S. dollars.</p>
      </div>
    </div>
  );
};

export default CurrencyConverter;