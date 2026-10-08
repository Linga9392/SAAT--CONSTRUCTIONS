import {
    createMember,
    getMembersByProject,
    getMemberById,
    updateMember,
    deleteMember
} from "../repositories/member.repository.js";

import {
    getProjectById
} from "../repositories/project.repository.js";

// Create member
export const createMemberService = async (
    data,
    user_id
) => {
    // Verify project ownership
    const project = await getProjectById(
        data.project_id,
        user_id
    );

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    return await createMember({
        ...data,
        user_id
    });
};

// Get all members of a project
export const getMembersService = async (
    project_id,
    user_id
) => {
    // Verify project ownership
    const project = await getProjectById(
        project_id,
        user_id
    );

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    return await getMembersByProject(
        project_id,
        user_id
    );
};

// Get one member
export const getMemberService = async (
    id,
    user_id
) => {
    const member = await getMemberById(
        id,
        user_id
    );

    if (!member) {
        const error = new Error("Member not found");
        error.statusCode = 404;
        throw error;
    }

    return member;
};

// Update member
export const updateMemberService = async (
    id,
    user_id,
    data
) => {
    // Get existing member first
    const existingMember = await getMemberById(
        id,
        user_id
    );

    if (!existingMember) {
        const error = new Error("Member not found");
        error.statusCode = 404;
        throw error;
    }

    // Keep existing values for fields not provided
    const updatedData = {
        full_name:
            data.full_name ??
            existingMember.full_name,

        phone:
            data.phone ??
            existingMember.phone,

        role:
            data.role ??
            existingMember.role,

        joining_date:
            data.joining_date ??
            existingMember.joining_date,

        daily_wage:
            data.daily_wage ??
            existingMember.daily_wage,

        status:
            data.status ??
            existingMember.status
    };

    return await updateMember(
        id,
        user_id,
        updatedData
    );
};

// Delete member
export const deleteMemberService = async (
    id,
    user_id
) => {
    const member = await deleteMember(
        id,
        user_id
    );

    if (!member) {
        const error = new Error("Member not found");
        error.statusCode = 404;
        throw error;
    }

    return member;
};