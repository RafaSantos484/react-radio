import styles from "./historico.module.css";

import { setDoc } from "../../../api/firebase";
import { RadioCard } from "../../../components/radio-card";
import { playAudio } from "../../../api/radio-browser";
import { useState } from "react";

export function History(props) {
  const { user, setUser, selectedRadio, setSelectedRadio, audio } = props;

  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);

  return (
    <div className={styles.container}>
      {user.history
        .map((radio) => (
          <RadioCard
            key={radio.id}
            isAwatingAsyncEvent={isAwatingAsyncEvent}
            radio={radio}
            onClick={async () => {
              if (!selectedRadio || selectedRadio.id !== radio.id) {
                setSelectedRadio(radio);

                setIsAwatingAsyncEvent(true);

                let newHistory = user.history.filter((r) => r.id !== radio.id);
                newHistory.push(radio);
                user.isAnonymous
                  ? setUser({ ...user, history: newHistory })
                  : await setDoc(`users/${user.id}/history`, newHistory);

                //setAudioInfo({ ...audioInfo, shouldRefreshAudio: false });
                audio.load();
                audio.src = radio.url;
                playAudio(audio, setIsAwatingAsyncEvent);
              }
            }}
          />
        ))
        .reverse()}
    </div>
  );
}
