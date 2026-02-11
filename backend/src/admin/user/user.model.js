import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Veuillez fournir un email valide']
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId;
        },
        minlength: [8, 'Le mot de passe doit contenir au moins 6 caractères'],
        select: false
    },
    phone_number: {
        type: String,
        default: null,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'shop', 'customer'],
        default: 'customer'
    },
    avatar: {
        type: String,
        default: null
    },

    // Champs pour Google OAuth
    googleId: {
        type: String,
        unique: true,
        sparse: true // Permet les valeurs null et unique en même temps
    },
    provider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    lastLogin: {
        type: Date,
        default: null
    },
    // Status du compte
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Erreur lors de la comparaison du mot de passe');
    }
};

userSchema.methods.toPublicJSON = function() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        avatar: this.avatar,
        provider: this.provider,
        isEmailVerified: this.isEmailVerified,
        lastLogin: this.lastLogin,
        createdAt: this.createdAt
    };
};

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    if (!this.password) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.updateLastLogin = async function() {
    this.lastLogin = new Date();
    return await this.save();
};

export default mongoose.model("User", userSchema);