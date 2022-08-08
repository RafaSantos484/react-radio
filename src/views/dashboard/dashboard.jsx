import React, { useEffect, useState } from "react";
import { Tab, Tabs, Button, Typography, CircularProgress } from "@mui/material";
import { History, Favorite, Search } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./dashboard.module.css";

import logo from "../../assets/logo.png";
import { onRetrieveLoggedUser, logout } from "../../api/firebase";
import { setAlertInfo } from "../../App";
import { SearchRadio } from "./buscar-radio/buscar-radio";
import { Player } from "./player";

export function Dashboard() {
  const state = useLocation().state;
  const isAnonymous = state ? state.isAnonymous : -1;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);

  //const audio = useState(new Audio())[0];
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

      return onRetrieveLoggedUser((retrievedUser) => {
        console.log(retrievedUser);
        if (retrievedUser && retrievedUser.emailVerified) {
          setTabs(
            tabs.concat({
              label: "Favoritos",
              icon: Favorite,
            })
          );
          setUser({ isAnonymous: false, name: retrievedUser.displayName });
          //TODO: obter histórico e favoritos do realtime database
        } else {
          navigate("/");
        }
      });
    }
  }, [user, isAnonymous, tabs, navigate]);

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
        <img src={logo} alt="logo" />
        <Tabs
          orientation="vertical"
          TabIndicatorProps={{ style: { background: "#ad323f" } }}
          value={tabsIndex}
          onChange={(event, newIndex) => setTabsIndex(newIndex)}
          sx={{ margin: "2em 0" }}
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
        <Player
          selectedRadio={selectedRadio}
          setSelectedRadio={setSelectedRadio}
        />
        <Button
          variant="outlined"
          sx={{
            position: "absolute",
            bottom: "10vh",
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
            if (isAwatingAsyncEvent) return;

            setIsAwatingAsyncEvent(true);
            logout()
              .then(() => {
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
          const Temp = () => <Typography>temp...</Typography>;
          const Component = [SearchRadio, Temp, Temp][tabsIndex];

          return (
            <Component
              selectedRadio={selectedRadio}
              setSelectedRadio={setSelectedRadio}
            />
          );
        })()}
      </div>
    </div>
  );
}
