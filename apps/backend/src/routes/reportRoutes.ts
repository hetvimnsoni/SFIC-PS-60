import { Router } from "express";
import { reportController } from "../controllers/reportController";

const router = Router();

router.get("/overview", (req, res) => reportController.getOverview(req, res));

export default router;
