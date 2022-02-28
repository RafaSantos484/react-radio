import { FavoriteBorderOutlined } from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";

import genericRadioImg from "../../assets/img/search/genericRadio.png";

const RadioCard = connect(mapStateToProps)((props) => {
  let radio = props.radio;

  const getRadioName = (name) => {
    if (name.length <= 13) return name.toUpperCase();

    return `${name.substring(0, 10).toUpperCase()}...`;
  };

  /*useEffect(() => {
    props.setRadioURL("");
  });*/

  return (
    <Card sx={{ width: "12rem", height: "21rem", margin: "1rem" }}>
      <CardActionArea
        onClick={() => {
          //props.setRadioURL(radio.url);
          //console.log(props);
          props.dispatch({
            type: "selectedRadio/set",
            payload: { radio: radio, isPlaying: true },
          });
        }}
      >
        <CardMedia
          component="img"
          image={radio.favicon !== "" ? radio.favicon : genericRadioImg}
          alt="radio favicon"
          height="200rem"
        />
        <CardContent sx={{ height: "4rem" }}>
          <Typography variant="h6" component="div">
            {getRadioName(radio.name)}
          </Typography>
          <Typography variant="h7" color="text.secondary">
            {`${radio.state !== "" ? `${radio.state}, ` : ""}${
              radio.countrycode !== "" ? `${radio.countrycode}` : ""
            }`}
          </Typography>
        </CardContent>
      </CardActionArea>
      <IconButton>
        <FavoriteBorderOutlined />
      </IconButton>
    </Card>
  );
});

function mapStateToProps(state) {
  return state;
}

export default RadioCard;
