import { getAllPlannings, addPlanning } from "./planning.service.js";
import Planning from "./planning.model.js";
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
        const planning = await addPlanning(req.body);

        const populatedPlanning = await Planning.findById(planning._id)
            .populate("shop_request");

        await sendPlanningEmail({
            to: populatedPlanning.shop_request.email,
            date: populatedPlanning.date,
            duration: populatedPlanning.duration
        });

        res.status(201).json(planning);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
