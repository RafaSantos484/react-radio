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

export async function playAudio(audio, radio, setIsAwatingAsyncEvent = null) {
  let attempts = 1;
  try {
    await audio.play();
    navigator.mediaSession.metadata = new MediaMetadata({
      title: radio.name,
      artwork: [{ src: radio.favicon }],
    });
  } catch (err) {
    if (
      err.message.startsWith(
        "The play() request was interrupted by a new load request."
      )
    )
      return;

    console.log(err);
    for (; attempts <= 10; attempts++) {
      try {
        await audio.play();
        navigator.mediaSession.metadata = new MediaMetadata({
          title: radio.name,
          artwork: [{ src: radio.favicon }],
        });
        break;
      } catch (err) {
        console.log(err);
      }
    }

    if (attempts > 5) {
      setAlertInfo({
        severity: "error",
        message: "Falha ao tocar rádio",
      });
    }
  } finally {
    setIsAwatingAsyncEvent(false);
  }
  /*audio
    .play()
    .then(
      () =>
        (navigator.mediaSession.metadata = new MediaMetadata({
          title: radio.name,
          artwork: [{ src: radio.favicon }],
        }))
    )
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
    .finally(() => {
      if (setIsAwatingAsyncEvent) setIsAwatingAsyncEvent(false);
    });*/
}
