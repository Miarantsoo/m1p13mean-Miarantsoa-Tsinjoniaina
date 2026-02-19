import {createShopRequest, getAllShopRequests, rejectShopRequest} from "@/admin/shopRequest/shopRequest.service.js";
import {uploadToImgBB} from "@/utils/imgbb.js";
import {sendShopRequestEmail} from "@/utils/mail.service.js";

export const getShopRequests = async (req, res) => {
    try {
        const status = req.query.status;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await getAllShopRequests(status, page, limit);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const addShopRequest = async (req, res) => {
    try {

        const file = req.file;
        let fileUrl = "https://i.ibb.co/BVp2cd60/default-image.png";
        if(file){
            const imagePath = file.path;
            fileUrl = await uploadToImgBB(imagePath);
        }

        req.body.image_link = fileUrl;

        const savedShopRequest = await createShopRequest(req.body);

        res.status(201).json({
            message: "Shop request created successfully",
            data: savedShopRequest
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating shop request",
            error: error.message
        });
    }
}

export const rejectDemand = async (req, res) => {
    try {
        await rejectShopRequest(req.body.id, req.body.reason);
        res.status(200).json({
            message: "Shop request rejected successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error rejecting shop request",
            error: error.message
        });
    }
}