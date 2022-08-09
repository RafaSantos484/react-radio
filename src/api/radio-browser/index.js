import { setAlertInfo } from "../../App";

export async function getSearchResult(radioName) {
  const init = {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    mode: "cors",
    cache: "default",
  };
  const response = await fetch(
    `https://de1.api.radio-browser.info/json/stations/byname/${radioName}`,
    init
  );

  return await response.json();
}

export function playAudio(audio, setIsAwatingAsyncEvent) {
  audio
    .play()
    .catch((err) => {
      if (
        err.message.startsWith(
          "The play() request was interrupted by a new load request."
        )
      )
        return;

      console.log(err);
      setAlertInfo({
        severity: "error",
        message: "Falha ao tocar rádio",
      });
    })
    .finally(() => setIsAwatingAsyncEvent(false));
}
