import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  

  return (
    
    <div style={styles.container}>
 
      <div style={styles.card}>
               <Navbar></Navbar>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Dashboard</h2>
            <p style={styles.welcome}>Welcome, {user?.name} 👋</p>
            <span style={styles.roleBadge}>{user?.role}</span>
          </div>
       
        </div>

        <div style={styles.grid}>
    

          { user?.role === "Admin" ? (
            <Link to="/employees" style={styles.navCard}>
            👥 Employees
          </Link>
) : null}

          <Link to="/attendance" style={styles.navCard}>
            🗓 Attendance
          </Link>
    <Link to="/worklogs" style={styles.navCard}>
            📋 Work Logs
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    padding: "20px",
  },
  card: {
    background: "#fff",
    width: "100%",
    maxWidth: "900px",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    margin: 0,
    fontSize: "26px",
  },
  welcome: {
    margin: "5px 0",
    color: "#666",
  },
  roleBadge: {
    background: "#667eea",
    color: "#fff",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  logoutBtn: {
    background: "#ff4d4f",
    border: "none",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  navCard: {
    background: "#f5f7ff",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    textDecoration: "none",
    color: "#333",
    fontWeight: "600",
    fontSize: "16px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    transition: "0.3s",
  },
};

export default Dashboard;