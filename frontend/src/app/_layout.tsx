import React from "react";
import { Stack } from "expo-router";
import AuthGuard from "../components/AuthGuard";

export default function RootLayout() {
    return (
        <AuthGuard>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: "slide_from_right",
                    contentStyle: {
                        backgroundColor: "#FAF7F3",
                    },
                }}
            />
        </AuthGuard>
    );
}