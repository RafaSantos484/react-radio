import { useState } from "react";
import {
  CircularProgress,
  IconButton,
  TextField,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from "@mui/material";
import { Search } from "@mui/icons-material";

import styles from "./buscar-radio.module.css";
import { getSearchResult } from "../../../api/radio-browser";

import genericRadioImg from "../../../assets/dashboard/generic-radio-image.svg";

export function SearchRadio(props) {
  const { selectedRadio, setSelectedRadio } = props;

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

    const typographyStyle = {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      //marginBottom: "0.5em",
    };
    return searchResult.map((radio) => (
      <Card
        key={radio.stationuuid}
        sx={{
          width: "18vw",
          minWidth: "280px",
          height: "45vh",
          margin: "0.5em",
        }}
      >
        <CardActionArea
          onClick={() => setSelectedRadio(radio)}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CardMedia
            component="img"
            image={radio.favicon !== "" ? radio.favicon : genericRadioImg}
            alt="radio favicon"
            sx={{
              height: "70%",
              minHeight: "150px",
              width: "auto",
              padding: "0.3em",
            }}
          />
          <CardContent sx={{ width: "95%" }}>
            <Typography variant="h6" component="div" sx={typographyStyle}>
              {radio.name}
            </Typography>
            <Typography
              variant="h7"
              color="text.secondary"
              sx={typographyStyle}
            >
              {`${radio.state !== "" ? `${radio.state}, ` : ""}${
                radio.countrycode !== "" ? `${radio.countrycode}` : ""
              }`}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    ));
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
