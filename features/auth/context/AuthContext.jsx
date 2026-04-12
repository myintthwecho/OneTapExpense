import { auth, firebaseInitError } from "@/services/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [configError] = useState(firebaseInitError);

  useEffect(() => {
    if (configError || !auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => {
    if (!auth) {
      throw new Error(configError || "Firebase Auth is not configured.");
    }
    return signInWithEmailAndPassword(auth, email.trim(), password);
  };

  const register = async ({ email, password, name }) => {
    if (!auth) {
      throw new Error(configError || "Firebase Auth is not configured.");
    }

    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password,
    );

    if (name?.trim()) {
      await updateProfile(credential.user, {
        displayName: name.trim(),
      });
    }

    return credential;
  };

  const logout = () => {
    if (!auth) {
      throw new Error(configError || "Firebase Auth is not configured.");
    }
    return signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      configError,
      login,
      register,
      logout,
    }),
    [user, isLoading, configError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
