import { auth } from "@/services/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

/**
 * Global authentication provider.
 * Listens to Firebase Auth state changes and provides the current user
 * object and loading state to the rest of the application.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    await auth.currentUser?.reload();

    if (auth.currentUser) {
      // Firebase User properties like photoURL and displayName are getters on the prototype.
      // We must explicitly extract them here because the spread operator alone
      // will not copy them over, causing React to miss the state update.
      setUser({
        ...auth.currentUser,
        photoURL: auth.currentUser.photoURL,
        displayName: auth.currentUser.displayName,
      } as User);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
