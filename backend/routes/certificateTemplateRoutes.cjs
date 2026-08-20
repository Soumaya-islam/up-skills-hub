const express = require("express");

const {
    createTemplate,
    getTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate
} = require("../controllers/certificateTemplateController.cjs");

const router = express.Router();

// Create template
router.post("/", createTemplate);

// Get all templates
router.get("/", getTemplates);

// Get one template
router.get("/:id", getTemplateById);

// Update template
router.put("/:id", updateTemplate);

// Delete template
router.delete("/:id", deleteTemplate);

module.exports = router;