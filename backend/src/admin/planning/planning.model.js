import mongoose from "mongoose";

const planningSchema = new mongoose.Schema(
    {
        shop_request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShopRequest",
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        duration: {
            type: Number, // durée en minutes
            required: true,
            min: 1
        }
    },
    {
        timestamps: true,
        collection: "planning"
    }
);

export default mongoose.model("Planning", planningSchema);
