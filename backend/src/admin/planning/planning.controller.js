import { getAllPlannings, addPlanning } from "./planning.service.js";
import Planning from "./planning.model.js";
import ShopRequest from "../shopRequest/shopRequest.model.js";
import {sendPlanningEmail} from "@/utils/mail.service.js";

export const getPlannings = async (req, res) => {
    try {
        const plannings = await getAllPlannings();
        res.json(plannings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPlanning = async (req, res) => {
    try {
        const shopRequest = await ShopRequest.findById(req.body.shop_request);

        const data = {
            ...req.body,
            shop_request: shopRequest
        }
        const planning = await addPlanning(data);
        const populatedPlanning = await Planning.findById(planning._id);
        shopRequest.status = "pending";
        await shopRequest.save();

        await sendPlanningEmail({
            recipient: shopRequest.email,
            date: populatedPlanning.date,
            duration: populatedPlanning.duration
        });

        res.status(201).json(planning);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
