import { Router } from "express";
import { getUsers, addUser } from "./user.controller.js";
import { upload } from "../../config/multer.js";

const router = Router();

router.get("/", getUsers);
router.post("/", upload.single("avatar"), addUser);
export default router;