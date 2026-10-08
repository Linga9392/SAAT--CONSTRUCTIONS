import {
    createExpenseService,
    getExpensesService,
    getExpenseService,
    updateExpenseService,
    deleteExpenseService
} from "../services/expense.service.js";

import {
    createExpenseSchema,
    updateExpenseSchema,
    expenseProjectSchema
} from "../validators/expense.validator.js";

// Create expense
export const createExpense = async (req, res) => {
    const { error, value } = createExpenseSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const expense = await createExpenseService(
        value,
        req.user.id
    );

    res.status(201).json({
        success: true,
        message: "Expense created successfully",
        data: expense
    });
};

// Get all expenses for a project
export const getExpenses = async (req, res) => {
    const { error, value } = expenseProjectSchema.validate(
        req.query,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const expenses = await getExpensesService(
        value.project_id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: expenses
    });
};

// Get expense by ID
export const getExpense = async (req, res) => {
    const expense = await getExpenseService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: expense
    });
};

// Update expense
export const updateExpense = async (req, res) => {
    const { error, value } = updateExpenseSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const expense = await updateExpenseService(
        req.params.id,
        req.user.id,
        value
    );

    res.status(200).json({
        success: true,
        message: "Expense updated successfully",
        data: expense
    });
};

// Delete expense
export const deleteExpense = async (req, res) => {
    const expense = await deleteExpenseService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Expense deleted successfully",
        data: expense
    });
};