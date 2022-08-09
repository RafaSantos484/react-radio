import React, { useEffect, useState } from "react";
import { Tab, Tabs, Button, Typography, CircularProgress } from "@mui/material";
import { History, Favorite, Search } from "@mui/icons-material";
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
  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);

  const audio = useState(new Audio())[0];
  const [selectedRadio, setSelectedRadio] = useState(null);

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

      if (!isAwatingAsyncEvent) {
        setIsAwatingAsyncEvent(true);
        onRetrieveLoggedUser((retrievedUser) => {
          if (!retrievedUser) return navigate("/");

          setTabs(
            tabs.concat({
              label: "Favoritos",
              icon: Favorite,
            })
          );
          getDoc(`users/${retrievedUser.uid}`, (val) => {
            const history = val && val.history ? val.history : [];
            const favorites = val && val.favorites ? val.favorites : [];

            setUser({
              id: retrievedUser.uid,
              isAnonymous: false,
              name: retrievedUser.displayName,
              history,
              favorites,
              playlist: [],
            });
            setIsAwatingAsyncEvent(false);
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
    }
  }, [isAnonymous, navigate, user, isAwatingAsyncEvent, tabs]);

  if (!user)
    return (
      <div className={styles.container}>
        <CircularProgress size="20vw" sx={{ color: "#ef7d1e" }} />
      </div>
    );

  console.log(user);
  return (
    <div className={styles.container}>
      <div className={styles.leftBar}>
        <img src={logo} alt="logo" draggable={false} style={{ width: "80%" }} />
        <Tabs
          orientation="vertical"
          TabIndicatorProps={{ style: { background: "#ad323f" } }}
          value={tabsIndex}
          onChange={(event, newIndex) => setTabsIndex(newIndex)}
          sx={{ margin: "2em 0", width: "100%" }}
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const color = tabsIndex === index ? "#ef7d1e" : "";

            return (
              <Tab
                key={index}
                disabled={isAwatingAsyncEvent}
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
        <Player selectedRadio={selectedRadio} audio={audio} user={user} />
        <Button
          variant="outlined"
          sx={{
            position: "absolute",
            bottom: "3vh",
            backgroundColor: "inherit",
            color: "#ad323f",
            borderColor: "#ad323f",
            "&:hover": {
              backgroundColor: "inherit",
              color: "#ad323f",
              borderColor: "#ad323f",
            },
          }}
          disabled={isAwatingAsyncEvent}
          onClick={() => {
            setIsAwatingAsyncEvent(true);
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
              )
              .finally(() => setIsAwatingAsyncEvent(false));
          }}
        >
          Sair
        </Button>
      </div>
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
            />
          );
        })()}
      </div>
    </div>
  );
}
