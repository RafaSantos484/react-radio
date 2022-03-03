import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import { useNavigate } from "react-router-dom";

import styles from "../assets/styles/register.module.css";
import logo from "../assets/img/logo.png";
import registerImg from "../assets/img/register/registerImg.svg";

export default function Register() {
  const [inRegisterImg, setInRegisterImg] = React.useState(false);
  const [inForm, setInForm] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    //TODO: validar entrada
    navigate("/main");
  };

  React.useEffect(() => {
    document.title = "Cadastrar-se";
    setInForm(true);
    setTimeout(() => setInRegisterImg(true), 400);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.registerDiv}>
        <Slide direction="right" in={inRegisterImg} timeout={700}>
          <img
            src={registerImg}
            alt="register"
            style={{ maxWidth: "50%", maxHeight: "100%" }}
          />
        </Slide>
        <Slide direction="right" in={inForm} timeout={800}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <a href="/">
              <img
                src={logo}
                alt="logo"
                style={{ maxWidth: "10rem", maxHeight: "10rem" }}
              />
            </a>
            <h1 style={{ color: "#ad323f" }}>Cadastro</h1>
            <TextField
              label="E-mail"
              variant="outlined"
              type="email"
              required
              style={{ margin: "1rem", width: "75%" }}
            />
            <TextField
              label="Nome do usuário"
              variant="outlined"
              type="text"
              required
              style={{ margin: "1rem", width: "75%" }}
            />
            <TextField
              label="Senha"
              variant="outlined"
              type="password"
              required
              style={{ margin: "1rem", width: "75%" }}
            />
            <TextField
              label="Confirmar Senha"
              variant="outlined"
              type="password"
              required
              style={{ margin: "1rem", width: "75%" }}
            />
            <Button
              variant="contained"
              type="submit"
              style={{ backgroundColor: "#ef7d1e", margin: "1rem" }}
            >
              Cadastrar-se
            </Button>
          </form>
        </Slide>
      </div>
    </div>
  );
}
