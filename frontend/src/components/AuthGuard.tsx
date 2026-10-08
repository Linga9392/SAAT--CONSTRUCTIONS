import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
    children: React.ReactNode;
};

export default function AuthGuard({
    children,
}: Props) {
    const [checking, setChecking] = useState(true);
    const [authenticated, setAuthenticated] =
        useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const token =
                    await AsyncStorage.getItem(
                        "auth_token"
                    );

                if (!token) {
                    router.replace("/");
                    return;
                }

                setAuthenticated(true);
            } catch {
                router.replace("/");
            } finally {
                setChecking(false);
            }
        };

        checkAuthentication();
    }, []);

    if (checking) {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    size="large"
                    color="#C92A1D"
                />
            </View>
        );
    }

    if (!authenticated) {
        return null;
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF7F3",
        alignItems: "center",
        justifyContent: "center",
    },
});