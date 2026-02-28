import { Router } from "express";
import {addShopRequest, getShopRequests, rejectDemand} from "@/admin/shopRequest/shopRequest.controller.js";
import { upload } from "../../config/multer.js";
import {authenticate, authorize} from "@/middleware/auth.middleware.js";

const router = Router();

router.get("/", getShopRequests);
router.post("/", upload.single("image"), addShopRequest);
router.post("/reject", authenticate, authorize('admin'), rejectDemand);

export default router;