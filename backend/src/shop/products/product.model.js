const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    shortDescription: {
        type: String,
        maxlength: 500
    },
    photo: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    available: {
        type: Boolean,
        default: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
}, {
    timestamps: true
});

productSchema.virtual('promotion', {
    ref: 'Promotion',
    localField: '_id',
    foreignField: 'product',
    justOne: true,
    match: function() {
        const now = new Date();
        return {
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        };
    }
});

productSchema.index({ shop: 1 });
productSchema.index({ category: 1 });
productSchema.index({ available: 1 });

productSchema.methods.isAvailable = function() {
    return this.stock > 0 && this.available;
};

/*productSchema.pre('save', function(next) {
    if (this.stock === 0) {
        this.available = false;
    }
    next();
});*/

productSchema.path('stock').set(function(value) {
    this.available = value > 0;
    return value;
});

module.exports = mongoose.model("Product", productSchema);