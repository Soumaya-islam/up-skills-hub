const express = require("express");

const {
    createCertificate,
    getCertificates,
    getCertificateById,
    updateCertificate,
    deleteCertificate,
    verifyCertificate
} = require("../controllers/certificateController.cjs");

const router = express.Router();

router.post("/", createCertificate);

router.get("/", getCertificates);

router.get("/verify/:certificateNumber", verifyCertificate);

router.get("/:id", getCertificateById);

router.put("/:id", updateCertificate);

router.delete("/:id", deleteCertificate);

module.exports = router;