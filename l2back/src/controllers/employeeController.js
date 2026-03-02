import pool from "../config/db.js";
import fs from "fs";
import csv from "csv-parser";
import bcrypt from "bcryptjs";



export const addEmployee = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { name, email, department } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({ message: "All fields required" });
    }

    await connection.beginTransaction();

    const hashedPassword = await bcrypt.hash("123456", 10);

    const [userResult] = await connection.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "Employee"]
    );

    const userId = userResult.insertId;

    await connection.query(
      "INSERT INTO employees (user_id, department, created_by) VALUES (?, ?, ?)",
      [userId, department, req.user.id]
    );

    await connection.commit();

    res.json({ message: "Employee added successfully" });

  } catch (error) {
    await connection.rollback();

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Server error" });
  } finally {
    connection.release();
  }
};

export const getEmployees = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", department = "" } = req.query;

    page = Number(page);
    limit = Number(limit);
    const offset = (page - 1) * limit;

    let whereClause = "WHERE u.role = 'Employee'";
    const values = [];

    if (search) {
      whereClause += " AND u.name LIKE ?";
      values.push(`%${search}%`);
    }

    if (department) {
      whereClause += " AND e.department = ?";
      values.push(department);
    }

    // Total count
    const [totalResult] = await pool.query(
      `SELECT COUNT(*) as total
       FROM employees e
       JOIN users u ON e.user_id = u.id
       ${whereClause}`,
      values
    );

    const total = totalResult[0].total;

    // Get data with JOIN
    const [employees] = await pool.query(
      `SELECT 
          e.id,
          u.name,
          u.email,
          e.department,
          e.created_by
       FROM employees e
       JOIN users u ON e.user_id = u.id
       ${whereClause}
       ORDER BY e.id DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: employees
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadEmployeesCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const results = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", async () => {
        try {
          if (results.length === 0) {
            fs.unlinkSync(req.file.path);
            return res.json({
              totalRows: 0,
              success: 0,
              failed: 0,
              errors: []
            });
          }

          const allowedDepartments = ["IT", "HR", "Finance"];

          let success = 0;

          for (let i = 0; i < results.length; i++) {
            const row = results[i];
            const rowNumber = i + 2; // +2 because header is row 1

            const { name, email, department } = row;

            // 🔹 Required fields check
            if (!name || !email || !department) {
              errors.push({
                row: rowNumber,
                message: "Missing required fields"
              });
              continue;
            }

            // 🔹 Email format check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              errors.push({
                row: rowNumber,
                message: "Invalid email format"
              });
              continue;
            }

            // 🔹 Department validation
            if (!allowedDepartments.includes(department)) {
              errors.push({
                row: rowNumber,
                message: "Invalid department"
              });
              continue;
            }

            // 🔹 Check duplicate email in DB
            const [existing] = await pool.query(
              "SELECT id FROM users WHERE email = ?",
              [email]
            );

            if (existing.length > 0) {
              errors.push({
                row: rowNumber,
                message: "Email already exists"
              });
              continue;
            }

            // 🔹 Insert user + employee
            const hashedPassword = await bcrypt.hash("123456", 10);

            const [userResult] = await pool.query(
              "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
              [name, email, hashedPassword, "Employee"]
            );

            await pool.query(
              "INSERT INTO employees (user_id, department, created_by) VALUES (?, ?, ?)",
              [userResult.insertId, department, req.user.id]
            );

            success++;
          }

          fs.unlinkSync(req.file.path);

          res.json({
            totalRows: results.length,
            success,
            failed: errors.length,
            errors
          });

        } catch (err) {
          fs.unlinkSync(req.file.path);
          console.error(err);
          res.status(500).json({ message: "CSV processing failed" });
        }
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "CSV Upload Failed" });
  }
};