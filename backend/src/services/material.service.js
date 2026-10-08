import {
    createMaterial,
    getMaterialsByProject,
    getMaterialById,
    updateMaterial,
    deleteMaterial
} from "../repositories/material.repository.js";

import {
    getProjectById
} from "../repositories/project.repository.js";

// Create material
export const createMaterialService = async (
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

    return await createMaterial({
        ...data,
        user_id
    });
};

// Get materials by project
export const getMaterialsService = async (
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

    return await getMaterialsByProject(
        project_id,
        user_id
    );
};

// Get material by ID
export const getMaterialService = async (
    id,
    user_id
) => {
    const material = await getMaterialById(
        id,
        user_id
    );

    if (!material) {
        const error = new Error("Material not found");
        error.statusCode = 404;
        throw error;
    }

    return material;
};

// Update material
export const updateMaterialService = async (
    id,
    user_id,
    data
) => {
    // Get existing material first
    const existingMaterial = await getMaterialById(
        id,
        user_id
    );

    if (!existingMaterial) {
        const error = new Error("Material not found");
        error.statusCode = 404;
        throw error;
    }

    // Keep existing values for fields not provided
    const updatedData = {
        material_name:
            data.material_name ??
            existingMaterial.material_name,

        category:
            data.category ??
            existingMaterial.category,

        unit:
            data.unit ??
            existingMaterial.unit,

        quantity:
            data.quantity ??
            existingMaterial.quantity,

        purchase_price:
            data.purchase_price ??
            existingMaterial.purchase_price,

        supplier_name:
            data.supplier_name ??
            existingMaterial.supplier_name,

        minimum_stock:
            data.minimum_stock ??
            existingMaterial.minimum_stock
    };

    return await updateMaterial(
        id,
        user_id,
        updatedData
    );
};

// Delete material
export const deleteMaterialService = async (
    id,
    user_id
) => {
    const material = await deleteMaterial(
        id,
        user_id
    );

    if (!material) {
        const error = new Error("Material not found");
        error.statusCode = 404;
        throw error;
    }

    return material;
};