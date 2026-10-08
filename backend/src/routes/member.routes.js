import express from "express";

import {
    createMember,
    getMembers,
    getMember,
    updateMember,
    deleteMember
} from "../controllers/member.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createMember);

router.get("/project/:projectId", getMembers);

router.get("/:id", getMember);

router.patch("/:id", updateMember);

router.delete("/:id", deleteMember);

export default router;