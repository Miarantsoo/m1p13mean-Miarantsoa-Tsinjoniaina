import { Router } from "express";
import {addShopRequest, getShopRequests} from "@/admin/shopRequest/shopRequest.controller.js";
import { upload } from "../../config/multer.js";

const router = Router();

router.get("/", getShopRequests);
router.post("/", upload.single("image"), addShopRequest);

export default router;