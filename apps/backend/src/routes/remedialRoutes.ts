import { Router } from "express";
import { remedialController } from "../controllers/remedialController";
import { rateLimiter } from "../middleware/rateLimiter";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.get("/", (req, res) => remedialController.getAll(req, res));
router.get("/:id", (req, res) => remedialController.getById(req, res));
router.post("/generate", rateLimiter(20, 60), (req, res) => remedialController.generate(req, res));
router.put("/:id", requireAuth(["teacher", "admin"]), (req, res) => remedialController.update(req, res));

export default router;
