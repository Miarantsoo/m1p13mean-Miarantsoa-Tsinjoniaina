const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

promotionSchema.index({ product: 1, startDate: 1, endDate: 1 });
promotionSchema.index({ shop: 1, isActive: 1 });

promotionSchema.methods.isValid = function() {
    const now = new Date();
    return this.isActive && this.startDate <= now && this.endDate >= now;
};

/*promotionSchema.pre('save', function(next) {
    if (this.startDate >= this.endDate) {
        next(new Error('La date de fin doit être après la date de début'));
    }
    next();
});*/

module.exports = mongoose.model("Promotion", promotionSchema);