import React from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useRouter } from "expo-router";

type Props = {
    title?: string;
    showBack?: boolean;
    showMenu?: boolean;
    showNotification?: boolean;
};

export default function AppHeader({
    title = "SAAT Construction",
    showBack = false,
    showMenu = false,
    showNotification = true,
}: Props) {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <View style={styles.leftSection}>
                {showBack && (
                    <Pressable
                        style={styles.iconButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.icon}>‹</Text>
                    </Pressable>
                )}

                {showMenu && (
                    <Pressable
                        style={styles.iconButton}
                        onPress={() => router.push("/dashboard")}
                    >
                        <Text style={styles.menuIcon}>☰</Text>
                    </Pressable>
                )}

                <View>
                    <Text style={styles.title}>
                        {title}
                    </Text>
                    <Text style={styles.subtitle}>
                        Temple Construction
                    </Text>
                </View>
            </View>

            {showNotification && (
                <Pressable
                    style={styles.notificationButton}
                    onPress={() =>
                        router.push("/notifications")
                    }
                >
                    <Text style={styles.notificationIcon}>
                        🔔
                    </Text>
                    <View style={styles.notificationDot} />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        minHeight: 76,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F1D6D0",
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    iconButton: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    icon: {
        fontSize: 34,
        lineHeight: 34,
        color: "#C92A1D",
        fontWeight: "500",
    },

    menuIcon: {
        fontSize: 22,
        color: "#C92A1D",
        fontWeight: "700",
    },

    title: {
        fontSize: 18,
        fontWeight: "800",
        color: "#2B2522",
    },

    subtitle: {
        fontSize: 11,
        fontWeight: "600",
        color: "#9A8E88",
        marginTop: 2,
    },

    notificationButton: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    notificationIcon: {
        fontSize: 20,
    },

    notificationDot: {
        position: "absolute",
        top: 7,
        right: 8,
        width: 7,
        height: 7,
        borderRadius: 10,
        backgroundColor: "#C92A1D",
    },
});