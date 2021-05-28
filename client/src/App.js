import React from "react";
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <auro-header>Currency Converter</auro-header>
      <p>{!data ? "Loading..." : data}</p>
    </div>
  );
}

export default App;