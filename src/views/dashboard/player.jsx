import { Card, Box, CardContent, Typography, IconButton } from "@mui/material";
import { SkipPrevious, PlayArrow, SkipNext, Pause } from "@mui/icons-material";
import CardMedia from "@mui/material/CardMedia";

export function Player() {
  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "50%" }}>
        <CardContent>
          <Typography component="div" variant="h7">
            {}
          </Typography>
        </CardContent>
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
      </Box>
      <CardMedia
        component="img"
        image=""
        alt="radio favicon"
        sx={{ width: "50%" }}
      />
    </Card>
  );
}
