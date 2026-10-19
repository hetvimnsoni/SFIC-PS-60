import { Router } from "express";
import { aiController } from "../controllers/aiController";
import { rateLimiter } from "../middleware/rateLimiter";
import { validateAiTutorBody } from "../validators/requestValidators";

const router = Router();

router.post("/tutor", rateLimiter(25, 60), validateAiTutorBody, (req, res) => aiController.tutor(req, res));
router.post("/chat", rateLimiter(25, 60), (req, res) => aiController.chat(req, res));

export default router;
