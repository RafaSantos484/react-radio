import { TextField } from "@mui/material";
import { styled } from "@mui/system";

export const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#ef7d1e",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "0.1em solid #ef7d1e",
    },
    "&:hover fieldset": {
      border: "0.1em solid #ef7d1e",
    },
    "&.Mui-focused fieldset": {
      border: "0.1em solid #ef7d1e",
    },
  },
});
