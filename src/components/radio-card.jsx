import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from "@mui/material";

import genericRadioImg from "../assets/dashboard/generic-radio-image.svg";

export function RadioCard(props) {
  const { onClick, radio, isAwatingAsyncEvent } = props;
  const typographyStyle = {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    //marginBottom: "0.5em",
  };

  return (
    <Card
      sx={{
        width: "18vw",
        minWidth: "280px",
        height: "45vh",
        margin: "0.5em",
      }}
    >
      <CardActionArea
        onClick={onClick}
        disabled={isAwatingAsyncEvent}
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
    </Card>
  );
}
