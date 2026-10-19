import { Router } from "express";
import { learningGapController } from "../controllers/learningGapController";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.get("/", (req, res) => learningGapController.getAll(req, res));
router.post("/analyze", rateLimiter(20, 60), (req, res) => learningGapController.analyze(req, res));

export default router;
