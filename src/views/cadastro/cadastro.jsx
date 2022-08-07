import { useState, useEffect } from "react";
import { Typography, Button, Slide } from "@mui/material";

import styles from "./cadastro.module.css";

import registerImg from "../../assets/register/register-img.svg";
import logo from "../../assets/logo.png";
import { StyledTextField } from "../../components/styled-components";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/firebase";

export function Register() {
  const navigate = useNavigate();

  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);
  const [registerImgIn, setRegisterImgIn] = useState(false);
  const [formIn, setFormIn] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (isAwatingAsyncEvent) return;

    if (password !== confirmPassword) {
      return alert("As senhas não coincidem");
    }

    setIsAwatingAsyncEvent(true);
    createUser(email, password, name)
      .then(() => alert("Conta criada"))
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => setIsAwatingAsyncEvent(false));
  }

  useEffect(() => {
    document.title = "Cadastrar-se";

    setFormIn(true);
    setTimeout(() => setRegisterImgIn(true), 400);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.imageDiv}>
        <Slide direction="right" in={registerImgIn} timeout={700}>
          <img src={registerImg} alt="Imagem cadastro" />
        </Slide>
      </div>
      <Slide direction="right" in={formIn} timeout={800}>
        <form onSubmit={(event) => handleSubmit(event)} className={styles.form}>
          <img
            onClick={() => {
              if (!isAwatingAsyncEvent) navigate("/");
            }}
            src={logo}
            alt="logo"
          />
          <Typography variant="h4" sx={{ color: "#ad323f", margin: "0.5em" }}>
            Cadastro
          </Typography>
          <StyledTextField
            label="E-mail"
            variant="outlined"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value.trim())}
            required
            sx={{ margin: "1rem", width: "90%", maxWidth: "500px" }}
            inputProps={{ maxLength: 50 }}
          />
          <StyledTextField
            label="Nome do usuário"
            variant="outlined"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value.trimStart())}
            required
            sx={{ margin: "1rem", width: "90%", maxWidth: "500px" }}
            inputProps={{ maxLength: 50 }}
          />
          <StyledTextField
            label="Senha"
            variant="outlined"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value.trim())}
            required
            sx={{ margin: "1rem", width: "90%", maxWidth: "500px" }}
            inputProps={{ maxLength: 15, minLength: 8 }}
          />
          <StyledTextField
            label="Confirmar Senha"
            variant="outlined"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value.trim())}
            required
            sx={{ margin: "1rem", width: "90%", maxWidth: "500px" }}
            inputProps={{ maxLength: 15, minLength: 8 }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={isAwatingAsyncEvent}
          >
            Cadastrar-se
          </Button>
        </form>
      </Slide>
    </div>
  );
}
