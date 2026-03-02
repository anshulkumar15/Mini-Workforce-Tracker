import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
  import Navbar from "../components/Navbar";

const Employees = () => {
  const { user } = useContext(AuthContext);
      const Base_url = import.meta.env.VITE_API_URL;

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");

  const limit = 5;

  const fetchEmployees = async () => {
    const res = await axios.get(`${Base_url}/api/employees`, {
      params: { page, limit, search, department },
      headers: { Authorization: `Bearer ${user.token}` }
    });

    setEmployees(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, search, department]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    await axios.post(
      `${Base_url}/api/addEmployee`,
      { name, email, department: dept },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    setName("");
    setEmail("");
    setDept("");
    fetchEmployees();
  };

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      `${Base_url}/api/employees/upload`,
      formData,
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    alert(
      `Total: ${res.data.totalRows}\nSuccess: ${res.data.success}\nFailed: ${res.data.failed}`
    );

    fetchEmployees();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <  Navbar></Navbar>
        <h2 style={styles.title}>👥 Employee Management</h2>

        {/* Add Employee */}
        {user.role === "Admin" && (
          <form onSubmit={handleAddEmployee} style={styles.form}>
            <h3>Add Employee</h3>

            <div style={styles.formRow}>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />

              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                style={styles.input}
                required
              >
                <option value="">Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>

              <button style={styles.primaryBtn}>Add</button>
            </div>
          </form>
        )}

        {/* CSV Upload */}
        {user.role === "Admin" && (
          <div style={{ marginBottom: "20px" }}>
            <h3>Bulk Upload CSV</h3>
            <input type="file" accept=".csv" onChange={handleCSVUpload} />
          </div>
        )}

        {/* Search + Filter */}
        <div style={styles.filterRow}>
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            style={styles.input}
          />

          <select
            value={department}
            onChange={(e) => {
              setPage(1);
              setDepartment(e.target.value);
            }}
            style={styles.input}
          >
            <option value="">All Departments</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
      <table style={styles.table}>
  <thead>
    <tr>
      <th style={styles.th}>Name</th>
      <th style={styles.th}>Email</th>
      <th style={styles.th}>Department</th>
    </tr>
  </thead>
  <tbody>
    {employees.length > 0 ? (
      employees.map((emp) => (
        <tr key={emp.id}>
          <td style={styles.td}>{emp.name}</td>
          <td style={styles.td}>{emp.email}</td>
          <td style={styles.td}>{emp.department}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="3" style={styles.td}>
          No employees found
        </td>
      </tr>
    )}
  </tbody>
</table>
        </div>

        {/* Pagination */}
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
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f6fb",

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
    marginBottom: "25px"
  },
  formRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  filterRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minWidth: "100px"
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
  borderCollapse: "collapse",
},

th: {
  borderBottom: "2px solid #e5e7eb",
  padding: "12px",
  textAlign: "left",
  background: "#f9fafb",
},

td: {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px",
},
  pagination: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }
};

export default Employees;