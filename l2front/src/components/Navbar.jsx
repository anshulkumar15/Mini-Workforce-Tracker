import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <div style={styles.left}>
        <h3 style={{ margin: 0 }}>Mini Workforce Tracker</h3>
      </div>


      {user && (
        <div style={styles.right}>
      
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  navbar: {
    height: "60px",

    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 25px",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },
  center: {
    display: "flex",
    gap: "20px"
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  userInfo: {
    fontSize: "14px"
  },
  logoutBtn: {
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default Navbar;