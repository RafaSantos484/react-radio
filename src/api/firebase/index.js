import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, set } from "firebase/database";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

export async function createUser(email, password, name) {
  try {
    const auth = getAuth(firebaseApp);

    const res = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await sendEmailVerification(res.user);
    } catch (err) {
      console.log(err.code);
      let errorMessage;

      switch (err.code) {
        default:
          errorMessage =
            "Conta criada mas houve uma falha para enviar o email de verificação. Tente realizar login para tentar enviar o email novamente";
      }

      throw new Error(errorMessage);
    }

    const dbRef = ref(getDatabase(firebaseApp), `users/${res.user.uid}`);
    return await set(dbRef, { email, name });
  } catch (err) {
    console.log(err);
    let errorMessage;

    switch (err.code) {
      case "auth/email-already-in-use":
        errorMessage = "Email já cadastrado";
        break;
      default:
        errorMessage = "Falha ao criar usuário. Tente novamente mais tarde";
    }

    throw new Error(errorMessage);
  }
}
