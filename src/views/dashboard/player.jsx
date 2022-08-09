import { Card, Box, Typography, IconButton } from "@mui/material";
import { SkipPrevious, PlayArrow, SkipNext, Pause } from "@mui/icons-material";
import CardMedia from "@mui/material/CardMedia";

import genericRadioImg from "../../assets/dashboard/generic-radio-image.svg";
import { useState } from "react";
import { playAudio } from "../../api/radio-browser";

export function Player(props) {
  const { selectedRadio, audio, user } = props;

  const [isPaused, setIsPaused] = useState(false);
  const [audioInfo, setAudioInfo] = useState({
    audio,
    shouldReloadAudio: false,
  });
  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(true);

  if (!selectedRadio) return <></>;

  audioInfo.audio.onpause = () => {
    setIsPaused(true);
    //if (!isAwatingAsyncEvent)
    setAudioInfo({ ...audioInfo, shouldReloadAudio: true });
  };
  audioInfo.audio.onplay = () => setIsAwatingAsyncEvent(true);
  audioInfo.audio.onplaying = () => {
    if (audioInfo.shouldReloadAudio) {
      setIsAwatingAsyncEvent(true);
      audioInfo.audio.load();
      setAudioInfo({ ...audioInfo, shouldReloadAudio: false });
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
        maxHeight: "35vh",
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
        sx={{ maxHeight: "70%", width: "auto" }}
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
        <IconButton
          disabled={
            isAwatingAsyncEvent || !user.playlist || user.playlist.length === 0
          }
        >
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
        <IconButton
          disabled={
            isAwatingAsyncEvent || !user.playlist || user.playlist.length === 0
          }
        >
          <SkipNext />
        </IconButton>
      </Box>
    </Card>
  );
}
