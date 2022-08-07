import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
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

export function getLoggedUser(callback) {
  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, callback);
}

export async function createUser(email, password, name) {
  try {
    const auth = getAuth(firebaseApp);

    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });

    try {
      return await sendEmailVerification(res.user);
    } catch (err) {
      throw new Error(
        "ERRO: Conta criada mas houve uma falha para enviar o email de verificação. Tente realizar login para tentar enviar o email novamente"
      );
    }
  } catch (err) {
    let message;

    if (err.code) {
      switch (err.code) {
        case "auth/email-already-in-use":
          message = "Email já cadastrado";
          break;
        default:
          message = "Falha ao criar usuário. Tente novamente mais tarde";
      }
    } else if (err.message.startsWith("ERRO: ")) {
      message = err.message.replace("ERRO: ", "");
    } else {
      message = "Falha ao criar usuário. Tente novamente mais tarde";
    }

    throw new Error(message);
  }
}
