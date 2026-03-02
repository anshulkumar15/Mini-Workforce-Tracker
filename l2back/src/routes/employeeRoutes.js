import express from "express";
import {
  addEmployee,
  getEmployees,
  uploadEmployeesCSV
} from "../controllers/employeeController.js";


import multer from "multer";
import { verifyToken } from "../Middleware/authMiddleware.js";
import { checkRole } from "../Middleware/roleMiddleware.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/addEmployee", verifyToken, checkRole(["Admin"]), addEmployee);
router.get("/employees", verifyToken, getEmployees);
router.post(
  "/employees/upload",
  verifyToken,
  checkRole(["Admin"]),
  upload.single("file"),
  uploadEmployeesCSV
);


export default router;