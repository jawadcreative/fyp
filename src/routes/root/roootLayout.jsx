import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import { useEffect } from "react";

const RootLayout = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <Navbar />
      <Outlet />
    </main>
  );
};

export default RootLayout;