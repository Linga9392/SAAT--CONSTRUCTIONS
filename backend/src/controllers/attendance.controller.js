import {
    createAttendanceService,
    getAttendanceService,
    getAttendanceByIdService,
    updateAttendanceService,
    deleteAttendanceService
} from "../services/attendance.service.js";

import {
    createAttendanceSchema,
    updateAttendanceSchema,
    attendanceProjectSchema
} from "../validators/attendance.validator.js";

export const createAttendance = async (req, res) => {
    const { error, value } = createAttendanceSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const attendance = await createAttendanceService(
        value,
        req.user.id
    );

    res.status(201).json({
        success: true,
        message: "Attendance created successfully",
        data: attendance
    });
};

export const getAttendance = async (req, res) => {
    const { error, value } = attendanceProjectSchema.validate(
        req.query,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const attendance = await getAttendanceService(
        value.project_id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: attendance
    });
};

export const getAttendanceById = async (req, res) => {
    const attendance = await getAttendanceByIdService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: attendance
    });
};

export const updateAttendance = async (req, res) => {
    const { error, value } = updateAttendanceSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const attendance = await updateAttendanceService(
        req.params.id,
        req.user.id,
        value
    );

    res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
        data: attendance
    });
};

export const deleteAttendance = async (req, res) => {
    const attendance = await deleteAttendanceService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Attendance deleted successfully",
        data: attendance
    });
};