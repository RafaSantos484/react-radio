import React from "react";
import { styled } from "@mui/material/styles";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import RadioCard from "./radioCard";
import { getSearchResult } from "../../api";

import styles from "../../assets/styles/search.module.css";

const StyledSearchField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#363636",
  },
});

export default function Search() {
  const [searchVal, setSearchVal] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);

  const handleSearch = async (keyCode = "Enter") => {
    //let teste = new Audio(radioURL);
    //teste.play();
    if (keyCode !== "Enter") return;

    const result = await getSearchResult(searchVal);
    //setRadioURL("");
    //console.log(result.filter((value) => value.country === "Brazil"));
    const filteredResult = result; //TEMP
    //console.log(filteredResult[0].url);
    //setRadioURL(filteredResult[0].url);
    //console.log(radioURL);
    setSearchResult(filteredResult);
  };
  const ResultComponent = () => {
    if (searchResult.length === 0) {
      return (
        <div>
          <h1>Nenhuma rádio encontrada</h1>
        </div>
      );
    }
    return (
      <div className={styles.result}>
        {searchResult.map((radio) => {
          return <RadioCard radio={radio} key={radio.stationuuid} />;
        })}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchArea}>
        <StyledSearchField
          value={searchVal}
          variant="filled"
          sx={{ bgcolor: "#ffac67", width: "80%", margin: "1.2rem" }}
          label="Pesquisar Rádio"
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <IconButton onClick={() => handleSearch()}>
                <SearchIcon />
              </IconButton>
            ),
          }}
          onKeyPress={(event) => handleSearch(event.code)}
          onChange={(event) => setSearchVal(event.target.value)}
        />
      </div>
      <ResultComponent />
    </div>
  );
}
