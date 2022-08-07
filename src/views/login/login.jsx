import { Slide, Typography, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./login.module.css";

import logo from "../../assets/logo.png";
import { StyledTextField } from "../../components/styled-components";
import { getLoggedUser } from "../../api/firebase";

export function Login() {
  const navigate = useNavigate();
  const [titleIn, setTitleIn] = useState(false);
  const [subTitleIn, setSubTitleIn] = useState(false);
  const [formIn, setFormIn] = useState(false);
  const [isGettingUser, setIsGettingUser] = useState(true);

  function handleSubmit(event) {
    event.preventDefault();
  }

  useEffect(() => {
    document.title = "Login";
    if (isGettingUser) {
      return getLoggedUser((user) => {
        console.log(user);
        if (user && user.emailVerified) navigate("/dashboard");

        setIsGettingUser(false);

        setTitleIn(true);
        setTimeout(() => setSubTitleIn(true), 300);
        setTimeout(() => setFormIn(true), 500);
      });
    }
  }, [navigate, isGettingUser]);

  if (isGettingUser)
    return (
      <div className={styles.container}>
        <CircularProgress size="20vw" sx={{ color: "#ef7d1e" }} />
      </div>
    );

  return (
    <div className={styles.container}>
      <Slide direction="down" in={titleIn} timeout={500}>
        <Typography variant="h4" sx={{ color: "wheat", maxWidth: "90vw" }}>
          Milhares de rádios ao alcançe de um click
        </Typography>
      </Slide>
      <Slide direction="down" in={subTitleIn} timeout={800}>
        <div style={{ display: "flex" }}>
          <Typography
            variant="h6"
            sx={{ color: "wheat", maxWidth: "90vw", marginTop: "1em" }}
          >
            Faça login ou
          </Typography>
          <Typography>&nbsp;</Typography>
          <Typography
            variant="h6"
            sx={{ maxWidth: "90vw", marginTop: "1em" }}
            onClick={() => navigate("/cadastro")}
            className={styles.gotoRegisterLink}
          >
            {" "}
            crie uma conta agora!
          </Typography>
        </div>
      </Slide>

      <Slide direction="right" in={formIn} timeout={1200}>
        <form onSubmit={(event) => handleSubmit(event)} className={styles.form}>
          <img src={logo} alt="logo" />
          <StyledTextField
            label="E-mail/Usuário"
            variant="outlined"
            type="text"
            required
            sx={{ margin: "1em", width: "90%", maxWidth: "500px" }}
          />
          <StyledTextField
            label="Senha"
            variant="outlined"
            type="password"
            required
            sx={{ margin: "1em", width: "90%", maxWidth: "500px" }}
          />
          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#ef7d1e",
              "&:hover": {
                backgroundColor: "#eb934b",
              },
            }}
          >
            Login
          </Button>
          <Button variant="text" sx={{ color: "#ad323f", margin: "0.5rem" }}>
            Esqueci a senha
          </Button>
        </form>
      </Slide>
    </div>
  );
}
