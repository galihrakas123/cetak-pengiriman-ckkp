import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const AuthGuard = ({
  children,
}: {
  children: React.ReactNode;
  role?: string | string[];
}) => {
  const { isLoggedIn, isInitialised } = useAuth();
  const location = useLocation();

  if (!isInitialised) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthGuard;
