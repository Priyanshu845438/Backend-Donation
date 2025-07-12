
const mongoose = require("mongoose");
const crypto = require("crypto");

const ShareLinkSchema = new mongoose.Schema({
    shareId: { type: String, unique: true },
    resourceType: { type: String, enum: ["profile", "campaign", "portfolio"], required: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    customDesign: {
        html: String,
        css: String,
        additionalData: mongoose.Schema.Types.Mixed
    },
    isActive: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 },
    lastViewed: { type: Date },
    expiresAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

ShareLinkSchema.pre("save", function(next) {
    if (!this.shareId) {
        this.shareId = crypto.randomBytes(16).toString("hex");
    }
    next();
});

ShareLinkSchema.pre("validate", function(next) {
    if (!this.shareId) {
        this.shareId = crypto.randomBytes(16).toString("hex");
    }
    next();
});

module.exports = mongoose.model("ShareLink", ShareLinkSchema);
