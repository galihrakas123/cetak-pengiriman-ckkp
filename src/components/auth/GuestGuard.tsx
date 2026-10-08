import React, { ReactNode } from "react";
import PropTypes from "prop-types";

const GuestGuard = ({ children }: { children: ReactNode }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

export default GuestGuard;

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired,
};
