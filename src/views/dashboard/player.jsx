import { Card, Box, Typography, IconButton } from "@mui/material";
import { SkipPrevious, PlayArrow, SkipNext, Pause } from "@mui/icons-material";
import CardMedia from "@mui/material/CardMedia";

import genericRadioImg from "../../assets/dashboard/generic-radio-image.svg";
import { useState } from "react";
import { setAlertInfo } from "../../App";

export function Player(props) {
  const {
    selectedRadio,
    audioInfo,
    setAudioInfo,
    isAwatingAsyncEvent,
    setIsAwatingAsyncEvent,
  } = props;

  const [isPaused, setIsPaused] = useState(false);

  if (!selectedRadio) return <></>;

  audioInfo.audio.onpause = () => {
    setIsPaused(true);
    setAudioInfo({ ...audioInfo, shouldRefreshAudio: true });
  };
  audioInfo.audio.onplaying = () => {
    if (audioInfo.shouldRefreshAudio) {
      audioInfo.audio.pause();

      const newAudio = new Audio(selectedRadio.url_resolved);
      setIsAwatingAsyncEvent(true);
      newAudio
        .play()
        .catch((err) => {
          console.log(err);
          setAlertInfo({
            severity: "error",
            message: "Falha ao tocar rádio",
          });
        })
        .then(() => {
          setAudioInfo({ audio: newAudio, shouldRefreshAudio: false });
          setIsPaused(false);
        })
        .finally(() => setIsAwatingAsyncEvent(false));
    } else {
      setIsPaused(false);
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CardMedia
        component="img"
        image={
          selectedRadio.favicon !== "" ? selectedRadio.favicon : genericRadioImg
        }
        alt="radio favicon"
        sx={{ maxHeight: "30vh", height: "auto", width: "100%" }}
      />
      <Typography
        component="div"
        variant="h7"
        sx={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          width: "90%",
          margin: "0.5em 0",
        }}
      >
        {selectedRadio.name}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <IconButton disabled={isAwatingAsyncEvent}>
          <SkipPrevious />
        </IconButton>
        <IconButton
          disabled={isAwatingAsyncEvent}
          onClick={() => {
            if (audioInfo.audio.paused) {
              // solicitou que toque rádio
              setIsAwatingAsyncEvent(true);
              audioInfo.audio
                .play()
                .catch((err) => {
                  console.log(err);
                  setAlertInfo({
                    severity: "error",
                    message: "Falha ao tocar rádio",
                  });
                })
                .finally(() => setIsAwatingAsyncEvent(false));
            } else {
              // pausou rádio
              audioInfo.audio.pause();
            }
          }}
        >
          {isPaused ? <PlayArrow /> : <Pause />}
        </IconButton>
        <IconButton disabled={isAwatingAsyncEvent}>
          <SkipNext />
        </IconButton>
      </Box>
    </Card>
  );
}
