import React, { useState } from "react";
import { Tab, Tabs, Button } from "@mui/material";
import { History, Favorite } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

import styles from "../assets/styles/mainPage.module.css";
import logo from "../assets/img/logo.png";

import Search from "../components/mainPage/search";
import Favorites from "../components/mainPage/favorites";
import RadioHistory from "../components/mainPage/radioHistory";

const StyledExitButton = styled(Button)({
  "&.MuiButton-outlined": {
    color: "#ad323f",
    borderColor: "#ad323f",
  },
});

export default function MainPage() {
  const navigate = useNavigate();
  const [tabsValue, setTabsValue] = React.useState(0);

  const GetComponent = (props) => {
    switch (props.index) {
      case 0:
        return <Search />;
      case 1:
        return <Favorites />;
      case 2:
        return <RadioHistory />;
      default:
        return <></>;
    }
  };

  useState(() => {
    document.title = "Página Principal";
  });

  return (
    <div className={styles.container}>
      <div className={styles.leftBar}>
        <div className={styles.tabs}>
          <img
            src={logo}
            alt="logo"
            style={{ maxWidth: "10rem", maxHeight: "10rem" }}
          />
          <Tabs
            orientation="vertical"
            value={tabsValue}
            onChange={(event, newVal) => setTabsValue(newVal)}
            style={{ width: "100%" }}
          >
            <Tab
              icon={<SearchIcon />}
              iconPosition="end"
              label="Pesquisar rádio"
            />
            <Tab
              icon={<Favorite />}
              iconPosition="end"
              label="Rádios favoritas"
            />
            <Tab icon={<History />} iconPosition="end" label="Histórico" />
          </Tabs>
        </div>
        <div className={styles.bottomButton}>
          <StyledExitButton
            variant="outlined"
            style={{
              margin: "3rem",
            }}
            onClick={() => navigate("/")}
          >
            Sair
          </StyledExitButton>
        </div>
      </div>
      <GetComponent index={tabsValue} />
    </div>
  );
}
