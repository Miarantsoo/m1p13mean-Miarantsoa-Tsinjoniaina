import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        priceAtOrder: {
            type: Number,
            required: true,
            min: 0
        }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (v) => v.length > 0,
                message: "Une commande doit contenir au moins un article."
            }
        },
        pickupDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "ready", "picked_up", "cancelled"],
            default: "pending"
        },
        orderDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true,
        collection: "orders"
    }
);

orderSchema.index({ user: 1 });
orderSchema.index({ shop: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model("Order", orderSchema);

