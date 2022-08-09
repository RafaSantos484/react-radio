import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";

import styles from "./cadastro.module.css";

import registerImg from "../../assets/register/register-img.svg";
import logo from "../../assets/logo.png";
import { StyledTextField } from "../../components/styled-components";
import { useNavigate } from "react-router-dom";
import { createUser, onRetrieveLoggedUser } from "../../api/firebase";
import { setAlertInfo } from "../../App";

export function Register() {
  const navigate = useNavigate();

  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);
  const [registerImgIn, setRegisterImgIn] = useState(false);
  const [formIn, setFormIn] = useState(false);
  const [dialogMessage, setDialogMessage] = useState(null);
  const [isGettingUser, setIsGettingUser] = useState(true);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setEmail(email.trim());
    setName(name.trim());
    if (isAwatingAsyncEvent) return;

    if (password !== confirmPassword) {
      return setAlertInfo({
        severity: "error",
        message: "As senhas não coincidem",
      });
    }

    setIsAwatingAsyncEvent(true);
    setAlertInfo({
      severity: "info",
      message: "Criando conta",
    });
    createUser(email, password, name)
      .then(() => {
        setAlertInfo(null);
        setDialogMessage(
          "Conta criada. Um email de verificação foi enviado. Verifique seu email, realize o login e começe a ouvir!"
        );
      })
      .catch((err) => {
        if (err.message.startsWith("Conta criada")) {
          return setDialogMessage(err.message);
        }

        setAlertInfo({
          severity: "error",
          message: err.message,
        });
      })
      .finally(() => setIsAwatingAsyncEvent(false));
  }

  useEffect(() => {
    document.title = "Cadastrar-se";

    if (isGettingUser) {
      return onRetrieveLoggedUser((user) => {
        if (user && (user.emailVerified || user.isAnonymous))
          navigate("/dashboard");

        setIsGettingUser(false);

        setFormIn(true);
        setTimeout(() => setRegisterImgIn(true), 400);
      });
    }
  });

  if (isGettingUser)
    return (
      <div className={styles.container}>
        <CircularProgress size="20vw" sx={{ color: "#ef7d1e" }} />
      </div>
    );

  return (
    <div className={styles.container}>
      <Dialog open={!!dialogMessage} onClose={() => navigate("/")}>
        <DialogTitle>Conta criada</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "#ef7d1e" }} onClick={() => navigate("/")}>
            Entendi
          </Button>
        </DialogActions>
      </Dialog>

      <div className={styles.imageDiv}>
        <Slide direction="right" in={registerImgIn} timeout={700}>
          <img src={registerImg} alt="Imagem cadastro" draggable={false} />
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
            draggable={false}
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
