import { Router } from "express";
import { authController } from "../controllers/authController";
import { validateLoginBody } from "../validators/requestValidators";

const router = Router();

router.post("/login", validateLoginBody, (req, res) => authController.login(req, res));
router.post("/logout", (req, res) => authController.logout(req, res));
router.get("/me", (req, res) => authController.getCurrentUser(req, res));

export default router;
