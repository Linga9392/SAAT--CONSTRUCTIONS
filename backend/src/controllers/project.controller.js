import {
    createProjectService,
    getProjectsService,
    getProjectService,
    updateProjectService,
    deleteProjectService
} from "../services/project.service.js";

import {
    createProjectSchema,
    updateProjectSchema
} from "../validators/project.validator.js";

export const createProject = async (req, res) => {
    const { error, value } = createProjectSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const project = await createProjectService(
        value,
        req.user.id
    );

    res.status(201).json({
        success: true,
        message: "Project created successfully",
        data: project
    });
};

export const getProjects = async (req, res) => {
    const projects = await getProjectsService(
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: projects
    });
};

export const getProject = async (req, res) => {
    const project = await getProjectService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: project
    });
};

export const updateProject = async (req, res) => {
    const { error, value } = updateProjectSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const project = await updateProjectService(
        req.params.id,
        req.user.id,
        value
    );

    res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: project
    });
};

export const deleteProject = async (req, res) => {
    const project = await deleteProjectService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Project deleted successfully",
        data: project
    });
};

