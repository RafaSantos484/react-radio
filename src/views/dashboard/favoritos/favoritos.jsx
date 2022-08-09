import styles from "./favoritos.module.css";

import { setDoc } from "../../../api/firebase";
import { RadioCard } from "../../../components/radio-card";
import { playAudio } from "../../../api/radio-browser";
import { useState } from "react";

export function Favorites(props) {
  const { user, setUser, setSelectedRadio, audio } = props;

  const [isAwatingAsyncEvent, setIsAwatingAsyncEvent] = useState(false);

  return (
    <div className={styles.container}>
      {user.favorites
        .map((radio) => (
          <RadioCard
            key={radio.id}
            isAwatingAsyncEvent={isAwatingAsyncEvent}
            setIsAwatingAsyncEvent={setIsAwatingAsyncEvent}
            radio={radio}
            user={user}
            setUser={setUser}
            page="favoritos"
            onClick={async () => {
              setSelectedRadio(radio);

              setIsAwatingAsyncEvent(true);

              let newHistory = user.history.filter((r) => r.id !== radio.id);
              newHistory.push(radio);
              user.isAnonymous
                ? setUser({ ...user, history: newHistory })
                : await setDoc(`users/${user.id}/history`, newHistory);

              setIsAwatingAsyncEvent(false);

              //setAudioInfo({ ...audioInfo, shouldRefreshAudio: false });
              audio.load();
              audio.src = radio.url;
              playAudio(audio);
            }}
          />
        ))
        .reverse()}
    </div>
  );
}
