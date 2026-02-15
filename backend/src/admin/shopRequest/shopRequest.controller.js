import {createShopRequest, getAllShopRequests} from "@/admin/shopRequest/shopRequest.service.js";
import {uploadToImgBB} from "@/utils/imgbb.js";

export const getShopRequests = async (req, res) => {
    try {
        const status = req.query.status;
        const shopRequests = await getAllShopRequests(status);
        res.json(shopRequests);
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