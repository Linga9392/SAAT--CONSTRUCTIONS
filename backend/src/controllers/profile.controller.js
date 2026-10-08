import {
    getProfileService,
    updateProfileService
} from "../services/profile.service.js";

import {
    updateProfileSchema
} from "../validators/profile.validator.js";

// Get current user profile
export const getProfile = async (req, res) => {
    const profile = await getProfileService(
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: profile
    });
};

// Update current user profile
export const updateProfile = async (req, res) => {
    const { error, value } = updateProfileSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const profile = await updateProfileService(
        req.user.id,
        value
    );

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile
    });
};