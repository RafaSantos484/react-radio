import { useState } from "react";
import {
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import styles from "./buscar-radio.module.css";
import { getSearchResult } from "../../../api/radio-browser";

export function SearchRadio(props) {
  const { audio } = props;

  const [isSearching, setIsSearching] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  function handleSearch(keyCode = "Enter") {
    if (keyCode !== "Enter") return;
    if (searchVal.trim().length === 0) return setSearchVal("");
    if (isSearching) return;

    setIsSearching(true);

    getSearchResult(searchVal)
      .then((results) =>
        setSearchResult(
          results.filter((result) => result.name && result.url_resolved)
        )
      )
      .finally(() => setIsSearching(false));
  }

  function ResultComponent() {
    if (!searchResult) return <></>;
    if (searchResult.length === 0)
      return <Typography>Nenhuma rádio encontrada</Typography>;

    console.log(searchResult);
    audio.src = searchResult[0].url_resolved;
    audio.play();
    return <Typography>Temp...</Typography>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchAreaDiv}>
        <TextField
          value={searchVal}
          variant="filled"
          InputLabelProps={{ style: { color: "#ad323f" } }}
          sx={{
            backgroundColor: "wheat",
            width: "80%",
            "& .MuiFilledInput-root": {
              "&:before ": { borderBottomColor: "#ad323f" },
              "&:after ": { borderBottomColor: "#ad323f" },
            },
          }}
          label="Pesquisar rádio"
          inputProps={{ maxLength: 50 }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleSearch()}>
                <SearchIcon sx={{ color: "#ad323f" }} />
              </IconButton>
            ),
          }}
          onKeyPress={(event) => handleSearch(event.code)}
          onChange={(event) => setSearchVal(event.target.value.trimStart())}
        />
      </div>
      <div className={styles.searchResultDiv}>
        {isSearching ? (
          <CircularProgress size="10vw" sx={{ color: "#ef7d1e" }} />
        ) : (
          <ResultComponent />
        )}
      </div>
    </div>
  );
}
