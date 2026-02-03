import mongoose from "mongoose";

const shopRequestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        image_link: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        covering_letter: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        collection: "shop_request"
    }
);

export default mongoose.model("ShopRequest", shopRequestSchema);