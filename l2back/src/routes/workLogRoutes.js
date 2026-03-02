import express from "express";
import {
  addWorkLog,
  getWorkLogs
} from "../controllers/workLogController.js";
import { verifyToken } from "../Middleware/authMiddleware.js";
import { checkRole } from "../Middleware/roleMiddleware.js";


const router = express.Router();

// Employee adds work log
router.post(
  "/addworklogs",
  verifyToken,
  checkRole(["Employee"]),
  addWorkLog
);

// Manager/Admin view logs
router.get(
  "/worklogs",
  verifyToken,
  checkRole(["Manager", "Admin"]),
  getWorkLogs
);

export default router;