import swaggerAutogen from "swagger-autogen";
import fs from "fs";

const outputFile = "./swagger-output.json";

const endpointsFiles = [
    "./server.js"
];

const doc = {
    info: {
        title: "SAAT Construction API",
        description: "API documentation for Sri Amma Anna Temple Construction",
        version: "1.0.0"
    },

    host: "localhost:5000",

    schemes: [
        "http"
    ],

    securityDefinitions: {
        bearerAuth: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description: "Enter JWT token as: Bearer <token>"
        }
    }
};

const addBody = (
    swagger,
    path,
    method,
    properties,
    required = []
) => {
    if (!swagger.paths?.[path]?.[method]) {
        return;
    }

    const operation = swagger.paths[path][method];

    operation.parameters = operation.parameters || [];

    operation.parameters = operation.parameters.filter(
        (parameter) =>
            parameter.in !== "body"
    );

    operation.parameters.push({
        name: "body",
        in: "body",
        required: true,
        schema: {
            type: "object",
            properties,
            required
        }
    });
};

const addPathId = (
    swagger,
    path,
    method
) => {
    if (!swagger.paths?.[path]?.[method]) {
        return;
    }

    const operation = swagger.paths[path][method];

    operation.parameters = operation.parameters || [];

    const exists = operation.parameters.some(
        (parameter) =>
            parameter.name === "id" &&
            parameter.in === "path"
    );

    if (!exists) {
        operation.parameters.push({
            name: "id",
            in: "path",
            required: true,
            type: "integer",
            format: "int32",
            description: "Record ID"
        });
    }
};

const addQueryParameter = (
    swagger,
    path,
    method,
    name,
    type = "integer",
    required = true
) => {
    if (!swagger.paths?.[path]?.[method]) {
        return;
    }

    const operation = swagger.paths[path][method];

    operation.parameters = operation.parameters || [];

    const exists = operation.parameters.some(
        (parameter) =>
            parameter.name === name &&
            parameter.in === "query"
    );

    if (!exists) {
        operation.parameters.push({
            name,
            in: "query",
            required,
            type
        });
    }
};

const generateSwagger = async () => {
    await swaggerAutogen()(
        outputFile,
        endpointsFiles,
        doc
    );

    const swagger = JSON.parse(
        fs.readFileSync(
            outputFile,
            "utf8"
        )
    );

    // Authentication

    addBody(
        swagger,
        "/api/v1/auth/register",
        "post",
        {
            full_name: {
                type: "string",
                example: "Karthik"
            },
            email: {
                type: "string",
                format: "email",
                example: "karthik@example.com"
            },
            password: {
                type: "string",
                format: "password",
                example: "123456"
            },
            phone: {
                type: "string",
                example: "9876543210"
            }
        },
        [
            "full_name",
            "email",
            "password"
        ]
    );

    addBody(
        swagger,
        "/api/v1/auth/login",
        "post",
        {
            email: {
                type: "string",
                format: "email",
                example: "karthik@example.com"
            },
            password: {
                type: "string",
                format: "password",
                example: "123456"
            }
        },
        [
            "email",
            "password"
        ]
    );

    // Projects

    addBody(
        swagger,
        "/api/v1/projects",
        "post",
        {
            project_name: {
                type: "string",
                example: "Temple Construction"
            },
            client_name: {
                type: "string",
                example: "Sri Amma Anna Temple"
            },
            location: {
                type: "string",
                example: "Vijayawada"
            },
            description: {
                type: "string",
                example: "Temple construction project"
            },
            start_date: {
                type: "string",
                format: "date",
                example: "2026-09-18"
            },
            end_date: {
                type: "string",
                format: "date",
                example: "2027-09-18"
            },
            budget: {
                type: "number",
                example: 5000000
            },
            status: {
                type: "string",
                example: "PLANNED"
            }
        },
        [
            "project_name"
        ]
    );

    addBody(
        swagger,
        "/api/v1/projects/{id}",
        "patch",
        {
            project_name: {
                type: "string",
                example: "Temple Construction Phase 1"
            },
            client_name: {
                type: "string",
                example: "Sri Amma Anna Temple"
            },
            location: {
                type: "string",
                example: "Vijayawada"
            },
            description: {
                type: "string",
                example: "Updated project description"
            },
            start_date: {
                type: "string",
                format: "date",
                example: "2026-09-18"
            },
            end_date: {
                type: "string",
                format: "date",
                example: "2027-09-18"
            },
            budget: {
                type: "number",
                example: 6000000
            },
            status: {
                type: "string",
                example: "ACTIVE"
            }
        }
    );

    addPathId(
        swagger,
        "/api/v1/projects/{id}",
        "get"
    );

    addPathId(
        swagger,
        "/api/v1/projects/{id}",
        "patch"
    );

    addPathId(
        swagger,
        "/api/v1/projects/{id}",
        "delete"
    );

    // Members

    addBody(
        swagger,
        "/api/v1/members",
        "post",
        {
            project_id: {
                type: "integer",
                example: 1
            },
            full_name: {
                type: "string",
                example: "Ramesh"
            },
            phone: {
                type: "string",
                example: "9876543210"
            },
            role: {
                type: "string",
                example: "WORKER"
            },
            joining_date: {
                type: "string",
                format: "date",
                example: "2026-09-18"
            },
            daily_wage: {
                type: "number",
                example: 800
            },
            status: {
                type: "string",
                example: "ACTIVE"
            }
        },
        [
            "project_id",
            "full_name"
        ]
    );

    addBody(
        swagger,
        "/api/v1/members/{id}",
        "patch",
        {
            full_name: {
                type: "string",
                example: "Ramesh Kumar"
            },
            phone: {
                type: "string",
                example: "9876543210"
            },
            role: {
                type: "string",
                example: "SUPERVISOR"
            },
            joining_date: {
                type: "string",
                format: "date",
                example: "2026-09-18"
            },
            daily_wage: {
                type: "number",
                example: 1000
            },
            status: {
                type: "string",
                example: "ACTIVE"
            }
        }
    );

    addPathId(
        swagger,
        "/api/v1/members/{id}",
        "get"
    );

    addPathId(
        swagger,
        "/api/v1/members/{id}",
        "patch"
    );

    addPathId(
        swagger,
        "/api/v1/members/{id}",
        "delete"
    );

    // Attendance

    addBody(
        swagger,
        "/api/v1/attendance",
        "post",
        {
            project_id: {
                type: "integer",
                example: 1
            },
            member_id: {
                type: "integer",
                example: 1
            },
            attendance_date: {
                type: "string",
                format: "date",
                example: "2026-09-18"
            },
            status: {
                type: "string",
                example: "PRESENT"
            },
            overtime_hours: {
                type: "number",
                example: 2
            },
            wage_amount: {
                type: "number",
                example: 800
            }
        },
        [
            "project_id",
            "member_id",
            "attendance_date"
        ]
    );

    addBody(
        swagger,
        "/api/v1/attendance/{id}",
        "patch",
        {
            attendance_date: {
                type: "string",
                format: "date",
                example: "2026-09-18"
            },
            status: {
                type: "string",
                example: "PRESENT"
            },
            overtime_hours: {
                type: "number",
                example: 2
            },
            wage_amount: {
                type: "number",
                example: 800
            }
        }
    );

    addPathId(
        swagger,
        "/api/v1/attendance/{id}",
        "get"
    );

    addPathId(
        swagger,
        "/api/v1/attendance/{id}",
        "patch"
    );

    addPathId(
        swagger,
        "/api/v1/attendance/{id}",
        "delete"
    );

    // Payroll

    addBody(
        swagger,
        "/api/v1/payroll",
        "post",
        {
            project_id: {
                type: "integer",
                example: 1
            },
            member_id: {
                type: "integer",
                example: 1
            },
            salary_month: {
                type: "string",
                format: "date",
                example: "2026-09-01"
            },
            total_days: {
                type: "integer",
                example: 30
            },
            present_days: {
                type: "integer",
                example: 26
            },
            half_days: {
                type: "integer",
                example: 2
            },
            absent_days: {
                type: "integer",
                example: 2
            },
            overtime_hours: {
                type: "number",
                example: 10
            },
            total_salary: {
                type: "number",
                example: 25000
            },
            payment_status: {
                type: "string",
                example: "PENDING"
            }
        },
        [
            "project_id",
            "member_id",
            "salary_month"
        ]
    );

    addBody(
        swagger,
        "/api/v1/payroll/{id}/payment",
        "patch",
        {
            payment_status: {
                type: "string",
                example: "PAID"
            }
        },
        [
            "payment_status"
        ]
    );

    addPathId(
        swagger,
        "/api/v1/payroll/{id}",
        "get"
    );

    addPathId(
        swagger,
        "/api/v1/payroll/{id}",
        "delete"
    );

    addPathId(
        swagger,
        "/api/v1/payroll/{id}/payment",
        "patch"
    );

    // Materials

    addBody(
        swagger,
        "/api/v1/materials",
        "post",
        {
            project_id: {
                type: "integer",
                example: 1
            },
            material_name: {
                type: "string",
                example: "Cement"
            },
            category: {
                type: "string",
                example: "Construction"
            },
            unit: {
                type: "string",
                example: "Bags"
            },
            quantity: {
                type: "number",
                example: 100
            },
            purchase_price: {
                type: "number",
                example: 450
            },
            supplier_name: {
                type: "string",
                example: "ABC Suppliers"
            },
            minimum_stock: {
                type: "number",
                example: 20
            }
        },
        [
            "project_id",
            "material_name",
            "unit",
            "quantity",
            "purchase_price"
        ]
    );

    addBody(
        swagger,
        "/api/v1/materials/{id}",
        "patch",
        {
            material_name: {
                type: "string",
                example: "Cement"
            },
            category: {
                type: "string",
                example: "Construction"
            },
            unit: {
                type: "string",
                example: "Bags"
            },
            quantity: {
                type: "number",
                example: 150
            },
            purchase_price: {
                type: "number",
                example: 460
            },
            supplier_name: {
                type: "string",
                example: "XYZ Suppliers"
            },
            minimum_stock: {
                type: "number",
                example: 30
            }
        }
    );

    addPathId(
        swagger,
        "/api/v1/materials/{id}",
        "get"
    );

    addPathId(
        swagger,
        "/api/v1/materials/{id}",
        "patch"
    );

    addPathId(
        swagger,
        "/api/v1/materials/{id}",
        "delete"
    );

    // Site Reports

    addBody(
        swagger,
        "/api/v1/site-reports",
        "post",
        {
            project_id: {
                type: "integer",
                example: 1
            },
            report_date: {
                type: "string",
                format: "date",
                example: "2026-09-18"
            },
            work_completed: {
                type: "string",
                example: "Foundation work completed"
            },
            workers_count: {
                type: "integer",
                example: 15
            },
            materials_used: {
                type: "string",
                example: "Cement and steel"
            },
            issues: {
                type: "string",
                example: "No major issues"
            },
            safety_notes: {
                type: "string",
                example: "Safety equipment used"
            },
            weather: {
                type: "string",
                example: "Sunny"
            },
            supervisor_notes: {
                type: "string",
                example: "Work progressing normally"
            }
        },
        [
            "project_id",
            "report_date"
        ]
    );

    addBody(
        swagger,
        "/api/v1/site-reports/{id}",
        "patch",
        {
            report_date: {
                type: "string",
                format: "date",
                example: "2026-09-18"
            },
            work_completed: {
                type: "string",
                example: "Updated foundation work"
            },
            workers_count: {
                type: "integer",
                example: 18
            },
            materials_used: {
                type: "string",
                example: "Cement, steel and sand"
            },
            issues: {
                type: "string",
                example: "No issues"
            },
            safety_notes: {
                type: "string",
                example: "All workers used helmets"
            },
            weather: {
                type: "string",
                example: "Cloudy"
            },
            supervisor_notes: {
                type: "string",
                example: "Work completed successfully"
            }
        }
    );

    addPathId(
        swagger,
        "/api/v1/site-reports/{id}",
        "get"
    );

    addPathId(
        swagger,
        "/api/v1/site-reports/{id}",
        "patch"
    );

    addPathId(
        swagger,
        "/api/v1/site-reports/{id}",
        "delete"
    );

    // Expenses

    addBody(
        swagger,
        "/api/v1/expenses",
        "post",
        {
            project_id: {
                type: "integer",
                example: 1
            },
            expense_date: {
                type: "string",
                format: "date",
                example: "2026-09-18"
            },
            category: {
                type: "string",
                example: "Materials"
            },
            description: {
                type: "string",
                example: "Cement purchase"
            },
            amount: {
                type: "number",
                example: 45000
            },
            payment_method: {
                type: "string",
                example: "CASH"
            },
            vendor_name: {
                type: "string",
                example: "ABC Suppliers"
            },
            reference_number: {
                type: "string",
                example: "EXP-001"
            }
        },
        [
            "project_id",
            "expense_date",
            "category",
            "amount"
        ]
    );

    addBody(
        swagger,
        "/api/v1/expenses/{id}",
        "patch",
        {
            expense_date: {
                type: "string",
                format: "date",
                example: "2026-09-18"
            },
            category: {
                type: "string",
                example: "Transport"
            },
            description: {
                type: "string",
                example: "Material transport"
            },
            amount: {
                type: "number",
                example: 5000
            },
            payment_method: {
                type: "string",
                example: "CASH"
            },
            vendor_name: {
                type: "string",
                example: "Transport Vendor"
            },
            reference_number: {
                type: "string",
                example: "EXP-002"
            }
        }
    );

    addPathId(
        swagger,
        "/api/v1/expenses/{id}",
        "get"
    );

    addPathId(
        swagger,
        "/api/v1/expenses/{id}",
        "patch"
    );

    addPathId(
        swagger,
        "/api/v1/expenses/{id}",
        "delete"
    );

    // Project Items / BOQ

    addBody(
        swagger,
        "/api/v1/project-items",
        "post",
        {
            project_id: {
                type: "integer",
                example: 1
            },
            item_name: {
                type: "string",
                example: "Foundation Work"
            },
            description: {
                type: "string",
                example: "Foundation excavation"
            },
            unit: {
                type: "string",
                example: "Sqft"
            },
            quantity: {
                type: "number",
                example: 1000
            },
            unit_price: {
                type: "number",
                example: 250
            }
        },
        [
            "project_id",
            "item_name",
            "unit",
            "quantity",
            "unit_price"
        ]
    );

    addBody(
        swagger,
        "/api/v1/project-items/{id}",
        "patch",
        {
            item_name: {
                type: "string",
                example: "Foundation Work Updated"
            },
            description: {
                type: "string",
                example: "Updated foundation work"
            },
            unit: {
                type: "string",
                example: "Sqft"
            },
            quantity: {
                type: "number",
                example: 1200
            },
            unit_price: {
                type: "number",
                example: 275
            }
        }
    );

    addPathId(
        swagger,
        "/api/v1/project-items/{id}",
        "get"
    );

    addPathId(
        swagger,
        "/api/v1/project-items/{id}",
        "patch"
    );

    addPathId(
        swagger,
        "/api/v1/project-items/{id}",
        "delete"
    );

    // Notifications

    addBody(
        swagger,
        "/api/v1/notifications",
        "post",
        {
            project_id: {
                type: "integer",
                nullable: true,
                example: 1
            },
            title: {
                type: "string",
                example: "Project Update"
            },
            message: {
                type: "string",
                example: "Foundation work completed"
            },
            type: {
                type: "string",
                example: "PROJECT"
            }
        },
        [
            "title",
            "message"
        ]
    );

    addPathId(
        swagger,
        "/api/v1/notifications/{id}",
        "get"
    );

    addPathId(
        swagger,
        "/api/v1/notifications/{id}/read",
        "patch"
    );

    addPathId(
        swagger,
        "/api/v1/notifications/{id}",
        "delete"
    );

    // Profile

    addBody(
        swagger,
        "/api/v1/profile",
        "patch",
        {
            full_name: {
                type: "string",
                example: "Karthik Kumar"
            },
            phone: {
                type: "string",
                example: "9876543210"
            }
        }
    );

    // Query parameters

    addQueryParameter(
        swagger,
        "/api/v1/members/project/{projectId}",
        "get",
        "projectId"
    );

    addQueryParameter(
        swagger,
        "/api/v1/attendance",
        "get",
        "project_id"
    );

    addQueryParameter(
        swagger,
        "/api/v1/payroll",
        "get",
        "project_id"
    );

    addQueryParameter(
        swagger,
        "/api/v1/materials",
        "get",
        "project_id"
    );

    addQueryParameter(
        swagger,
        "/api/v1/site-reports",
        "get",
        "project_id"
    );

    addQueryParameter(
        swagger,
        "/api/v1/expenses",
        "get",
        "project_id"
    );

    addQueryParameter(
        swagger,
        "/api/v1/project-items",
        "get",
        "project_id"
    );

    addQueryParameter(
        swagger,
        "/api/v1/documents",
        "get",
        "project_id"
    );

    addQueryParameter(
        swagger,
        "/api/v1/reports/project",
        "get",
        "project_id"
    );

    addQueryParameter(
        swagger,
        "/api/v1/reports/monthly-expenses",
        "get",
        "project_id"
    );

    addQueryParameter(
        swagger,
        "/api/v1/reports/monthly-expenses",
        "get",
        "start_date",
        "string"
    );

    addQueryParameter(
        swagger,
        "/api/v1/reports/monthly-expenses",
        "get",
        "end_date",
        "string"
    );

    fs.writeFileSync(
        outputFile,
        JSON.stringify(
            swagger,
            null,
            4
        )
    );

    console.log(
        "swagger-output.json generated successfully"
    );
};

generateSwagger().catch((error) => {
    console.error(
        "Swagger generation failed:",
        error
    );

    process.exit(1);
});