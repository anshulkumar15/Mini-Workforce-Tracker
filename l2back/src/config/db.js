import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "l2db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("Database pool connected");

export default pool;