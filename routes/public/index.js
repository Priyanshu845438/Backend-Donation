const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Campaign = require('../../models/Campaign');

// Get all active NGOs
router.get('/ngos', async (req, res) => {
    try {
        const ngos = await User.find({ 
            role: 'ngo', 
            isActive: true 
        }).select('-password -__v');

        res.json({
            message: 'NGOs retrieved successfully',
            ngos
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving NGOs',
            error: error.message
        });
    }
});

// Get all active companies
router.get('/companies', async (req, res) => {
    try {
        const companies = await User.find({ 
            role: 'company', 
            isActive: true 
        }).select('-password -__v');

        res.json({
            message: 'Companies retrieved successfully',
            companies
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving companies',
            error: error.message
        });
    }
});

// Get all active campaigns
router.get('/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find({ 
            isActive: true 
        }).populate('createdBy', 'fullName email');

        res.json({
            message: 'Campaigns retrieved successfully',
            campaigns
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving campaigns',
            error: error.message
        });
    }
});

// Get NGO by ID
router.get('/ngos/:id', async (req, res) => {
    try {
        const ngo = await User.findOne({ 
            _id: req.params.id, 
            role: 'ngo', 
            isActive: true 
        }).select('-password -__v');

        if (!ngo) {
            return res.status(404).json({
                message: 'NGO not found'
            });
        }

        res.json({
            message: 'NGO retrieved successfully',
            ngo
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving NGO',
            error: error.message
        });
    }
});

// Get campaign by ID
router.get('/campaigns/:id', async (req, res) => {
    try {
        const campaign = await Campaign.findOne({ 
            _id: req.params.id, 
            isActive: true 
        }).populate('createdBy', 'fullName email');

        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found'
            });
        }

        res.json({
            message: 'Campaign retrieved successfully',
            campaign
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving campaign',
            error: error.message
        });
    }
});

module.exports = router;