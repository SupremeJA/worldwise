import { useNavigate } from "react-router-dom";
import Map from "../component/Map";
import Sidebar from "../component/Sidebar";
import User from "../component/User";
import { useAuth } from "../context/FakeAuthContext";
import styles from "./AppLayout.module.css";
import { useEffect } from "react";
import Spinner from "../component/Spinner";

const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) {
        navigate("/");
      }
    },
    [isAuthenticated]
  );

  if (!isAuthenticated) {
    return <Spinner />;
  }

  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
};

export default AppLayout;
