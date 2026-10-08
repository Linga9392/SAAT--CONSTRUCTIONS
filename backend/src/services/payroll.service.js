import {
    createPayroll,
    getPayrollByProject,
    getPayrollById,
    updatePayrollPayment,
    deletePayroll
} from "../repositories/payroll.repository.js";

import {
    getProjectById
} from "../repositories/project.repository.js";

import {
    getMemberById
} from "../repositories/member.repository.js";

// Create payroll
export const createPayrollService = async (
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
    if (
        Number(member.project_id) !==
        Number(data.project_id)
    ) {
        const error = new Error(
            "Member does not belong to this project"
        );
        error.statusCode = 400;
        throw error;
    }

    return await createPayroll({
        ...data,
        user_id
    });
};

// Get payroll by project
export const getPayrollService = async (
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

    return await getPayrollByProject(
        project_id,
        user_id
    );
};

// Get payroll by ID
export const getPayrollByIdService = async (
    id,
    user_id
) => {
    const payroll = await getPayrollById(
        id,
        user_id
    );

    if (!payroll) {
        const error = new Error("Payroll not found");
        error.statusCode = 404;
        throw error;
    }

    return payroll;
};

// Update payroll payment
export const updatePayrollPaymentService = async (
    id,
    user_id,
    payment_status
) => {
    // Get existing payroll record
    const existingPayroll = await getPayrollById(
        id,
        user_id
    );

    if (!existingPayroll) {
        const error = new Error("Payroll not found");
        error.statusCode = 404;
        throw error;
    }

    // Set paid time only when payment is marked as PAID
    const paid_at =
        payment_status === "PAID"
            ? new Date()
            : null;

    return await updatePayrollPayment(
        id,
        user_id,
        payment_status,
        paid_at
    );
};

// Delete payroll
export const deletePayrollService = async (
    id,
    user_id
) => {
    const payroll = await deletePayroll(
        id,
        user_id
    );

    if (!payroll) {
        const error = new Error("Payroll not found");
        error.statusCode = 404;
        throw error;
    }

    return payroll;
};