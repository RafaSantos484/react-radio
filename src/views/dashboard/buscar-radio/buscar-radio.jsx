import { useState } from "react";
import {
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";

import styles from "./buscar-radio.module.css";
import { getSearchResult, playAudio } from "../../../api/radio-browser";

import { setDoc } from "../../../api/firebase";
import { RadioCard } from "../../../components/radio-card";

export function SearchRadio(props) {
  const { user, setUser, selectedRadio, setSelectedRadio, audio } = props;

  const [isSearching, setIsSearching] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);

  function handleSearch(keyCode = "Enter") {
    if (keyCode !== "Enter") return;
    if (searchVal.trim().length === 0) return setSearchVal("");
    if (isSearching) return;

    setIsSearching(true);

    getSearchResult(searchVal)
      .then((results) =>
        setSearchResult(
          results
            .filter((result) => result.name && result.url_resolved)
            .map((result) => ({
              id: result.stationuuid,
              name: result.name,
              url: result.url_resolved,
              favicon: result.favicon,
              state: result.state,
              countryCode: result.countrycode,
            }))
        )
      )
      .finally(() => setIsSearching(false));
  }

  function ResultComponent() {
    if (!searchResult) return <></>;
    if (searchResult.length === 0)
      return <Typography>Nenhuma rádio encontrada</Typography>;

    return searchResult
      .map((radio) => (
        <RadioCard
          key={radio.id}
          isAwatingAsyncEvent={isAwatingAsyncEvent}
          radio={radio}
          onClick={async () => {
            if (!selectedRadio || selectedRadio.id !== radio.id) {
              setIsAwatingAsyncEvent(true);

              let newHistory = user.history.filter((r) => r.id !== radio.id);
              newHistory.push(radio);
              user.isAnonymous
                ? setUser({ ...user, history: newHistory })
                : await setDoc(`users/${user.id}/history`, newHistory);

              setSelectedRadio(radio);
              audio.load();
              audio.src = radio.url;
              playAudio(audio, setIsAwatingAsyncEvent);
            }
          }}
        />
      ))
      .reverse();
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
                <Search sx={{ color: "#ad323f" }} />
              </IconButton>
            ),
          }}
          onKeyPress={(event) => handleSearch(event.code)}
          onChange={(event) => setSearchVal(event.target.value.trimStart())}
        />
      </div>
      <div className={styles.searchResultDiv}>
        {isSearching ? (
          <CircularProgress size="10vw" sx={{ color: "#ad323f" }} />
        ) : (
          <ResultComponent />
        )}
      </div>
    </div>
  );
}
