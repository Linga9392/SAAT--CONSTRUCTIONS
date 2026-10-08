import {
    createMaterialService,
    getMaterialsService,
    getMaterialService,
    updateMaterialService,
    deleteMaterialService
} from "../services/material.service.js";

import {
    createMaterialSchema,
    updateMaterialSchema,
    materialProjectSchema
} from "../validators/material.validator.js";

// Create material
export const createMaterial = async (req, res) => {
    const { error, value } = createMaterialSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const material = await createMaterialService(
        value,
        req.user.id
    );

    res.status(201).json({
        success: true,
        message: "Material created successfully",
        data: material
    });
};

// Get all materials for a project
export const getMaterials = async (req, res) => {
    const { error, value } = materialProjectSchema.validate(
        req.query,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const materials = await getMaterialsService(
        value.project_id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: materials
    });
};

// Get material by ID
export const getMaterial = async (req, res) => {
    const material = await getMaterialService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: material
    });
};

// Update material
export const updateMaterial = async (req, res) => {
    const { error, value } = updateMaterialSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const material = await updateMaterialService(
        req.params.id,
        req.user.id,
        value
    );

    res.status(200).json({
        success: true,
        message: "Material updated successfully",
        data: material
    });
};

// Delete material
export const deleteMaterial = async (req, res) => {
    const material = await deleteMaterialService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Material deleted successfully",
        data: material
    });
};