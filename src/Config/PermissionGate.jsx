import { useContext } from "react";
import AuthContext from "../auth/AuthContext";

const PermissionGate = ({ permission, children, fallback = null }) => {
  const { can, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!permission) return children;

  return can(permission) ? children : fallback;
};

export default PermissionGate;
