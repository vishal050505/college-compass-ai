import { Router } from "express";
import { predictColleges } from "../controllers/predictorController";

const router = Router();
router.post("/", predictColleges);

export default router;