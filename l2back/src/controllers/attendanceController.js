import pool from "../config/db.js";

export const markAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const [emp] = await pool.query(
      "SELECT id FROM employees WHERE user_id = ?",
      [userId]
    );

    if (emp.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeId = emp[0].id;

    const today = new Date().toISOString().split("T")[0];

    await pool.query(
      "INSERT INTO attendance (employee_id, date) VALUES (?, ?)",
      [employeeId, today]
    );

    res.status(201).json({ message: "Attendance marked successfully" });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "Attendance already marked today" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const getAttendance = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;

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
      FROM attendance a
      JOIN employees e ON e.id = a.employee_id
      JOIN users u ON u.id = e.user_id
      ${whereClause}
      `,
      values
    );

    const total = countResult[0].total;

    const [rows] = await pool.query(
      `
      SELECT u.name, u.email, a.date
      FROM attendance a
      JOIN employees e ON e.id = a.employee_id
      JOIN users u ON u.id = e.user_id
      ${whereClause}
      ORDER BY a.date DESC
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