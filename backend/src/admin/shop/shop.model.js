const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: null
        },
        logo_url: {
            type: String,
            default: null
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        shop_request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShopRequest",
            default: null
        },
        status: {
            type: String,
            enum: ["active", "inactive", "closed"],
            default: "inactive"
        },
        color: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        collection: "shops"
    }
);

module.exports = mongoose.model("Shop", shopSchema);