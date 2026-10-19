import { Router } from "express";
import { studentController } from "../controllers/studentController";
import { learningGapController } from "../controllers/learningGapController";
import { remedialController } from "../controllers/remedialController";
import { validateStudentBody } from "../validators/requestValidators";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.get("/", (req, res) => studentController.getAll(req, res));
router.get("/:id", (req, res) => studentController.getById(req, res));
router.get("/:id/learning-gaps", (req, res) => learningGapController.getStudentGaps(req, res));
router.get("/:id/remedial-plans", (req, res) => remedialController.getStudentPlans(req, res));
router.post("/", requireAuth(["teacher", "admin"]), validateStudentBody, (req, res) => studentController.create(req, res));
router.put("/:id", requireAuth(["teacher", "admin"]), (req, res) => studentController.update(req, res));
router.delete("/:id", requireAuth(["admin"]), (req, res) => studentController.delete(req, res));

export default router;
