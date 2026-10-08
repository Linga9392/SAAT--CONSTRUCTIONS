import {
    createPayrollService,
    getPayrollService,
    getPayrollByIdService,
    updatePayrollPaymentService,
    deletePayrollService
} from "../services/payroll.service.js";

import {
    createPayrollSchema,
    payrollProjectSchema,
    updatePayrollPaymentSchema
} from "../validators/payroll.validator.js";

// Create payroll
export const createPayroll = async (req, res) => {
    const { error, value } = createPayrollSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const payroll = await createPayrollService(
        value,
        req.user.id
    );

    res.status(201).json({
        success: true,
        message: "Payroll created successfully",
        data: payroll
    });
};

// Get payroll records for a project
export const getPayroll = async (req, res) => {
    const { error, value } = payrollProjectSchema.validate(
        req.query,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const payroll = await getPayrollService(
        value.project_id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: payroll
    });
};

// Get payroll by ID
export const getPayrollById = async (req, res) => {
    const payroll = await getPayrollByIdService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: payroll
    });
};

// Update payroll payment
export const updatePayrollPayment = async (req, res) => {
    const { error, value } =
        updatePayrollPaymentSchema.validate(
            req.body,
            {
                abortEarly: false,
                stripUnknown: true
            }
        );

    if (error) {
        throw error;
    }

    const payroll =
        await updatePayrollPaymentService(
            req.params.id,
            req.user.id,
            value.payment_status,
            value.paid_at
        );

    res.status(200).json({
        success: true,
        message: "Payroll payment updated successfully",
        data: payroll
    });
};

// Delete payroll
export const deletePayroll = async (req, res) => {
    const payroll = await deletePayrollService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Payroll deleted successfully",
        data: payroll
    });
};
