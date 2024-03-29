import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlertComponent } from "./components/alert-component.jsx";
import { Register } from "./views/cadastro/cadastro.jsx";
import { Dashboard } from "./views/dashboard/dashboard.jsx";
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
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
