import express from "express";

import {
    createSiteProgress,
    getSiteProgress,
    getSiteProgressById,
    updateSiteProgress,
    deleteSiteProgress,
    getProjectSiteProgress,
} from "../controllers/siteProgress.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    createSiteProgress
);

router.get(
    "/",
    getSiteProgress
);

router.get(
    "/project/:projectId",
    getProjectSiteProgress
);

router.get(
    "/:id",
    getSiteProgressById
);

router.patch(
    "/:id",
    updateSiteProgress
);

router.delete(
    "/:id",
    deleteSiteProgress
);

export default router;