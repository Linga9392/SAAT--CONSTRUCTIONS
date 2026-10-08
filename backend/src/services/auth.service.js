import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    findUserByEmail,
    findUserById,
    createUser
} from "../repositories/auth.repository.js";

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

export const registerUser = async ({
    full_name,
    email,
    password,
    phone
}) => {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await createUser({
        full_name,
        email,
        password_hash,
        phone
    });

    const token = generateToken(user);

    return {
        token,
        user
    };
};

export const loginUser = async ({
    email,
    password
}) => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    if (user.status !== "ACTIVE") {
        throw new Error("User account is inactive");
    }

    const passwordMatched = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatched) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user);

    const safeUser = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at
    };

    return {
        token,
        user: safeUser
    };
};

export const getCurrentUser = async (id) => {
    const user = await findUserById(id);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};