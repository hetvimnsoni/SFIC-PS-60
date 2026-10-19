import { Router } from "express";
import { assessmentController } from "../controllers/assessmentController";
import { validateAssessmentBody } from "../validators/requestValidators";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.get("/", (req, res) => assessmentController.getAll(req, res));
router.get("/results", (req, res) => assessmentController.getResults(req, res));
router.get("/:id", (req, res) => assessmentController.getById(req, res));
router.post("/", requireAuth(["teacher", "admin"]), validateAssessmentBody, (req, res) => assessmentController.create(req, res));
router.post("/results", requireAuth(["teacher", "admin"]), (req, res) => assessmentController.recordResults(req, res));

export default router;
