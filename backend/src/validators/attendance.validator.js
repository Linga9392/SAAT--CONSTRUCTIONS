import Joi from "joi";

export const createAttendanceSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required(),

    member_id: Joi.number()
        .integer()
        .positive()
        .required(),

    attendance_date: Joi.date()
        .iso()
        .required(),

    status: Joi.string()
        .valid(
            "PRESENT",
            "ABSENT",
            "HALF_DAY"
        )
        .default("PRESENT"),

    overtime_hours: Joi.number()
        .min(0)
        .precision(2)
        .default(0),

    wage_amount: Joi.number()
        .min(0)
        .precision(2)
        .allow(null)
});

export const updateAttendanceSchema = Joi.object({
    attendance_date: Joi.date()
        .iso(),

    status: Joi.string()
        .valid(
            "PRESENT",
            "ABSENT",
            "HALF_DAY"
        ),

    overtime_hours: Joi.number()
        .min(0)
        .precision(2),

    wage_amount: Joi.number()
        .min(0)
        .precision(2)
        .allow(null)
})
.min(1);

export const attendanceProjectSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required()
});
