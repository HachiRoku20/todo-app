// hooks/useInitializeAuth.ts
"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@store/authStore";

export const useInitializeAuth = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const cookieToken = Cookies.get("token");
    const cookieUser = Cookies.get("user");

    if (!token && cookieToken) {
      setToken(cookieToken);
    }

    if (cookieUser) {
      setUser(cookieUser);
    }

    if (!token && !cookieToken) {
      router.push("/login");
    }
  }, [token, setToken, setUser, router]);
};
