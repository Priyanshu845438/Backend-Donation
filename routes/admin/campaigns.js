const express = require("express");
const AdminController = require("../../controllers/adminController");
const authMiddleware = require("../../middleware/auth");
const { campaignImageUpload, campaignDocumentUpload, campaignProofUpload } = require("../../middleware/upload");

const router = express.Router();

// Admin upload campaign images
router.post("/:campaignId/upload-images", 
    authMiddleware(["admin"]),
    //upload.array("campaignImages", 5),
    campaignImageUpload.array("campaignImages", 10),
    AdminController.uploadCampaignImages
);

// Admin upload campaign documents
router.post("/:campaignId/upload-documents", 
    authMiddleware(["admin"]),
    //upload.array("documents", 5), 
    campaignDocumentUpload.array("documents", 10),
    AdminController.uploadCampaignDocuments
);

// Admin upload campaign proof documents
router.post("/:campaignId/upload-proof", 
    authMiddleware(["admin"]),
    //upload.array("campaignProof", 3),
    campaignProofUpload.array("proofDocs", 10),
    AdminController.uploadCampaignProof
);

// Delete campaign
router.delete("/:id", authMiddleware(["admin"]), AdminController.deleteCampaign);

// Campaign file uploads
router.post(
    "/:campaignId/images",
    authMiddleware(["admin"]),
    campaignImageUpload.array("campaignImages", 10),
    AdminController.uploadCampaignImages
);

router.post(
    "/:campaignId/documents",
    authMiddleware(["admin"]),
    campaignDocumentUpload.array("documents", 10),
    AdminController.uploadCampaignDocuments
);

router.post(
    "/:campaignId/proof",
    authMiddleware(["admin"]),
    campaignProofUpload.array("proofDocs", 10),
    AdminController.uploadCampaignProof
);

module.exports = router;