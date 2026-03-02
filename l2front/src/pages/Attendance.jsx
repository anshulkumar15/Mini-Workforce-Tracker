import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
  import Navbar from "../components/Navbar";
const Attendance = () => {
  const { user } = useContext(AuthContext);
    const Base_url = import.meta.env.VITE_API_URL;
  
  


  const [attendance, setAttendance] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");


  const limit = 5;

  // 🔹 Fetch attendance (Manager/Admin)
  const fetchAttendance = async () => {
    try {
      const res = await axios.get(
        `${Base_url}/api/getattendance`,
        {
          params: { page, limit, search },
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      setAttendance(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Mark attendance (Employee)
  const handleMarkAttendance = async () => {
    try {
      const res = await axios.post(
        `${Base_url}/api/attendance`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  useEffect(() => {
    if (user.role === "Manager" || user.role === "Admin") {
      fetchAttendance();
    }
  }, [page, search]);

return (
  <div style={styles.container}>

    <div style={styles.card}>
               <Navbar></Navbar>
      <h2 style={styles.title}>📅 Attendance Management</h2>

      {/* 👤 Employee View */}
      {user.role === "Employee" && (
        <div style={styles.employeeBox}>
          <button style={styles.primaryBtn} onClick={handleMarkAttendance}>
            Mark Today's Attendance
          </button>
        </div>
      )}

      {/* 👨‍💼 Manager/Admin View */}
      {(user.role === "Manager" || user.role === "Admin") && (
        <>
          {/* 🔎 Search */}
          <div style={styles.filterRow}>
            <input
              type="text"
              placeholder="Search by employee name"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              style={styles.input}
            />
          </div>

          {/* 📋 Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length > 0 ? (
                  attendance.map((item, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{item.name}</td>
                      <td style={styles.td}>{item.email}</td>
                      <td style={styles.td}>{item.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={styles.td}>
                      No attendance records
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 📄 Pagination */}
          <div style={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              style={styles.secondaryBtn}
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              style={styles.secondaryBtn}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f6fb",
    padding: "30px"
  },
  card: {
    background: "#fff",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },
  title: {
    marginBottom: "25px"
  },
  employeeBox: {
    marginBottom: "25px"
  },
  filterRow: {
    marginBottom: "20px"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minWidth: "250px"
  },
  primaryBtn: {
    background: "#667eea",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  secondaryBtn: {
    background: "#eee",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  th: {
    borderBottom: "2px solid #e5e7eb",
    padding: "12px",
    textAlign: "left",
    background: "#f9fafb"
  },
  td: {
    borderBottom: "1px solid #e5e7eb",
    padding: "12px"
  },
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
};
export default Attendance;