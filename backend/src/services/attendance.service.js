import {
    createAttendance,
    getAttendanceByProject,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
} from "../repositories/attendance.repository.js";

import {
    getProjectById
} from "../repositories/project.repository.js";

import {
    getMemberById
} from "../repositories/member.repository.js";

// Create attendance
export const createAttendanceService = async (
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

    // Verify member ownership
    const member = await getMemberById(
        data.member_id,
        user_id
    );

    if (!member) {
        const error = new Error("Member not found");
        error.statusCode = 404;
        throw error;
    }

    // Verify member belongs to the project
    if (member.project_id !== Number(data.project_id)) {
        const error = new Error(
            "Member does not belong to this project"
        );
        error.statusCode = 400;
        throw error;
    }

    return await createAttendance({
        ...data,
        user_id
    });
};

// Get attendance by project
export const getAttendanceService = async (
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

    return await getAttendanceByProject(
        project_id,
        user_id
    );
};

// Get attendance by ID
export const getAttendanceByIdService = async (
    id,
    user_id
) => {
    const attendance = await getAttendanceById(
        id,
        user_id
    );

    if (!attendance) {
        const error = new Error("Attendance not found");
        error.statusCode = 404;
        throw error;
    }

    return attendance;
};

// Update attendance
export const updateAttendanceService = async (
    id,
    user_id,
    data
) => {
    // Get existing attendance first
    const existingAttendance = await getAttendanceById(
        id,
        user_id
    );

    if (!existingAttendance) {
        const error = new Error("Attendance not found");
        error.statusCode = 404;
        throw error;
    }

    // Keep existing values for fields not provided
    const updatedData = {
        attendance_date:
            data.attendance_date ??
            existingAttendance.attendance_date,

        status:
            data.status ??
            existingAttendance.status,

        overtime_hours:
            data.overtime_hours ??
            existingAttendance.overtime_hours,

        wage_amount:
            data.wage_amount ??
            existingAttendance.wage_amount
    };

    return await updateAttendance(
        id,
        user_id,
        updatedData
    );
};

// Delete attendance
export const deleteAttendanceService = async (
    id,
    user_id
) => {
    const attendance = await deleteAttendance(
        id,
        user_id
    );

    if (!attendance) {
        const error = new Error("Attendance not found");
        error.statusCode = 404;
        throw error;
    }

    return attendance;
};