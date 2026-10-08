import {
    getProfile,
    updateProfile
} from "../repositories/profile.repository.js";

// Get current user profile
export const getProfileService = async (
    user_id
) => {
    const profile = await getProfile(user_id);

    if (!profile) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return profile;
};

// Update current user profile
export const updateProfileService = async (
    user_id,
    data
) => {
    const profile = await updateProfile(
        user_id,
        data
    );

    if (!profile) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return profile;
};