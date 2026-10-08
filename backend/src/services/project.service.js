import {
    createProject,
    getProjectsByUser,
    getProjectById,
    updateProject,
    deleteProject
} from "../repositories/project.repository.js";

// Create project
export const createProjectService = async (
    data,
    user_id
) => {
    return await createProject({
        ...data,
        user_id
    });
};

// Get all projects
export const getProjectsService = async (
    user_id
) => {
    return await getProjectsByUser(user_id);
};

// Get one project
export const getProjectService = async (
    id,
    user_id
) => {
    const project = await getProjectById(
        id,
        user_id
    );

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    return project;
};

// Update project
export const updateProjectService = async (
    id,
    user_id,
    data
) => {
    // Get existing project first
    const existingProject = await getProjectById(
        id,
        user_id
    );

    if (!existingProject) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    // Keep existing values when a field is not provided
    const updatedData = {
        project_name:
            data.project_name ??
            existingProject.project_name,

        client_name:
            data.client_name ??
            existingProject.client_name,

        location:
            data.location ??
            existingProject.location,

        description:
            data.description ??
            existingProject.description,

        start_date:
            data.start_date ??
            existingProject.start_date,

        end_date:
            data.end_date ??
            existingProject.end_date,

        budget:
            data.budget ??
            existingProject.budget,

        status:
            data.status ??
            existingProject.status
    };

    return await updateProject(
        id,
        user_id,
        updatedData
    );
};

// Delete project
export const deleteProjectService = async (
    id,
    user_id
) => {
    const project = await deleteProject(
        id,
        user_id
    );

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    return project;
};