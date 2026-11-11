import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";

import { auth } from "@/lib/firebase/client";
const createBackendSession = async (user: User) => {
  const idToken = await user.getIdToken();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ idToken }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create backend session");
  }

  const session = await response.json();

  await signOut(auth);

  return session;
};

const deleteBackendSession = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/session`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete backend session");
  }

  await signOut(auth);
};

export const sessionManager = {
  createBackendSession,
  deleteBackendSession,
};
