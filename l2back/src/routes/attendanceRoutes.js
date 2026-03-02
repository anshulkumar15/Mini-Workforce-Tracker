import express from "express";
import {
  markAttendance,
  getAttendance
} from "../controllers/attendanceController.js";
import { verifyToken } from "../Middleware/authMiddleware.js";
import { checkRole } from "../Middleware/roleMiddleware.js";



const router = express.Router();

// Employee marks attendance
router.post(
  "/attendance",
  verifyToken,
  checkRole(["Employee"]),
  markAttendance
);

// Manager/Admin view attendance
router.get(
  "/getattendance",
  verifyToken,
  checkRole(["Manager", "Admin"]),
  getAttendance
);

export default router;