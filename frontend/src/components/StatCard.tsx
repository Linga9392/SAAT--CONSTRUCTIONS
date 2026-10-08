import React from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

type Props = {
    title: string;
    value: string | number;
    icon: string;
    backgroundColor?: string;
    iconBackgroundColor?: string;
    valueColor?: string;
};

export default function StatCard({
    title,
    value,
    icon,
    backgroundColor = "#FFFFFF",
    iconBackgroundColor = "#FDE8E5",
    valueColor = "#2B2522",
}: Props) {
    return (
        <View
            style={[
                styles.card,
                { backgroundColor },
            ]}
        >
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor:
                            iconBackgroundColor,
                    },
                ]}
            >
                <Text style={styles.icon}>
                    {icon}
                </Text>
            </View>

            <Text style={styles.title}>
                {title}
            </Text>

            <Text
                style={[
                    styles.value,
                    { color: valueColor },
                ]}
            >
                {value}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "48%",
        minHeight: 125,
        borderRadius: 18,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 2,
    },

    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    icon: {
        fontSize: 20,
    },

    title: {
        fontSize: 12,
        fontWeight: "600",
        color: "#6F625D",
        marginBottom: 4,
    },

    value: {
        fontSize: 24,
        fontWeight: "800",
    },
});