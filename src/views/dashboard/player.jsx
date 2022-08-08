import { Card, Box, CardContent, Typography, IconButton } from "@mui/material";
import { SkipPrevious, PlayArrow, SkipNext, Pause } from "@mui/icons-material";
import CardMedia from "@mui/material/CardMedia";

import genericRadioImg from "../../assets/dashboard/generic-radio-image.svg";
import { useState } from "react";

export function Player(props) {
  const { selectedRadio, setSelectedRadio } = props;

  const audio = useState(new Audio())[0];

  if (!selectedRadio) return <></>;

  console.log(selectedRadio);
  if (audio.src !== selectedRadio.url_resolved) {
    audio.src = selectedRadio.url_resolved;
    //audio.play();
  }
  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <audio controls>
        <source src={selectedRadio.url_resolved} type="audio/ogg" />
      </audio>
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
        <IconButton>
          <SkipPrevious />
        </IconButton>
        <IconButton onClick={() => {}}>
          {true ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton>
          <SkipNext />
        </IconButton>
      </Box>
    </Card>
  );
}
