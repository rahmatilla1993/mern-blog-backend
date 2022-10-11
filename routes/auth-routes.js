import { Router } from "express";
import { registerValidation, loginValidation } from "../validators/auth.js";
import { checkAuth, handleValidationErrors } from "../utils/index.js";
import { authController } from "../controllers/index.js";

const router = new Router();

router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  authController.login
);

router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  authController.register
);

router.get("/me", checkAuth, authController.getMe);

export default router;
