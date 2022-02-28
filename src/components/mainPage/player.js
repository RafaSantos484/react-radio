import { Card, Box, CardContent, Typography, IconButton } from "@mui/material";
import { connect } from "react-redux";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import CardMedia from "@mui/material/CardMedia";

import genericRadioImg from "../../assets/img/search/genericRadio.png";
import { Pause } from "@mui/icons-material";
import { useEffect, useState } from "react";

const Player = connect(mapStateToProps)((props) => {
  //console.log(props);
  let radio = props.selectedRadioReducer.radio;
  if (!radio) return <></>;

  let isPlaying = props.selectedRadioReducer.isPlaying;
  const [audio] = useState(new Audio());
  const [playPromise, setPlayPromise] = useState(true);
  //console.log(isPlaying);

  useEffect(() => {
    if (audio.currentSrc !== radio.url) playAudio();
  });

  function playAudio() {
    if (!playPromise) return;

    audio.pause();
    audio.src = radio.url;

    if (isPlaying) {
      setPlayPromise(false);
      audio
        .play()
        .then(() => {
          setPlayPromise(true);
        })
        .catch((err) => {
          console.log(err);
          alert("Falha ao tocar rádio. Recarregando página");
          window.location.reload();
        });
    }
  }

  const getRadioName = (name) => {
    if (name.length <= 13) return name.toUpperCase();

    return `${name.substring(0, 10).toUpperCase()}...`;
  };

  //if (isPlaying) playAudio();
  return (
    <Card
      sx={{
        height: "7rem",
        width: "100%",
        display: "flex",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
        <CardContent>
          <Typography component="div" variant="h7">
            {getRadioName(radio.name)}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              if (!playPromise) return;

              props.dispatch({
                type: "selectedRadio/set",
                payload: { radio: radio, isPlaying: !isPlaying },
              });
              isPlaying = !isPlaying;
              playAudio();
            }}
          >
            {isPlaying ? <Pause /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton>
            <SkipNextIcon />
          </IconButton>
        </Box>
      </Box>
      <CardMedia
        component="img"
        image={radio.favicon !== "" ? radio.favicon : genericRadioImg}
        alt="radio favicon"
        sx={{ width: "50%" }}
      />
    </Card>
  );
});

function mapStateToProps(state) {
  return state;
}

export default Player;
