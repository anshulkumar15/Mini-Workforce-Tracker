import pool from "../config/db.js";

export const addWorkLog = async (req, res) => {
  try {
    const { title, description, hours } = req.body;

    if (!title || !hours) {
      return res.status(400).json({ message: "Title and hours required" });
    }

    const userId = req.user.id;

    const [emp] = await pool.query(
      "SELECT id FROM employees WHERE user_id = ?",
      [userId]
    );

    if (emp.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeId = emp[0].id;

    await pool.query(
      "INSERT INTO work_logs (employee_id, title, description, hours) VALUES (?, ?, ?, ?)",
      [employeeId, title, description, hours]
    );

    res.status(201).json({ message: "Work log added successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getWorkLogs = async (req, res) => {
  try {
    let { page = 1, limit = 5, search = "" } = req.query;

    page = Number(page);
    limit = Number(limit);
    const offset = (page - 1) * limit;

    let whereClause = "WHERE u.role = 'Employee'";
    let values = [];

    if (search) {
      whereClause += " AND u.name LIKE ?";
      values.push(`%${search}%`);
    }

    const [countResult] = await pool.query(
      `
      SELECT COUNT(*) as total
      FROM work_logs w
      JOIN employees e ON e.id = w.employee_id
      JOIN users u ON u.id = e.user_id
      ${whereClause}
      `,
      values
    );

    const total = countResult[0].total;

    const [rows] = await pool.query(
      `
      SELECT u.name, u.email, w.title, w.description, w.hours, w.created_at
      FROM work_logs w
      JOIN employees e ON e.id = w.employee_id
      JOIN users u ON u.id = e.user_id
      ${whereClause}
      ORDER BY w.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...values, limit, offset]
    );

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: rows
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};