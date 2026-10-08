import {
    createMemberService,
    getMembersService,
    getMemberService,
    updateMemberService,
    deleteMemberService
} from "../services/member.service.js";

import {
    createMemberSchema,
    updateMemberSchema
} from "../validators/member.validator.js";

// Create member
export const createMember = async (req, res) => {
    const { error, value } = createMemberSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const member = await createMemberService(
        value,
        req.user.id
    );

    res.status(201).json({
        success: true,
        message: "Member created successfully",
        data: member
    });
};

// Get all members of a project
export const getMembers = async (req, res) => {
    const { projectId } = req.params;

    const members = await getMembersService(
        projectId,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: members
    });
};

// Get member by ID
export const getMember = async (req, res) => {
    const member = await getMemberService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: member
    });
};

// Update member
export const updateMember = async (req, res) => {
    const { error, value } = updateMemberSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const member = await updateMemberService(
        req.params.id,
        req.user.id,
        value
    );

    res.status(200).json({
        success: true,
        message: "Member updated successfully",
        data: member
    });
};

// Delete member
export const deleteMember = async (req, res) => {
    const member = await deleteMemberService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Member deleted successfully",
        data: member
    });
};