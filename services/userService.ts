import { updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { auth, db } from "./firebaseConfig";

export const getUserData = async (uid: string) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export const updateUserData = async (
  uid: string,
  updates: Record<string, any>,
) => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, updates);
};

export const uploadProfilePhoto = async (
  uid: string,
  uri: string,
): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storage = getStorage();
  const storageRef = ref(storage, `avatars/${uid}.jpg`);
  await uploadBytes(storageRef, blob);

  const downloadURL = await getDownloadURL(storageRef);
  // Add timestamp to bust cache on subsequent uploads
  const cacheBustedURL = `${downloadURL}&t=${Date.now()}`;
  await updateProfile(auth.currentUser!, { photoURL: cacheBustedURL });
  await auth.currentUser?.reload();

  return cacheBustedURL;
};

export const removeProfilePhoto = async (uid: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, `avatars/${uid}.jpg`);
  try {
    await deleteObject(storageRef);
  } catch (err: any) {
    if (err.code !== "storage/object-not-found") throw err;
  }

  await updateProfile(auth.currentUser!, { photoURL: "" });
  await auth.currentUser?.reload();
};
