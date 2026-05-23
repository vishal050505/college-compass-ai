import { Router } from "express";
import {
  getAllColleges,
  getCollegeById,
  getCollegeFilters,
} from "../controllers/collegeController";

const router = Router();

router.get("/", getAllColleges);
router.get("/filters", getCollegeFilters);
router.get("/:id", getCollegeById);

export default router;