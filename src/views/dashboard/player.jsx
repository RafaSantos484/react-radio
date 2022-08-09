import { Card, Box, Typography, IconButton } from "@mui/material";
import { SkipPrevious, PlayArrow, SkipNext, Pause } from "@mui/icons-material";
import CardMedia from "@mui/material/CardMedia";

import genericRadioImg from "../../assets/dashboard/generic-radio-image.svg";
import { useState } from "react";
import { playAudio } from "../../api/radio-browser";

export function Player(props) {
  const { selectedRadio, audio } = props;

  const [isPaused, setIsPaused] = useState(false);
  const [audioInfo, setAudioInfo] = useState({
    audio,
    shouldReloadAudio: false,
  });
  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(true);

  if (!selectedRadio) return <></>;

  audioInfo.audio.onpause = () => {
    setIsPaused(true);
    if (!isAwatingAsyncEvent)
      setAudioInfo({ ...audioInfo, shouldReloadAudio: true });
  };
  audioInfo.audio.onplay = () => setIsAwatingAsyncEvent(true);
  audioInfo.audio.onplaying = () => {
    if (audioInfo.shouldReloadAudio) {
      audioInfo.audio.load();
      playAudio(audioInfo.audio, setIsAwatingAsyncEvent);
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
              playAudio(audioInfo.audio, setIsAwatingAsyncEvent);
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
