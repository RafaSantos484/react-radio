import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
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

export async function sendVerificationEmail(user) {
  try {
    return await sendEmailVerification(user);
  } catch (err) {
    console.log(err.code);
    let message;

    if (err.code) {
      switch (err.code) {
        case "auth/too-many-requests":
          message =
            "ERRO: Muitas requisições feitas. Aguarde um instante e tente novamente";
          break;
        default:
          message = "ERRO: Falha ao enviar Email de verificação";
      }
    } else {
      message = "ERRO: Falha ao realizar login. Tente novamente mais tarde";
    }

    throw new Error(message);
  }
}

export async function createUser(email, password, name) {
  try {
    const auth = getAuth(firebaseApp);

    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName: name });
    return await sendVerificationEmail(res.user);
  } catch (err) {
    console.log(err.code);
    let message;

    if (err.code) {
      switch (err.code) {
        case "auth/too-many-requests":
          message =
            "ERRO: Muitas requisições feitas. Aguarde um instante e tente novamente";
          break;
        case "auth/invalid-email":
          message = "ERRO: Email inválido";
          break;
        case "auth/email-already-in-use":
          message = "ERRO: Email já cadastrado";
          break;
        default:
          message = "ERRO: Falha ao criar usuário. Tente novamente mais tarde";
      }
    } else if (err.message.startsWith("ERRO: ")) {
      message = err.message;
    } else {
      message = "ERRO: Falha ao criar usuário. Tente novamente mais tarde";
    }

    throw new Error(message);
  }
}

export async function login(email, password) {
  try {
    const auth = getAuth(firebaseApp);

    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err.code);

    let message;
    if (err.code) {
      switch (err.code) {
        case "auth/too-many-requests":
          message =
            "ERRO: Muitas requisições feitas. Aguarde um instante e tente novamente";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          message = "ERRO: Usuário não encontrado";
          break;
        default:
          message = "ERRO: Falha ao realizar login. Tente novamente mais tarde";
      }
    } else {
      message = "ERRO: Falha ao realizar login. Tente novamente mais tarde";
    }

    throw new Error(message);
  }
}
