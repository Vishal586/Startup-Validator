require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const ideaRoutes = require("./routes/ideas");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/ideas", ideaRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({ message: "AI Startup Idea Validator API is running 🚀" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});