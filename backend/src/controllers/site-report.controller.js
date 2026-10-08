import {
    createSiteReportService,
    getSiteReportsService,
    getSiteReportService,
    updateSiteReportService,
    deleteSiteReportService
} from "../services/site-report.service.js";

import {
    createSiteReportSchema,
    updateSiteReportSchema,
    siteReportProjectSchema
} from "../validators/site-report.validator.js";

// Create site report
export const createSiteReport = async (req, res) => {
    const { error, value } = createSiteReportSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const report = await createSiteReportService(
        value,
        req.user.id
    );

    res.status(201).json({
        success: true,
        message: "Site report created successfully",
        data: report
    });
};

// Get all site reports for a project
export const getSiteReports = async (req, res) => {
    const { error, value } = siteReportProjectSchema.validate(
        req.query,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const reports = await getSiteReportsService(
        value.project_id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: reports
    });
};

// Get site report by ID
export const getSiteReport = async (req, res) => {
    const report = await getSiteReportService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: report
    });
};

// Update site report
export const updateSiteReport = async (req, res) => {
    const { error, value } = updateSiteReportSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const report = await updateSiteReportService(
        req.params.id,
        req.user.id,
        value
    );

    res.status(200).json({
        success: true,
        message: "Site report updated successfully",
        data: report
    });
};

// Delete site report
export const deleteSiteReport = async (req, res) => {
    const report = await deleteSiteReportService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        message: "Site report deleted successfully",
        data: report
    });
};