import React from "react";
import PropTypes from "prop-types";

/**
 * AuthGuard (Mode Lokal / UI Dev)
 * Bypass pengecekan autentikasi agar UI bisa dikembangkan secara lokal tanpa backend login.
 */
const AuthGuard = ({
  children,
}: {
  children: React.ReactNode;
  role?: string | string[];
}) => {
  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthGuard;

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};
