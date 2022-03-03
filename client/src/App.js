//import logo from './logo.svg';
//import './App.css';

import React from "react";
import Router from "./routes.js";

/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/

export default function App() {
  const [data, setData] = React.useState(null);

  const callBackendAPI = async () => {
    const response = await fetch("http://localhost:5000/express_backend");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  React.useEffect(() => {
    callBackendAPI()
      .then((res) => setData(res.express))
      .catch((err) => console.log(err));
  });

  if (!data) return <></>;
  return <Router />;
}

//export default App;
