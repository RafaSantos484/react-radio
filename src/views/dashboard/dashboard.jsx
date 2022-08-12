import React, { useEffect, useState } from "react";
import {
  Tab,
  Tabs,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  History,
  Favorite,
  Search,
  Menu,
  Close,
  ExitToApp,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./dashboard.module.css";

import logo from "../../assets/logo.png";
import { onRetrieveLoggedUser, logout, getDoc } from "../../api/firebase";
import { setAlertInfo } from "../../App";
import { SearchRadio } from "./buscar-radio/buscar-radio";
import { History as HistoryComponent } from "./historico/historico";
import { Player } from "./player";
import { Favorites } from "./favoritos/favoritos";

export function Dashboard() {
  const state = useLocation().state;
  const isAnonymous = state ? state.isAnonymous : -1;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [playlistIndex, setPlaylistIndex] = useState(-1);

  const audio = useState(new Audio())[0];
  const [selectedRadio, setSelectedRadio] = useState(null);

  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);
  const [tabsIndex, setTabsIndex] = useState(0);
  const [tabs, setTabs] = useState([
    {
      label: "Pesquisar rádio",
      icon: Search,
    },
    {
      label: "Histórico",
      icon: History,
    },
  ]);

  useEffect(() => {
    document.title = "Dashboard";

    if (isAnonymous === -1) return navigate("/");

    if (!user) {
      if (isAnonymous) {
        return setUser({ isAnonymous, history: [] });
      }

      if (tabs.length < 3) {
        setTabs(
          tabs.concat({
            label: "Favoritos",
            icon: Favorite,
          })
        );
      }

      onRetrieveLoggedUser((retrievedUser) => {
        if (!retrievedUser) return navigate("/");

        getDoc(`users/${retrievedUser.uid}`, (val) => {
          const history = val && val.history ? val.history : [];
          const favorites = val && val.favorites ? val.favorites : [];

          setUser({
            id: retrievedUser.uid,
            isAnonymous: false,
            name: retrievedUser.displayName,
            history,
            favorites,
          });
        }).catch((err) => {
          console.log(err);
          setAlertInfo({
            severity: "error",
            message:
              "Falha ao obter dados do usuário. Recarregue a página para tentar novamente",
          });
        });
      });
    }
  }, [isAnonymous, navigate, user, tabs]);

  if (!user)
    return (
      <div className={styles.container}>
        <CircularProgress size="20vw" sx={{ color: "#ef7d1e" }} />
      </div>
    );

  return (
    <div className={styles.container}>
      {isLeftBarOpen ? (
        <div className={`${styles.leftBar} ${styles.leftBarOpen}`}>
          <IconButton
            sx={{ alignSelf: "flex-end", position: "absolute" }}
            onClick={() => setIsLeftBarOpen(false)}
          >
            <Close />
          </IconButton>
          <img
            src={logo}
            alt="logo"
            draggable={false}
            style={{ width: "60%", minWidth: "120px" }}
          />
          {!user.isAnonymous && (
            <Typography
              sx={{ marginTop: "1em", color: "#ad323f" }}
            >{`Olá ${user.name}`}</Typography>
          )}
          <Tabs
            orientation="vertical"
            TabIndicatorProps={{ style: { background: "#ad323f" } }}
            value={tabsIndex}
            onChange={(event, newIndex) => setTabsIndex(newIndex)}
            sx={{ width: "100%", marginTop: "0.5em", marginBottom: "1em" }}
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const color = tabsIndex === index ? "#ef7d1e" : "";

              return (
                <Tab
                  key={index}
                  icon={<Icon sx={{ color }} />}
                  iconPosition="end"
                  label={
                    <Typography sx={{ width: "80%", color }}>
                      {tab.label}
                    </Typography>
                  }
                />
              );
            })}
          </Tabs>
          <Player
            selectedRadio={selectedRadio}
            setSelectedRadio={setSelectedRadio}
            audio={audio}
            user={user}
            playlistIndex={playlistIndex}
            setPlaylistIndex={setPlaylistIndex}
          />
          <Button
            variant="outlined"
            sx={{
              marginTop: "1em",
              backgroundColor: "inherit",
              color: "#ad323f",
              borderColor: "#ad323f",
              "&:hover": {
                backgroundColor: "inherit",
                color: "#ad323f",
                borderColor: "#ad323f",
              },
            }}
            onClick={() => {
              logout()
                .then(() => {
                  audio.load();
                  window.history.replaceState({ state: null }, document.title);
                  navigate("/");
                })
                .catch((err) =>
                  setAlertInfo({
                    severity: "error",
                    message: err.message,
                  })
                );
            }}
          >
            Sair
          </Button>
        </div>
      ) : (
        <div className={`${styles.leftBar} ${styles.leftBarClosed}`}>
          <IconButton onClick={() => setIsLeftBarOpen(true)}>
            <Menu />
          </IconButton>
          <div
            style={{
              margin: "2em 0",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const color = tabsIndex === index ? "#ef7d1e" : "";

              return (
                <IconButton
                  key={index}
                  sx={{ color }}
                  onClick={() => setTabsIndex(index)}
                >
                  <Icon />
                </IconButton>
              );
            })}
          </div>
          <IconButton
            sx={{
              position: "absolute",
              bottom: "5px",
              backgroundColor: "inherit",
              color: "#ad323f",
              borderColor: "#ad323f",
              "&:hover": {
                backgroundColor: "inherit",
                color: "#ad323f",
                borderColor: "#ad323f",
              },
            }}
            onClick={() => {
              logout()
                .then(() => {
                  audio.load();
                  window.history.replaceState({ state: null }, document.title);
                  navigate("/");
                })
                .catch((err) =>
                  setAlertInfo({
                    severity: "error",
                    message: err.message,
                  })
                );
            }}
          >
            <ExitToApp />
          </IconButton>
        </div>
      )}
      <div className={styles.selectedPageDiv}>
        {(() => {
          const Component = [SearchRadio, HistoryComponent, Favorites][
            tabsIndex
          ];

          return (
            <Component
              user={user}
              setUser={setUser}
              setSelectedRadio={setSelectedRadio}
              audio={audio}
              setPlaylistIndex={setPlaylistIndex}
            />
          );
        })()}
      </div>
    </div>
  );
}
