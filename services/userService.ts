import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const getUserData = async (uid: string) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};
