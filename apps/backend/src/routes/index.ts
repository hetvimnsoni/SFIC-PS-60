import { Router } from "express";
import healthRoutes from "./healthRoutes";
import authRoutes from "./authRoutes";
import studentRoutes from "./studentRoutes";
import assessmentRoutes from "./assessmentRoutes";
import learningGapRoutes from "./learningGapRoutes";
import remedialRoutes from "./remedialRoutes";
import worksheetRoutes from "./worksheetRoutes";
import aiRoutes from "./aiRoutes";
import reportRoutes from "./reportRoutes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/assessments", assessmentRoutes);
router.use("/learning-gaps", learningGapRoutes);
router.use("/remedial-plans", remedialRoutes);
router.use("/worksheets", worksheetRoutes);
router.use("/ai", aiRoutes);
router.use("/reports", reportRoutes);

export default router;
