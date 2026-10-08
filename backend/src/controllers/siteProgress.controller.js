import {
    addSiteProgress,
    listSiteProgress,
    findSiteProgress,
    editSiteProgress,
    removeSiteProgress,
    getProjectProgress,
} from "../services/siteProgress.service.js";

export const createSiteProgress = async (
    req,
    res
) => {
    try {
        const progress =
            await addSiteProgress(
                req.user.id,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Site progress created successfully",
            data: progress,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getSiteProgress = async (
    req,
    res
) => {
    try {
        const progress =
            await listSiteProgress(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Site progress fetched successfully",
            data: progress,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getSiteProgressById = async (
    req,
    res
) => {
    try {
        const progress =
            await findSiteProgress(
                req.user.id,
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Site progress fetched successfully",
            data: progress,
        });
    } catch (error) {
        const statusCode =
            error.message ===
            "Site progress record not found"
                ? 404
                : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateSiteProgress = async (
    req,
    res
) => {
    try {
        const progress =
            await editSiteProgress(
                req.user.id,
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            message:
                "Site progress updated successfully",
            data: progress,
        });
    } catch (error) {
        const statusCode =
            error.message ===
            "Site progress record not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteSiteProgress = async (
    req,
    res
) => {
    try {
        await removeSiteProgress(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Site progress deleted successfully",
        });
    } catch (error) {
        const statusCode =
            error.message ===
            "Site progress record not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

export const getProjectSiteProgress =
    async (req, res) => {
        try {
            const progress =
                await getProjectProgress(
                    req.user.id,
                    req.params.projectId
                );

            return res.status(200).json({
                success: true,
                message:
                    "Project site progress fetched successfully",
                data: progress,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };