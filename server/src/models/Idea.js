const mongoose = require("mongoose");

const CompetitorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    differentiation: { type: String, required: true },
});

const IdeaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title must be under 200 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxlength: [2000, "Description must be under 2000 characters"],
        },
        status: {
            type: String,
            enum: ["pending", "analyzing", "completed", "failed"],
            default: "pending",
        },
        report: {
            problem: { type: String },
            customer: { type: String },
            market: { type: String },
            competitors: [CompetitorSchema],
            tech_stack: [{ type: String }],
            risk_level: {
                type: String,
                enum: ["Low", "Medium", "High"],
            },
            profitability_score: {
                type: Number,
                min: 0,
                max: 100,
            },
            justification: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Idea", IdeaSchema);