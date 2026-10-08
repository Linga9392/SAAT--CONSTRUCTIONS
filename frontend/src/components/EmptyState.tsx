import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
    icon?: string;
    title?: string;
    message?: string;
};

export default function EmptyState({
    icon = "📋",
    title = "No Records Found",
    message = "There are no records available at the moment.",
}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>
                    {icon}
                </Text>
            </View>

            <Text style={styles.title}>
                {title}
            </Text>

            <Text style={styles.message}>
                {message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        paddingHorizontal: 20,
        paddingVertical: 35,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        marginBottom: 20,
    },

    iconContainer: {
        width: 68,
        height: 68,
        borderRadius: 20,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },

    icon: {
        fontSize: 30,
    },

    title: {
        fontSize: 17,
        fontWeight: "800",
        color: "#2B2522",
        textAlign: "center",
        marginBottom: 6,
    },

    message: {
        fontSize: 13,
        lineHeight: 20,
        fontWeight: "500",
        color: "#9A8E88",
        textAlign: "center",
        maxWidth: 280,
    },
});