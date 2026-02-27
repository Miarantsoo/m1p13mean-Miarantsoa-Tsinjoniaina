import mongoose from "mongoose";

const vector3Schema = new mongoose.Schema(
    {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        z: { type: Number, default: 0 }
    },
    { _id: false }
);

const shopSlotSchema = new mongoose.Schema(
    {
        glb_node_name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            default: null
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CategoryShop",
            required: true
        },
        status: {
            type: String,
            enum: ["available", "occupied", "maintenance", "reserved"],
            default: "available"
        },
        position: {
            type: vector3Schema,
            default: () => ({ x: 0, y: 0, z: 0 })
        }
    },
    {
        timestamps: true,
        collection: "shop_slot"
    }
);

export default mongoose.model("ShopSlot", shopSlotSchema);

