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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const access_token = Cookies.get("access_token");

    if (access_token) {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(access_token);

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
        Cookies.remove("access_token");
        setUser(null);
      }
    }
  }, [router]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
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
