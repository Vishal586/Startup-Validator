const express = require("express");
const router = express.Router();
const {
    createIdea,
    getIdeas,
    getIdeaById,
    deleteIdea,
} = require("../controllers/ideaController");

router.post("/", createIdea);
router.get("/", getIdeas);
router.get("/:id", getIdeaById);
router.delete("/:id", deleteIdea);

module.exports = router;