import { Router } from "express";
import {
  createEntry,
  getEntries,
  deleteEntry,
} from "../controllers/entryController";
import { authenticate } from "../middleware/auth";
import { validateEntry } from "../middleware/validateEntry";

const router = Router();

// All entry routes require authentication
router.use(authenticate);

router.post("/", validateEntry, createEntry);
router.get("/", getEntries);
// router.get("/:id", getEntry);
// router.put("/:id", validateEntry, updateEntry);
router.delete("/:id", deleteEntry);

export default router;
