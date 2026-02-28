import mongoose from 'mongoose';

const categoryShopSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        rent_price: {
            type: Number,
            required: true,
            min: 0
        },
    },
    {
        collection: "category_shop"
    }
)

export default mongoose.model('CategoryShop', categoryShopSchema);