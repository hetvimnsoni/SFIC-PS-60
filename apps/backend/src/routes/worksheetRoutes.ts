import { Router } from "express";
import { worksheetController } from "../controllers/worksheetController";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/generate", rateLimiter(15, 60), (req, res) => worksheetController.generate(req, res));

export default router;
