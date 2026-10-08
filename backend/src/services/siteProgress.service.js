import {
    createSiteProgress,
    getSiteProgress,
    getSiteProgressById,
    updateSiteProgress,
    deleteSiteProgress,
    getProjectProgressSummary,
} from "../repositories/siteProgress.repository.js";

export const addSiteProgress = async (
    userId,
    data
) => {
    return await createSiteProgress(
        userId,
        data
    );
};

export const listSiteProgress = async (
    userId
) => {
    return await getSiteProgress(
        userId
    );
};

export const findSiteProgress = async (
    userId,
    progressId
) => {
    const progress =
        await getSiteProgressById(
            userId,
            progressId
        );

    if (!progress) {
        throw new Error(
            "Site progress record not found"
        );
    }

    return progress;
};

export const editSiteProgress = async (
    userId,
    progressId,
    data
) => {
    const existingProgress =
        await getSiteProgressById(
            userId,
            progressId
        );

    if (!existingProgress) {
        throw new Error(
            "Site progress record not found"
        );
    }

    const updatedProgress =
        await updateSiteProgress(
            userId,
            progressId,
            {
                ...existingProgress,
                ...data,
            }
        );

    return updatedProgress;
};

export const removeSiteProgress = async (
    userId,
    progressId
) => {
    const existingProgress =
        await getSiteProgressById(
            userId,
            progressId
        );

    if (!existingProgress) {
        throw new Error(
            "Site progress record not found"
        );
    }

    return await deleteSiteProgress(
        userId,
        progressId
    );
};

export const getProjectProgress = async (
    userId,
    projectId
) => {
    return await getProjectProgressSummary(
        userId,
        projectId
    );
};