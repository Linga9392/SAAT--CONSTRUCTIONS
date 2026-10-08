import {
    createProjectItemService,
    getProjectItemsService,
    getProjectItemService,
    updateProjectItemService,
    deleteProjectItemService
} from "../services/project-item.service.js";

import {
    createProjectItemSchema,
    updateProjectItemSchema,
    projectItemProjectSchema
} from "../validators/project-item.validator.js";

// Create project item
export const createProjectItem = async (req, res) => {
    const { error, value } = createProjectItemSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const item = await createProjectItemService(
        value,
        req.user.id
    );

    res.status(201).json({
        success: true,
        message: "Project item created successfully",
        data: item
    });
};

// Get all project items for a project
export const getProjectItems = async (req, res) => {
    const { error, value } = projectItemProjectSchema.validate(
        req.query,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const items = await getProjectItemsService(
        value.project_id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: items
    });
};

// Get project item by ID
export const getProjectItem = async (req, res) => {
    const item = await getProjectItemService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: item
    });
};

// Update project item
export const updateProjectItem = async (req, res) => {
    const { error, value } = updateProjectItemSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const item = await updateProjectItemService(
        req.params.id,
        req.user.id,
        value
    );

    res.status(200).json({
        success: true,
        message: "Project item updated successfully",
        data: item
    });
};

// Delete project item
export const deleteProjectItem = async (req, res) => {
    const item = await deleteProjectItemService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Project item deleted successfully",
        data: item
    });
};