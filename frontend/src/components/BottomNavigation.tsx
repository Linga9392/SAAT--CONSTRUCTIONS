import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter, usePathname } from "expo-router";

type Props = {
    active?: "home" | "projects" | "finance" | "account";
};

export default function BottomNavigation({
    active,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const current =
        active ||
        (pathname === "/dashboard"
            ? "home"
            : pathname === "/projects"
            ? "projects"
            : pathname === "/expenses"
            ? "finance"
            : "account");

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.item}
                onPress={() => router.push("/dashboard")}
            >
                <Text
                    style={[
                        styles.icon,
                        current === "home" && styles.activeIcon,
                    ]}
                >
                    🏠
                </Text>
                <Text
                    style={[
                        styles.label,
                        current === "home" && styles.activeLabel,
                    ]}
                >
                    Home
                </Text>
            </Pressable>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/projects")}
            >
                <Text
                    style={[
                        styles.icon,
                        current === "projects" && styles.activeIcon,
                    ]}
                >
                    🏗️
                </Text>
                <Text
                    style={[
                        styles.label,
                        current === "projects" && styles.activeLabel,
                    ]}
                >
                    Projects
                </Text>
            </Pressable>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/expenses")}
            >
                <Text
                    style={[
                        styles.icon,
                        current === "finance" && styles.activeIcon,
                    ]}
                >
                    💰
                </Text>
                <Text
                    style={[
                        styles.label,
                        current === "finance" && styles.activeLabel,
                    ]}
                >
                    Finance
                </Text>
            </Pressable>

            <Pressable
                style={styles.item}
                onPress={() => router.push("/profile")}
            >
                <Text
                    style={[
                        styles.icon,
                        current === "account" && styles.activeIcon,
                    ]}
                >
                    👤
                </Text>
                <Text
                    style={[
                        styles.label,
                        current === "account" && styles.activeLabel,
                    ]}
                >
                    Account
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 72,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#F1D6D0",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 8,
    },

    item: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
    },

    icon: {
        fontSize: 21,
        opacity: 0.55,
    },

    activeIcon: {
        opacity: 1,
    },

    label: {
        fontSize: 12,
        fontWeight: "600",
        color: "#9A8E88",
    },

    activeLabel: {
        color: "#C92A1D",
        fontWeight: "800",
    },
});