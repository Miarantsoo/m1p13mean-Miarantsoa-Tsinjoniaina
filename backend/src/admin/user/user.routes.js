import { Router } from "express";
import { getUsers, addUser } from "./user.controller.js";
import { upload } from "../../config/multer.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticate, authorize('admin'), getUsers);
router.post("/", authenticate, authorize('admin'), upload.single("avatar"), addUser);

export default router;