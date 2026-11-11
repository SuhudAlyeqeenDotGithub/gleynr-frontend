import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase/client";
import { sessionManager } from "@/lib/auth/sessionManager";
const { createBackendSession, deleteBackendSession } = sessionManager;

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return createBackendSession(result.user);
};

export const signUpWithEmail = async (email: string, password: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return createBackendSession(result.user);
};

export const signInWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return createBackendSession(result.user);
};

export const signOutUser = async () => {
  await deleteBackendSession();
};
