
const User = require("../models/User");
const Company = require("../models/Company");
const NGO = require("../models/NGO");
const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");
const Activity = require("../models/Activity");
const Notice = require("../models/Notice");
const Settings = require("../models/Settings");
const ShareLink = require("../models/ShareLink");
const bcrypt = require("bcryptjs");
const { createErrorResponse, createSuccessResponse } = require("../utils/errorHandler");
const nodemailer = require("nodemailer");

class AdminController {
    // Dashboard analytics
    static async getDashboard(req, res) {
        try {
            const [
                totalUsers,
                totalNGOs,
                totalCompanies,
                totalCampaigns,
                totalDonations,
                pendingApprovals,
                recentActivities
            ] = await Promise.all([
                User.countDocuments(),
                NGO.countDocuments(),
                Company.countDocuments(),
                Campaign.countDocuments(),
                Donation.countDocuments(),
                User.countDocuments({ approvalStatus: "pending" }),
                Activity.find().sort({ createdAt: -1 }).limit(10).populate("userId", "fullName email")
            ]);

            // Role-wise statistics
            const roleStats = await User.aggregate([
                { $group: { _id: "$role", count: { $sum: 1 } } }
            ]);

            // Monthly registration trends
            const monthlyRegistrations = await User.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": -1, "_id.month": -1 } },
                { $limit: 12 }
            ]);

            // Donation statistics
            const donationStats = await Donation.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$amount" },
                        averageAmount: { $avg: "$amount" },
                        count: { $sum: 1 }
                    }
                }
            ]);

            return createSuccessResponse(res, 200, {
                message: "Dashboard data retrieved successfully",
                dashboard: {
                    overview: {
                        totalUsers,
                        totalNGOs,
                        totalCompanies,
                        totalCampaigns,
                        totalDonations: donationStats[0]?.count || 0,
                        pendingApprovals
                    },
                    roleStats,
                    monthlyRegistrations,
                    donationStats: donationStats[0] || { totalAmount: 0, averageAmount: 0, count: 0 },
                    recentActivities
                }
            });

        } catch (error) {
            console.error("Dashboard error:", error);
            return createErrorResponse(res, 500, "Failed to retrieve dashboard data", error.message);
        }
    }

    // Analytics with charts data
    static async getAnalytics(req, res) {
        try {
            const { period = "month" } = req.query;

            // User growth chart
            const userGrowth = await User.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: period === "month" ? { $month: "$createdAt" } : null,
                            day: period === "day" ? { $dayOfMonth: "$createdAt" } : null
                        },
                        users: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
            ]);

            // Campaign performance
            const campaignPerformance = await Campaign.aggregate([
                {
                    $lookup: {
                        from: "donations",
                        localField: "_id",
                        foreignField: "campaignId",
                        as: "donations"
                    }
                },
                {
                    $project: {
                        title: 1,
                        targetAmount: 1,
                        raisedAmount: { $sum: "$donations.amount" },
                        donationCount: { $size: "$donations" }
                    }
                }
            ]);

            // Role distribution pie chart
            const roleDistribution = await User.aggregate([
                { $group: { _id: "$role", count: { $sum: 1 } } }
            ]);

            // Donation trends
            const donationTrends = await Donation.aggregate([
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        amount: { $sum: "$amount" },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ]);

            return createSuccessResponse(res, 200, {
                message: "Analytics data retrieved successfully",
                analytics: {
                    userGrowth,
                    campaignPerformance,
                    roleDistribution,
                    donationTrends
                }
            });

        } catch (error) {
            console.error("Analytics error:", error);
            return createErrorResponse(res, 500, "Failed to retrieve analytics data", error.message);
        }
    }

    // User Management
    static async createUser(req, res) {
        try {
            const { fullName, email, password, phoneNumber, role } = req.body;

            if (!fullName || !email || !password || !phoneNumber || !role) {
                return createErrorResponse(res, 400, "All fields are required");
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return createErrorResponse(res, 400, "User already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = new User({
                fullName,
                email,
                password: hashedPassword,
                phoneNumber,
                role: role.toLowerCase(),
                isVerified: true,
                isActive: true,
                approvalStatus: "approved"
            });

            await newUser.save();

            // Create role-specific profile
            if (role.toLowerCase() === "ngo") {
                await NGO.create({
                    userId: newUser._id,
                    ngoName: fullName,
                    email,
                    contactNumber: phoneNumber,
                    isActive: true
                });
            } else if (role.toLowerCase() === "company") {
                await Company.create({
                    userId: newUser._id,
                    companyName: fullName,
                    companyEmail: email,
                    companyPhoneNumber: phoneNumber,
                    isActive: true
                });
            }

            await Activity.create({
                userId: req.user.id,
                action: "admin_create_user",
                description: `Admin created user: ${email}`,
                metadata: { targetUserId: newUser._id, role }
            });

            return createSuccessResponse(res, 201, {
                message: "User created successfully",
                user: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    role: newUser.role
                }
            });

        } catch (error) {
            console.error("Create user error:", error);
            return createErrorResponse(res, 500, "Failed to create user", error.message);
        }
    }

    static async getAllUsers(req, res) {
        try {
            const { page = 1, limit = 10, role, status, search } = req.query;
            
            const filter = {};
            if (role) filter.role = role;
            if (status) filter.approvalStatus = status;
            if (search) {
                filter.$or = [
                    { fullName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ];
            }

            const users = await User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);

            const total = await User.countDocuments(filter);

            return createSuccessResponse(res, 200, {
                message: "Users retrieved successfully",
                users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });

        } catch (error) {
            console.error("Get users error:", error);
            return createErrorResponse(res, 500, "Failed to retrieve users", error.message);
        }
    }

    static async approveUser(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body; // "approved" or "rejected"

            const user = await User.findByIdAndUpdate(
                id,
                { 
                    approvalStatus: status,
                    isActive: status === "approved"
                },
                { new: true }
            ).select("-password");

            if (!user) {
                return createErrorResponse(res, 404, "User not found");
            }

            await Activity.create({
                userId: req.user.id,
                action: "admin_approve_user",
                description: `Admin ${status} user: ${user.email}`,
                metadata: { targetUserId: user._id, status }
            });

            // Send email notification
            await this.sendApprovalEmail(user, status);

            return createSuccessResponse(res, 200, {
                message: `User ${status} successfully`,
                user
            });

        } catch (error) {
            console.error("Approve user error:", error);
            return createErrorResponse(res, 500, "Failed to approve user", error.message);
        }
    }

    static async toggleUserStatus(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user) {
                return createErrorResponse(res, 404, "User not found");
            }

            user.isActive = !user.isActive;
            await user.save();

            await Activity.create({
                userId: req.user.id,
                action: "admin_toggle_user_status",
                description: `Admin ${user.isActive ? 'activated' : 'deactivated'} user: ${user.email}`,
                metadata: { targetUserId: user._id, isActive: user.isActive }
            });

            return createSuccessResponse(res, 200, {
                message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
                user: { id: user._id, isActive: user.isActive }
            });

        } catch (error) {
            console.error("Toggle user status error:", error);
            return createErrorResponse(res, 500, "Failed to toggle user status", error.message);
        }
    }

    // Notice System
    static async createNotice(req, res) {
        try {
            const { title, content, type, priority, targetRole, targetUsers, sendEmail, scheduledAt } = req.body;

            const notice = new Notice({
                title,
                content,
                type,
                priority,
                targetRole,
                targetUsers,
                sendEmail,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                createdBy: req.user.id
            });

            await notice.save();

            // Send immediately if not scheduled
            if (!scheduledAt) {
                await this.sendNoticeToUsers(notice);
            }

            return createSuccessResponse(res, 201, {
                message: "Notice created successfully",
                notice
            });

        } catch (error) {
            console.error("Create notice error:", error);
            return createErrorResponse(res, 500, "Failed to create notice", error.message);
        }
    }

    // Share Link Generation
    static async generateProfileShareLink(req, res) {
        try {
            const { id } = req.params;
            const { customDesign } = req.body;

            const shareLink = new ShareLink({
                resourceType: "profile",
                resourceId: id,
                customDesign,
                createdBy: req.user.id
            });

            await shareLink.save();

            return createSuccessResponse(res, 201, {
                message: "Share link generated successfully",
                shareUrl: `${process.env.BASE_URL}/public/profile/${shareLink.shareId}`,
                shareLink
            });

        } catch (error) {
            console.error("Generate share link error:", error);
            return createErrorResponse(res, 500, "Failed to generate share link", error.message);
        }
    }

    // Settings Management
    static async getSettings(req, res) {
        try {
            const settings = await Settings.find().sort({ category: 1 });
            
            return createSuccessResponse(res, 200, {
                message: "Settings retrieved successfully",
                settings
            });

        } catch (error) {
            console.error("Get settings error:", error);
            return createErrorResponse(res, 500, "Failed to retrieve settings", error.message);
        }
    }

    static async updateSettings(req, res) {
        try {
            const { category, settings } = req.body;

            const updatedSettings = await Settings.findOneAndUpdate(
                { category },
                { 
                    settings: new Map(Object.entries(settings)),
                    updatedBy: req.user.id
                },
                { new: true, upsert: true }
            );

            await Activity.create({
                userId: req.user.id,
                action: "admin_update_settings",
                description: `Admin updated ${category} settings`,
                metadata: { category, settings }
            });

            return createSuccessResponse(res, 200, {
                message: "Settings updated successfully",
                settings: updatedSettings
            });

        } catch (error) {
            console.error("Update settings error:", error);
            return createErrorResponse(res, 500, "Failed to update settings", error.message);
        }
    }

    // Helper methods
    static async sendApprovalEmail(user, status) {
        try {
            const emailSettings = await Settings.findOne({ category: "email" });
            if (!emailSettings) return;

            const transporter = nodemailer.createTransporter({
                host: emailSettings.settings.get("smtp_host"),
                port: emailSettings.settings.get("smtp_port"),
                secure: emailSettings.settings.get("smtp_secure"),
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PASS
                }
            });

            const subject = status === "approved" ? "Account Approved" : "Account Rejected";
            const message = status === "approved" 
                ? `Congratulations ${user.fullName}! Your account has been approved and activated.`
                : `Sorry ${user.fullName}, your account registration has been rejected.`;

            await transporter.sendMail({
                from: emailSettings.settings.get("from_email"),
                to: user.email,
                subject,
                text: message
            });
        } catch (error) {
            console.error("Email sending error:", error);
        }
    }

    static async sendNoticeToUsers(notice) {
        // Implementation for sending notices to users
        // This would handle both in-app and email notifications
    }

    // Add more methods for reports, campaign management, etc.
}

module.exports = AdminController;
