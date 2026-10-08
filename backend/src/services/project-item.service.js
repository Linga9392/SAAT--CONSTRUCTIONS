import {
    createProjectItem,
    getProjectItemsByProject,
    getProjectItemById,
    updateProjectItem,
    deleteProjectItem
} from "../repositories/project-item.repository.js";

import {
    getProjectById
} from "../repositories/project.repository.js";

// Create project item
export const createProjectItemService = async (
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

    return await createProjectItem({
        ...data,
        user_id
    });
};

// Get project items by project
export const getProjectItemsService = async (
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

    return await getProjectItemsByProject(
        project_id,
        user_id
    );
};

// Get project item by ID
export const getProjectItemService = async (
    id,
    user_id
) => {
    const item = await getProjectItemById(
        id,
        user_id
    );

    if (!item) {
        const error = new Error("Project item not found");
        error.statusCode = 404;
        throw error;
    }

    return item;
};

// Update project item
export const updateProjectItemService = async (
    id,
    user_id,
    data
) => {
    // Get existing project item first
    const existingItem = await getProjectItemById(
        id,
        user_id
    );

    if (!existingItem) {
        const error = new Error("Project item not found");
        error.statusCode = 404;
        throw error;
    }

    // Keep existing values for fields not provided
    const updatedData = {
        item_name:
            data.item_name ??
            existingItem.item_name,

        description:
            data.description ??
            existingItem.description,

        unit:
            data.unit ??
            existingItem.unit,

        quantity:
            data.quantity ??
            existingItem.quantity,

        unit_price:
            data.unit_price ??
            existingItem.unit_price
    };

    return await updateProjectItem(
        id,
        user_id,
        updatedData
    );
};

// Delete project item
export const deleteProjectItemService = async (
    id,
    user_id
) => {
    const item = await deleteProjectItem(
        id,
        user_id
    );

    if (!item) {
        const error = new Error("Project item not found");
        error.statusCode = 404;
        throw error;
    }

    return item;
};