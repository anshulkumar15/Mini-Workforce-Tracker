import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const WorkLogs = () => {
  const { user } = useContext(AuthContext);

  const [logs, setLogs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const limit = 5;

  const fetchLogs = async () => {
    const res = await axios.get(
      "http://localhost:3000/api/worklogs",
      {
        params: { page, limit, search },
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    setLogs(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  const handleAddLog = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:3000/api/addworklogs",
      { title, description, hours },
      {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    setTitle("");
    setDescription("");
    setHours("");
    alert("Work log added");
  };

  useEffect(() => {
    if (user.role === "Manager" || user.role === "Admin") {
      fetchLogs();
    }
  }, [page, search]);

return (
  <div style={styles.container}>
    <div style={styles.card}>
        <Navbar></Navbar>
      <h2 style={styles.title}>📋 Work Logs</h2>

      {/* 👤 Employee View */}
      {user.role === "Employee" && (
        <form onSubmit={handleAddLog} style={styles.form}>
          <div style={styles.formRow}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
              required
            />

            <input
              type="number"
              placeholder="Hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={styles.textarea}
          />

          <button type="submit" style={styles.primaryBtn}>
            Add Work Log
          </button>
        </form>
      )}

      {/* 👨‍💼 Manager/Admin View */}
      {(user.role === "Manager" || user.role === "Admin") && (
        <>
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

          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Title</th>
               <th style={styles.th}>Description</th>
                  <th style={styles.th}>Hours</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{log.name}</td>
                      <td style={styles.td}>{log.email}</td>
                      <td style={styles.td}>{log.title}</td>
                            <td style={styles.td}>{log.description}</td>
                      <td style={styles.td}>{log.hours}</td>
                      <td style={styles.td}>
                        {new Date(log.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={styles.td}>
                      No logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
  form: {
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  formRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  filterRow: {
    marginBottom: "20px"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minWidth: "200px"
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    resize: "vertical"
  },
  primaryBtn: {
    background: "#667eea",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    width: "180px"
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
export default WorkLogs;