import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";

import "../assets/styles/index.css";
import logo from "../assets/img/logo.png";

export default function Index() {
  const [inTitle, setInTitle] = React.useState(false);
  const [inSubTitle, setInSubTitle] = React.useState(false);
  const [inForm, setInForm] = React.useState(false);

  React.useEffect(() => {
    document.title = "React Radio";
    setInTitle(true);
    setTimeout(() => setInSubTitle(true), 150);
    setTimeout(() => setInForm(true), 300);
  }, []);

  return (
    <div className="container">
      <Slide direction="down" in={inTitle} timeout={300}>
        <h1 style={{ color: "wheat" }}>
          Milhares de rádios ao alcançe de um click
        </h1>
      </Slide>
      <Slide direction="down" in={inSubTitle} timeout={700}>
        <h3 style={{ color: "wheat", marginTop: "-0.5rem" }}>
          Logue ou <a href="cadastro">crie uma conta agora!</a>
        </h3>
      </Slide>
      <Slide direction="right" in={inForm} timeout={1200}>
        <form onSubmit={() => alert("Enviou form")} className="form">
          <img
            src={logo}
            alt="logo"
            style={{ maxWidth: "13rem", maxHeight: "13rem" }}
          />
          <TextField
            label="E-mail/Usuário"
            variant="outlined"
            type="email"
            style={{ margin: "1rem", width: "40%" }}
          />
          <TextField
            label="Senha"
            variant="outlined"
            type="password"
            style={{ margin: "1rem", width: "40%" }}
          />
          <Button
            variant="contained"
            type="submit"
            style={{ backgroundColor: "#ef7d1e" }}
          >
            Login
          </Button>
          <Button variant="text" style={{ color: "#ad323f", margin: "0.5rem" }}>
            Esqueci a senha
          </Button>
        </form>
      </Slide>
    </div>
  );
}
