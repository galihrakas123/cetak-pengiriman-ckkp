const RolesGuard = (_props?: { role?: string | string[] }) => {
  // Selalu return true pada mode pengembangan lokal UI
  return true;
};

export default RolesGuard;
