import {
    registerUser,
    loginUser,
    getCurrentUser
} from "../services/auth.service.js";

import {
    registerSchema,
    loginSchema
} from "../validators/auth.validator.js";

export const register = async (req, res) => {
    const { error, value } = registerSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const {
        full_name,
        email,
        password,
        phone
    } = value;

    const result = await registerUser({
        full_name,
        email,
        password,
        phone
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result
    });
};

export const login = async (req, res) => {
    const { error, value } = loginSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const {
        email,
        password
    } = value;

    const result = await loginUser({
        email,
        password
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: result
    });
};

export const me = async (req, res) => {
    const user = await getCurrentUser(req.user.id);

    res.status(200).json({
        success: true,
        data: {
            user
        }
    });
};

