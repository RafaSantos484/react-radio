import {
  Slide,
  Typography,
  Button,
  CircularProgress,
  Popper,
  Paper,
  Fade,
} from "@mui/material";
import { HelpOutline, GitHub } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./login.module.css";

import logo from "../../assets/logo.png";
import { StyledTextField } from "../../components/styled-components";
import {
  onRetrieveLoggedUser,
  login,
  sendVerificationEmail,
} from "../../api/firebase";
import { setAlertInfo } from "../../App";

export function Login() {
  const navigate = useNavigate();
  const [titleIn, setTitleIn] = useState(false);
  const [subTitleIn, setSubTitleIn] = useState(false);
  const [formIn, setFormIn] = useState(false);
  const [popperAnchor, setPopperAnchor] = useState(null);
  const [isGettingUser, setIsGettingUser] = useState(true);
  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event, isLoggingInAnonymously = false) {
    event.preventDefault();
    if (isAwatingAsyncEvent) return;

    setIsAwatingAsyncEvent(true);

    if (isLoggingInAnonymously) {
      return navigate("/dashboard", { state: { isAnonymous: true } });
    }

    setEmail(email.trim());
    login(email, password)
      .then(async (res) => {
        if (email !== "generico@email.com" && !res.user.emailVerified) {
          await sendVerificationEmail(res.user);
          return setAlertInfo({
            severity: "warning",
            message:
              "Email não verificado. um novo email de verificação foi enviado",
          });
        }
      })
      .catch((err) =>
        setAlertInfo({
          severity: "error",
          message: err.message,
        })
      )
      .finally(() => setIsAwatingAsyncEvent(false));
  }

  useEffect(() => {
    document.title = "Login";
    if (isGettingUser) {
      return onRetrieveLoggedUser((user) => {
        if (user && (user.emailVerified || user.email === "generico@email.com"))
          navigate("/dashboard", { state: { isAnonymous: false } });

        setIsGettingUser(false);

        setTitleIn(true);
        setTimeout(() => setSubTitleIn(true), 300);
        setTimeout(() => setFormIn(true), 600);
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
      <Slide direction="down" in={subTitleIn} timeout={500}>
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
            onClick={() => {
              if (!isAwatingAsyncEvent) navigate("/cadastro");
            }}
            className={styles.gotoRegisterLink}
          >
            {" "}
            crie uma conta agora!
          </Typography>
        </div>
      </Slide>

      <Slide direction="right" in={formIn} timeout={900}>
        <form onSubmit={(event) => handleSubmit(event)} className={styles.form}>
          <img src={logo} alt="logo" draggable={false} />
          <StyledTextField
            label="E-mail"
            variant="outlined"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value.trim())}
            required
            sx={{ margin: "1em", width: "90%", maxWidth: "500px" }}
            inputProps={{ maxLength: 50 }}
          />
          <StyledTextField
            label="Senha"
            variant="outlined"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value.trim())}
            required
            sx={{ margin: "1em", width: "90%", maxWidth: "500px" }}
            inputProps={{ maxLength: 15, minLength: 8 }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={isAwatingAsyncEvent}
            sx={{
              backgroundColor: "#ef7d1e",
              "&:hover": {
                backgroundColor: "#eb934b",
              },
            }}
          >
            Login
          </Button>
          <Button
            variant="text"
            sx={{ color: "#ad323f", marginTop: "0.5rem" }}
            disabled={isAwatingAsyncEvent}
          >
            Esqueci a senha
          </Button>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="text"
              sx={{ color: "#ef7d1e" }}
              disabled={isAwatingAsyncEvent}
              onClick={(event) => handleSubmit(event, true)}
            >
              Entrar sem fazer login
            </Button>
            <HelpOutline
              sx={{ color: "#ef7d1e", margin: "0 0.2em" }}
              onMouseEnter={(event) => setPopperAnchor(event.currentTarget)}
              onMouseLeave={() => setPopperAnchor(null)}
            />
            <Popper
              open={!!popperAnchor}
              anchorEl={popperAnchor}
              placement="left-start"
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper
                    sx={{
                      width: "250px",
                      backgroundColor: "wheat",
                      padding: "0.3em",
                    }}
                  >
                    <Typography>
                      Se não fizer login, seu histórico não será armazenado e
                      você não poderá salvar suas rádios favoritas
                    </Typography>
                  </Paper>
                </Fade>
              )}
            </Popper>
          </div>
          <a
            href="https://github.com/RafaSantos484/react-radio"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubButton}
          >
            <GitHub />
          </a>
        </form>
      </Slide>
    </div>
  );
}
