import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      logout();

      // <Redirect to="/auth/login"/>;
      navigate("/login");
      window.location.reload(); // do hard reload
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null;
};

export default Logout;
