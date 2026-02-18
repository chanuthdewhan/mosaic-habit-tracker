import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

export const login = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  const userCard = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCard.user, {
    displayName: firstName,
    photoURL: "",
  });

  await setDoc(doc(db, "users", userCard.user.uid), {
    firstName,
    lastName,
    role: "",
    email,
    createdAt: new Date(),
  });

  return userCard.user;
};

export const logout = async () => {
  await signOut(auth);
  // await AsyncStorage.clear();

  // AsyncStorage.setItem("key", {})
  // AsyncStorage.getItem("key")
};
