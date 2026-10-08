import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
    message?: string;
};

export default function LoadingScreen({
    message = "Loading...",
}: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoIcon}>
                    🏗️
                </Text>
            </View>

            <Text style={styles.title}>
                SAAT Construction
            </Text>

            <Text style={styles.subtitle}>
                Sri Amma Anna Temple Construction
            </Text>

            <ActivityIndicator
                size="large"
                color="#C92A1D"
                style={styles.loader}
            />

            <Text style={styles.message}>
                {message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF7F3",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },

    logoContainer: {
        width: 76,
        height: 76,
        borderRadius: 22,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },

    logoIcon: {
        fontSize: 36,
    },

    title: {
        fontSize: 23,
        fontWeight: "900",
        color: "#2B2522",
        textAlign: "center",
    },

    subtitle: {
        fontSize: 12,
        fontWeight: "600",
        color: "#9A8E88",
        textAlign: "center",
        marginTop: 5,
    },

    loader: {
        marginTop: 28,
    },

    message: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6F625D",
        marginTop: 12,
    },
});