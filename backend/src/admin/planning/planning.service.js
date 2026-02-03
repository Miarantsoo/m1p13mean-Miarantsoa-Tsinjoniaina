import Planning from "./planning.model.js";

export const getAllPlannings = async () => {
    return await Planning.find()
        .populate("shop_request")
        .sort({ date: 1 });
};
export const addPlanning = async (planningData) => {
    const planning = new Planning(planningData);
    return await planning.save();
};
