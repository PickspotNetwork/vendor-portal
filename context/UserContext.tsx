"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  vendorId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  iat: number;
  exp: number;
}

interface User {
  vendorId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      console.warn("No access token found. Redirecting to login.");
      router.push("/login");
      return;
    }

    if (accessToken) {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(accessToken);

        const userData = {
          vendorId: decodedToken.vendorId,
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          phoneNumber: decodedToken.phoneNumber,
          role: decodedToken.role,
        };

        setUser(userData);
      } catch (error) {
        console.log("Error decoding token:", error);
        Cookies.remove("accessToken");
        router.push("/login");
        setUser(null);
      }
    }
  }, [router]);

  const logout = () => {
    Cookies.remove("accessToken");
    setUser(null);
    router.push("/login");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
