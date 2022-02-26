import React from "react";
import { styled } from "@mui/material/styles";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import styles from "../../assets/styles/search.module.css";

const StyledSearchField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#363636",
  },
});

export default function Search() {
  const [searchVal, setSearchVal] = React.useState("");
  const [radioURL, setRadioURL] = React.useState("");

  const handleSearch = async (keyCode = "Enter") => {
    if (keyCode !== "Enter") return;

    const response = await fetch(
      `http://de1.api.radio-browser.info/json/stations/byname/${searchVal}`
    );
    const result = await response.json();
    setRadioURL("");
    console.log(result.filter((value) => value.country === "Brazil"));
    //const filteredResult = result.filter((value) => value.country === "Brazil");
    const filteredResult = result;//TEMP
    console.log(filteredResult[0].url);
    setRadioURL(filteredResult[0].url);
    //console.log(radioURL);
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
      <div className={styles.results}>
        resultados da pesquisa
        {radioURL !== "" && (
          <audio controls autoPlay>
            <source src={radioURL} />
          </audio>
        )}
      </div>
    </div>
  );
}
