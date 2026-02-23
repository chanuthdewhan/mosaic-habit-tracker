import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import { deleteObject, getStorage, ref } from "firebase/storage";

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

/**
 * Permanently deletes a user's account, including their Firestore document,
 * profile photo in Storage, and Firebase Authentication record.
 * Requires the user's password to re-authenticate prior to deletion.
 */
export const deleteAccount = async (password: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error("Not authenticated");

  // Re-authenticate first (required by Firebase before sensitive operations)
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);

  // Delete profile photo from Storage if exists
  if (user.photoURL) {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `avatars/${user.uid}.jpg`);
      await deleteObject(storageRef);
    } catch {
      // Ignore if already deleted
    }
  }

  // Delete Firestore user document
  await deleteDoc(doc(db, "users", user.uid));

  // Finallly Delete Firebase Auth account
  await deleteUser(user);
};
