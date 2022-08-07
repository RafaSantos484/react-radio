/*import logo from './logo.svg';
import './App.css';

function App() {
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

import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlertComponent } from "./components/alertComponent.jsx";
import { Register } from "./views/cadastro/cadastro.jsx";
import { Login } from "./views/login/login.jsx";

let set = null;
export function setAlertInfo(info) {
  if (set) {
    set(info);
  }
}

function App() {
  const [alertInfo, setAlertInfo] = useState(null);
  set = setAlertInfo;

  return (
    <BrowserRouter>
      <AlertComponent alertInfo={alertInfo} setAlertInfo={setAlertInfo} />

      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
