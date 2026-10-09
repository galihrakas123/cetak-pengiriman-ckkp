import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const GuestGuard = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, isInitialised } = useAuth();

  if (!isInitialised) {
    return null;
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default GuestGuard;
