import { Close } from "@mui/icons-material";
import { Alert, IconButton, Slide } from "@mui/material";

// severity => error, info, success or warning

export function AlertComponent(props) {
  const { alertInfo, setAlertInfo } = props;

  if (!alertInfo) return <></>;
  return (
    <Slide in={!!alertInfo}>
      <div
        style={{
          display: "flex",
          width: "100vw",
          justifyContent: "center",
          position: "fixed",
          top: "15px",
          zIndex: 100,
        }}
      >
        <Alert
          sx={{ maxWidth: "300px" }}
          severity={alertInfo.severity}
          action={
            <div>
              <IconButton
                color={alertInfo.severity}
                size="small"
                onClick={() => {
                  setAlertInfo(null);
                }}
              >
                <Close />
              </IconButton>
            </div>
          }
        >
          {alertInfo.message.replace("ERRO: ", "")}
        </Alert>
      </div>
    </Slide>
  );
}
