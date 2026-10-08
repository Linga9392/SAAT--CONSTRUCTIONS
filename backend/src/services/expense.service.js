import {
    createExpense,
    getExpensesByProject,
    getExpenseById,
    updateExpense,
    deleteExpense
} from "../repositories/expense.repository.js";

import {
    getProjectById
} from "../repositories/project.repository.js";

// Create expense
export const createExpenseService = async (
    data,
    user_id
) => {
    // Verify that the project belongs to the logged-in user
    const project = await getProjectById(
        data.project_id,
        user_id
    );

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    return await createExpense({
        ...data,
        user_id
    });
};

// Get all expenses for a project
export const getExpensesService = async (
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

    return await getExpensesByProject(
        project_id,
        user_id
    );
};

// Get expense by ID
export const getExpenseService = async (
    id,
    user_id
) => {
    const expense = await getExpenseById(
        id,
        user_id
    );

    if (!expense) {
        const error = new Error("Expense not found");
        error.statusCode = 404;
        throw error;
    }

    return expense;
};

// Update expense
export const updateExpenseService = async (
    id,
    user_id,
    data
) => {
    const expense = await updateExpense(
        id,
        user_id,
        data
    );

    if (!expense) {
        const error = new Error("Expense not found");
        error.statusCode = 404;
        throw error;
    }

    return expense;
};

// Delete expense
export const deleteExpenseService = async (
    id,
    user_id
) => {
    const expense = await deleteExpense(
        id,
        user_id
    );

    if (!expense) {
        const error = new Error("Expense not found");
        error.statusCode = 404;
        throw error;
    }

    return expense;
};