
const express = require("express");
const Campaign = require("../../models/Campaign");
const NGO = require("../../models/NGO");
const Company = require("../../models/Company");
const ShareLink = require("../../models/ShareLink");
const User = require("../../models/User");

const router = express.Router();

// Get all public campaigns
router.get("/campaigns", async (req, res) => {
    try {
        const campaigns = await Campaign.find({ isActive: true })
            .populate("ngoId", "ngoName email")
            .sort({ createdAt: -1 });
        res.json({ success: true, campaigns });
    } catch (error) {
        res.status(500).json({ message: "Error fetching campaigns", error: error.message });
    }
});

// Get specific campaign
router.get("/campaigns/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id).populate("ngoId", "ngoName email");
        
        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        res.json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ message: "Error fetching campaign", error: error.message });
    }
});

// Access shared profile
router.get("/share/profile/:shareId", async (req, res) => {
    try {
        const { shareId } = req.params;

        const shareLink = await ShareLink.findOne({ 
            shareId, 
            resourceType: "profile",
            isActive: true 
        });

        if (!shareLink) {
            return res.status(404).json({ message: "Shared profile not found or expired" });
        }

        // Check if it's an NGO or Company profile
        const ngo = await NGO.findById(shareLink.resourceId).populate("userId", "fullName email");
        if (ngo) {
            // Update view count
            shareLink.viewCount += 1;
            shareLink.lastViewed = new Date();
            await shareLink.save();

            return res.json({
                success: true,
                data: {
                    type: "ngo",
                    profile: ngo,
                    viewCount: shareLink.viewCount
                }
            });
        }

        const company = await Company.findById(shareLink.resourceId).populate("userId", "fullName email");
        if (company) {
            // Update view count
            shareLink.viewCount += 1;
            shareLink.lastViewed = new Date();
            await shareLink.save();

            return res.json({
                success: true,
                data: {
                    type: "company",
                    profile: company,
                    viewCount: shareLink.viewCount
                }
            });
        }

        return res.status(404).json({ message: "Profile not found" });

    } catch (error) {
        res.status(500).json({ message: "Error accessing shared profile", error: error.message });
    }
});

// Access shared campaign
router.get("/share/campaign/:shareId", async (req, res) => {
    try {
        const { shareId } = req.params;

        const shareLink = await ShareLink.findOne({ 
            shareId, 
            resourceType: "campaign",
            isActive: true 
        });

        if (!shareLink) {
            return res.status(404).json({ message: "Shared campaign not found or expired" });
        }

        const campaign = await Campaign.findById(shareLink.resourceId)
            .populate("ngoId", "ngoName email");

        if (!campaign) {
            return res.status(404).json({ message: "Campaign not found" });
        }

        // Update view count
        shareLink.viewCount += 1;
        shareLink.lastViewed = new Date();
        await shareLink.save();

        res.json({
            success: true,
            data: {
                campaign,
                viewCount: shareLink.viewCount
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error accessing shared campaign", error: error.message });
    }
});

// Get platform statistics
router.get("/stats", async (req, res) => {
    try {
        const [totalNGOs, totalCompanies, totalCampaigns] = await Promise.all([
            NGO.countDocuments({ isActive: true }),
            Company.countDocuments({ isActive: true }),
            Campaign.countDocuments({ isActive: true })
        ]);

        res.json({
            success: true,
            stats: {
                totalNGOs,
                totalCompanies,
                totalCampaigns
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats", error: error.message });
    }
});

module.exports = router;
