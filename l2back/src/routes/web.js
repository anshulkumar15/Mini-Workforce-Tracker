import express from "express";
import { login } from "../controllers/authController.js";
import { addEmployee, uploadEmployeesCSV } from "../controllers/employeeController.js";
import { verifyToken } from "../Middleware/authMiddleware.js";
import multer from "multer";
import { checkRole } from "../Middleware/roleMiddleware.js";
const router=express.Router();
const upload = multer({ dest: "uploads/" });


router.post("/addEmployee", verifyToken, checkRole(["Admin"]), addEmployee);
router.post(
  "/upload",
  verifyToken,
  checkRole(["Admin"]),
  upload.single("file"),
  uploadEmployeesCSV
);


export default router;