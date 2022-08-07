import React, { useEffect, useState } from "react";
import { Tab, Tabs, Button, Typography, CircularProgress } from "@mui/material";
import { History, Favorite, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import styles from "./dashboard.module.css";

import logo from "../../assets/logo.png";
import { onRetrieveLoggedUser, logout } from "../../api/firebase";
import { setAlertInfo } from "../../App";
import { SearchRadio } from "./buscar-radio/buscar-radio";
import { Player } from "./player";

export function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);

  const audio = useState(new Audio())[0];

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

    if (!user) {
      return onRetrieveLoggedUser((user) => {
        console.log(user);
        if (user) {
          if (user.emailVerified) {
            setTabs(
              tabs.concat({
                label: "Favoritos",
                icon: Favorite,
              })
            );
          } else if (!user.isAnonymous) {
            return navigate("/");
          }

          setUser(user);
        } else {
          navigate("/");
        }
      });
    }
  });

  if (!user)
    return (
      <div className={styles.container}>
        <CircularProgress size="20vw" sx={{ color: "#ef7d1e" }} />
      </div>
    );

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
        <Player />
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
            logout(user)
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

          return <Component audio={audio} />;
        })()}
      </div>
    </div>
  );
}
