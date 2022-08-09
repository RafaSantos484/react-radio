import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import { Favorite, Delete } from "@mui/icons-material";

import genericRadioImg from "../assets/dashboard/generic-radio-image.svg";
import { setDoc } from "../api/firebase";
import { setAlertInfo } from "../App";

export function RadioCard(props) {
  const {
    onClick,
    radio,
    user,
    setUser,
    isAwatingAsyncEvent,
    setIsAwatingAsyncEvent,
    page,
  } = props;
  const typographyStyle = {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    //marginBottom: "0.5em",
  };

  function handleFavoriteClick() {
    setIsAwatingAsyncEvent(true);

    let action;
    let actionMessage;
    if (user.favorites.findIndex((f) => f.id === radio.id) !== -1) {
      action = setDoc(
        `users/${user.id}/favorites`,
        user.favorites.filter((f) => f.id !== radio.id)
      );
      actionMessage = "remover";
    } else {
      const newFavorites = user.favorites;
      newFavorites.push(radio);
      action = setDoc(`users/${user.id}/favorites`, newFavorites);
      actionMessage = "adicionar";
    }

    action
      .catch((err) => {
        console.log(err);
        setAlertInfo({
          severity: "error",
          message: `Falha ao ${actionMessage} favorito`,
        });
      })
      .finally(() => setIsAwatingAsyncEvent(false));
  }

  async function handleDeleteClick() {
    setIsAwatingAsyncEvent(true);

    if (page === "histórico") {
      let newHistory = user.history.filter((r) => r.id !== radio.id);
      user.isAnonymous
        ? setUser({ ...user, history: newHistory })
        : await setDoc(`users/${user.id}/history`, newHistory);
    } else {
      //page === favoritos
      await setDoc(
        `users/${user.id}/favorites`,
        user.favorites.filter((f) => f.id !== radio.id)
      );
    }
    setIsAwatingAsyncEvent(false);
  }

  return (
    <Card
      sx={{
        width: "18vw",
        minWidth: "280px",
        height: "50vh",
        margin: "0.5em",
      }}
    >
      <CardActionArea
        onClick={onClick}
        disabled={isAwatingAsyncEvent}
        sx={{
          width: "100%",
          height: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CardMedia
          component="img"
          image={radio.favicon !== "" ? radio.favicon : genericRadioImg}
          alt="radio favicon"
          draggable={false}
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
          <Typography variant="h7" color="text.secondary" sx={typographyStyle}>
            {`${radio.state !== "" ? `${radio.state}, ` : ""}${
              radio.countryCode !== "" ? `${radio.countryCode}` : ""
            }`}
          </Typography>
        </CardContent>
      </CardActionArea>
      {(page === "buscar rádio" || page === "histórico") && !user.isAnonymous && (
        <IconButton
          sx={{
            color: user.favorites.find((f) => f.id === radio.id)
              ? "#ef7d1e"
              : "",
          }}
          onClick={handleFavoriteClick}
          disabled={isAwatingAsyncEvent}
        >
          <Favorite />
        </IconButton>
      )}
      {(page === "histórico" || page === "favoritos") && (
        <IconButton onClick={handleDeleteClick} disabled={isAwatingAsyncEvent}>
          <Delete />
        </IconButton>
      )}
    </Card>
  );
}
