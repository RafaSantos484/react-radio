import React from "react";
import { styled } from "@mui/material/styles";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import styles from "../../assets/styles/search.module.css";

const StyledSearchField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#363636",
  },
});
const handleSearch = () => {
  alert("Pesquisou");
};

export default function Search() {
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSearch}>
        <StyledSearchField
          variant="filled"
          sx={{ bgcolor: "#ffac67", width: "80%" }}
          label="Pesquisar Rádio"
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </form>
      <div
        className={styles.results}
      >
        resultados da pesquisa
      </div>
    </div>
  );
}
