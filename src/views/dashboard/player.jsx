import { Card, Typography, IconButton, CardMedia } from "@mui/material";
import {
  SkipPrevious,
  PlayArrow,
  SkipNext,
  Pause,
  Favorite,
  Stop,
} from "@mui/icons-material";

import genericRadioImg from "../../assets/dashboard/generic-radio-image.svg";
import { useState } from "react";
import { playAudio } from "../../api/radio-browser";
import { handleFavoriteClick } from "../../api/firebase";
import { setAlertInfo } from "../../App";

export function Player(props) {
  const {
    selectedRadio,
    setSelectedRadio,
    audio,
    user,
    playlistIndex,
    setPlaylistIndex,
  } = props;

  const [isPaused, setIsPaused] = useState(false);
  const [shouldReloadAudio, setShouldReloadAudio] = useState(false);
  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(true);

  if (!selectedRadio) return <></>;

  function handleSkipPreviousTrack() {
    setIsAwatingAsyncEvent(true);

    const newIndex =
      (playlistIndex - 1 + user.favorites.length) % user.favorites.length;
    setPlaylistIndex(newIndex);

    audio.src = user.favorites[newIndex].url;
    setSelectedRadio(user.favorites[newIndex]);
    playAudio(audio, user.favorites[newIndex], setIsAwatingAsyncEvent);
  }

  function handleSkipNextTrack() {
    setIsAwatingAsyncEvent(true);

    const newIndex = (playlistIndex + 1) % user.favorites.length;
    setPlaylistIndex(newIndex);

    audio.src = user.favorites[newIndex].url;
    setSelectedRadio(user.favorites[newIndex]);
    playAudio(audio, user.favorites[newIndex], setIsAwatingAsyncEvent);
  }

  navigator.mediaSession.setActionHandler(
    "previoustrack",
    playlistIndex === -1 ? null : handleSkipPreviousTrack
  );
  navigator.mediaSession.setActionHandler(
    "nexttrack",
    playlistIndex === -1 ? null : handleSkipNextTrack
  );
  navigator.mediaSession.setActionHandler("stop", () => setSelectedRadio(null));

  audio.onpause = () => {
    setIsPaused(true);
    //if (!isAwatingAsyncEvent)
    setShouldReloadAudio(true);
  };
  audio.onplay = () => setIsAwatingAsyncEvent(true);
  audio.onplaying = () => {
    if (shouldReloadAudio) {
      setIsAwatingAsyncEvent(true);
      audio.load();
      setShouldReloadAudio(false);
      playAudio(audio, selectedRadio, setIsAwatingAsyncEvent);
    } else {
      setIsAwatingAsyncEvent(false);
      setIsPaused(false);
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        maxHeight: "30vh",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CardMedia
        component="img"
        image={
          selectedRadio.favicon !== "" ? selectedRadio.favicon : genericRadioImg
        }
        draggable={false}
        alt="radio favicon"
        sx={{ maxHeight: "60%", width: "auto" }}
      />
      <Typography
        component="div"
        variant="h7"
        sx={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          width: "90%",
          maxHeight: "20%",
          margin: "0.5em 0",
        }}
      >
        {selectedRadio.name}
      </Typography>
      <div style={{ maxHeight: "20%" }}>
        {!user.isAnonymous && (
          <IconButton
            disabled={isAwatingAsyncEvent}
            sx={{
              color: user.favorites.find((f) => f.id === selectedRadio.id)
                ? "#ef7d1e"
                : "",
            }}
            onClick={() => {
              setIsAwatingAsyncEvent(true);
              handleFavoriteClick(user, selectedRadio)
                .catch((err) =>
                  setAlertInfo({ severity: "error", message: err.message })
                )
                .finally(() => setIsAwatingAsyncEvent(false));
            }}
          >
            <Favorite />
          </IconButton>
        )}
        <IconButton
          disabled={playlistIndex === -1 || user.favorites.length === 1}
          onClick={handleSkipPreviousTrack}
        >
          <SkipPrevious />
        </IconButton>
        <IconButton
          disabled={isAwatingAsyncEvent}
          onClick={() => {
            if (audio.paused) {
              // solicitou que toque rádio
              setIsAwatingAsyncEvent(true);
              playAudio(audio, selectedRadio, setIsAwatingAsyncEvent);
            } else {
              // pausou rádio
              audio.pause();
            }
          }}
        >
          {isPaused ? <PlayArrow /> : <Pause />}
        </IconButton>
        <IconButton
          disabled={isAwatingAsyncEvent}
          onClick={() => {
            audio.load();
            setSelectedRadio(null);
          }}
        >
          <Stop />
        </IconButton>
        <IconButton
          disabled={playlistIndex === -1 || user.favorites.length === 1}
          onClick={handleSkipNextTrack}
        >
          <SkipNext />
        </IconButton>
      </div>
    </Card>
  );
}
