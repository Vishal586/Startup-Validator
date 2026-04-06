const Idea = require("../models/Idea");
const { analyzeIdea } = require("../services/geminiService");

// POST /api/ideas — create idea & trigger AI analysis
const createIdea = async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: "Title and description are required." });
    }

    if (title.trim().length < 3) {
        return res.status(400).json({ error: "Title must be at least 3 characters." });
    }

    if (description.trim().length < 20) {
        return res.status(400).json({ error: "Description must be at least 20 characters." });
    }

    let idea;
    try {
        // Save immediately with pending status
        idea = await Idea.create({
            title: title.trim(),
            description: description.trim(),
            status: "analyzing",
        });

        // Run AI analysis
        const report = await analyzeIdea(title.trim(), description.trim());

        // Update idea with report
        idea.report = report;
        idea.status = "completed";
        await idea.save();

        return res.status(201).json({ success: true, data: idea });
    } catch (error) {
        console.error("Error in createIdea:", error.message);

        // Mark as failed if AI analysis fails
        if (idea) {
            idea.status = "failed";
            await idea.save();
        }

        return res.status(500).json({
            error: error.message || "Failed to analyze idea. Please try again.",
        });
    }
};

// GET /api/ideas — list all ideas (summary, no full report)
const getIdeas = async (req, res) => {
    try {
        const ideas = await Idea.find()
            .sort({ createdAt: -1 })
            .select("title description status createdAt report.risk_level report.profitability_score");

        return res.json({ success: true, count: ideas.length, data: ideas });
    } catch (error) {
        console.error("Error in getIdeas:", error.message);
        return res.status(500).json({ error: "Failed to fetch ideas." });
    }
};

// GET /api/ideas/:id — get full idea with report
const getIdeaById = async (req, res) => {
    try {
        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ error: "Idea not found." });
        }
        return res.json({ success: true, data: idea });
    } catch (error) {
        console.error("Error in getIdeaById:", error.message);
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid idea ID." });
        }
        return res.status(500).json({ error: "Failed to fetch idea." });
    }
};

// DELETE /api/ideas/:id — delete an idea
const deleteIdea = async (req, res) => {
    try {
        const idea = await Idea.findByIdAndDelete(req.params.id);
        if (!idea) {
            return res.status(404).json({ error: "Idea not found." });
        }
        return res.json({ success: true, message: "Idea deleted successfully." });
    } catch (error) {
        console.error("Error in deleteIdea:", error.message);
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid idea ID." });
        }
        return res.status(500).json({ error: "Failed to delete idea." });
    }
};

module.exports = { createIdea, getIdeas, getIdeaById, deleteIdea };