import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";

import styles from "../assets/styles/index.module.css";
import logo from "../assets/img/logo.png";

export default function Index() {
  const [inTitle, setInTitle] = React.useState(false);
  const [inSubTitle, setInSubTitle] = React.useState(false);
  const [inForm, setInForm] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    //TODO: validar entrada
    navigate("/main");
  };

  React.useEffect(() => {
    document.title = "React Radio";
    setInTitle(true);
    setTimeout(() => setInSubTitle(true), 150);
    setTimeout(() => setInForm(true), 300);
  }, []);

  return (
    <div className={styles.container}>
      <Slide direction="down" in={inTitle} timeout={300}>
        <h1 style={{ color: "wheat" }}>
          Milhares de rádios ao alcançe de um click
        </h1>
      </Slide>
      <Slide direction="down" in={inSubTitle} timeout={700}>
        <h3 style={{ color: "wheat", marginTop: "-0.5rem" }}>
          Logue ou{" "}
          <a href="cadastro" style={{ color: "#ef7d1e" }}>
            crie uma conta agora!
          </a>
        </h3>
      </Slide>
      <Slide direction="right" in={inForm} timeout={1200}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <img
            src={logo}
            alt="logo"
            style={{ maxWidth: "13rem", maxHeight: "13rem" }}
          />
          <TextField
            label="E-mail/Usuário"
            variant="outlined"
            type="text"
            required
            style={{ margin: "1rem", width: "40%" }}
          />
          <TextField
            label="Senha"
            variant="outlined"
            type="password"
            required
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
