import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL =
    "https://saat-constructions.onrender.com/api/v1";

const request = async (
    endpoint: string,
    options: RequestInit = {}
) => {
    try {
        const token =
            await AsyncStorage.getItem("auth_token");

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(options.headers as Record<string, string> || {}),
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        console.log(
            "API REQUEST:",
            `${API_BASE_URL}${endpoint}`
        );

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers,
            }
        );

        const text = await response.text();

        console.log(
            "API STATUS:",
            response.status
        );

        console.log(
            "API RESPONSE:",
            text
        );

        let data;

        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            throw new Error(
                `Server returned invalid response (${response.status})`
            );
        }

        if (response.status === 401) {
            await AsyncStorage.removeItem("auth_token");
            await AsyncStorage.removeItem("user");
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                    data.error ||
                    `Request failed with status ${response.status}`
            );
        }

        return data;
    } catch (error) {
        console.error(
            "API ERROR:",
            error
        );

        if (error instanceof TypeError) {
            throw new Error(
                "Cannot connect to SAAT Construction backend. Please check your internet connection and try again."
            );
        }

        throw error;
    }
};

export const loginUser = async (
    email: string,
    password: string
) => {
    const response = await request(
        "/auth/login",
        {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
        }
    );

    console.log(
        "LOGIN RESPONSE OBJECT:",
        response
    );

    const data = response?.data;

    if (!data?.token) {
        throw new Error(
            "Login successful, but JWT token was not received."
        );
    }

    await AsyncStorage.setItem(
        "auth_token",
        data.token
    );

    if (data?.user) {
        await AsyncStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );
    }

    const savedToken =
        await AsyncStorage.getItem(
            "auth_token"
        );

    console.log(
        "TOKEN SAVED:",
        !!savedToken
    );

    return response;
};

export const registerUser = async (
    full_name: string,
    email: string,
    password: string,
    phone: string
) => {
    return await request(
        "/auth/register",
        {
            method: "POST",
            body: JSON.stringify({
                full_name,
                email,
                password,
                phone,
            }),
        }
    );
};

export const getAuthToken = async () => {
    return await AsyncStorage.getItem(
        "auth_token"
    );
};

export const getStoredUser = async () => {
    const user =
        await AsyncStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;
};

export const logoutUser = async () => {
    await AsyncStorage.removeItem(
        "auth_token"
    );

    await AsyncStorage.removeItem(
        "user"
    );
};