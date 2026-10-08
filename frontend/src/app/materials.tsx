import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import EmptyState from "../components/EmptyState";

const API_BASE_URL = "http://localhost:5000/api/v1";

type Material = {
    id: number;
    material_name: string;
    category?: string | null;
    unit?: string | null;
    quantity?: number | string | null;
    purchase_price?: number | string | null;
    supplier_name?: string | null;
    minimum_stock?: number | string | null;
};

export default function MaterialsScreen() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    const loadMaterials = async () => {
        try {
            setLoading(true);

            const token =
                await AsyncStorage.getItem("auth_token");

            if (!token) {
                throw new Error(
                    "Authorization token not found"
                );
            }

            const response = await fetch(
                `${API_BASE_URL}/materials`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to load materials"
                );
            }

            setMaterials(
                Array.isArray(data.data)
                    ? data.data
                    : []
            );
        } catch (error) {
            Alert.alert(
                "Materials Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load materials"
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadMaterials();
        }, [])
    );

    const getStockStatus = (
        quantity: number | string | null | undefined,
        minimumStock:
            | number
            | string
            | null
            | undefined
    ) => {
        const current = Number(quantity || 0);
        const minimum = Number(minimumStock || 0);

        if (current <= minimum) {
            return {
                label: "LOW STOCK",
                badge: styles.lowStockBadge,
                text: styles.lowStockText,
            };
        }

        return {
            label: "IN STOCK",
            badge: styles.inStockBadge,
            text: styles.inStockText,
        };
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color="#C92A1D"
                />

                <Text style={styles.loadingText}>
                    Loading materials...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader
                title="SAAT Construction"
                showBack
                showNotification
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.pageHeader}>
                    <View style={styles.titleBox}>
                        <Text style={styles.title}>
                            Materials
                        </Text>

                        <Text style={styles.subtitle}>
                            Manage construction materials
                        </Text>
                    </View>

                    <View style={styles.countCircle}>
                        <Text style={styles.countText}>
                            {materials.length}
                        </Text>

                        <Text style={styles.countLabel}>
                            Materials
                        </Text>
                    </View>
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryIcon}>
                        <Text style={styles.summaryIconText}>
                            🧱
                        </Text>
                    </View>

                    <View style={styles.summaryTextBox}>
                        <Text style={styles.summaryTitle}>
                            Material Inventory
                        </Text>

                        <Text style={styles.summarySubtitle}>
                            Current construction material stock
                        </Text>
                    </View>

                    <View style={styles.summaryCount}>
                        <Text style={styles.summaryCountText}>
                            {materials.length}
                        </Text>
                    </View>
                </View>

                {materials.length === 0 ? (
                    <EmptyState
                        icon="🧱"
                        title="No Materials Found"
                        message="Construction materials will appear here once they are added."
                    />
                ) : (
                    materials.map((item) => {
                        const stockStatus =
                            getStockStatus(
                                item.quantity,
                                item.minimum_stock
                            );

                        return (
                            <View
                                key={item.id}
                                style={styles.materialCard}
                            >
                                <View style={styles.cardHeader}>
                                    <View
                                        style={
                                            styles.materialIconCircle
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.materialIcon
                                            }
                                        >
                                            🧱
                                        </Text>
                                    </View>

                                    <View
                                        style={
                                            styles.materialInfo
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.materialName
                                            }
                                            numberOfLines={2}
                                        >
                                            {
                                                item.material_name
                                            }
                                        </Text>

                                        <Text
                                            style={
                                                styles.category
                                            }
                                        >
                                            {item.category ||
                                                "General Material"}
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.stockBadge,
                                            stockStatus.badge,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.stockBadgeText,
                                                stockStatus.text,
                                            ]}
                                        >
                                            {
                                                stockStatus.label
                                            }
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={
                                        styles.cardLine
                                    }
                                />

                                <View style={styles.infoRow}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        📦 Quantity
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {item.quantity || 0}{" "}
                                        {item.unit || ""}
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        💰 Purchase Price
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        ₹
                                        {Number(
                                            item.purchase_price || 0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        🏭 Supplier
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {item.supplier_name ||
                                            "-"}
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        ⚠️ Minimum Stock
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {item.minimum_stock || 0}{" "}
                                        {item.unit || ""}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                )}

                <View style={styles.bottomSpace} />
            </ScrollView>

            <BottomNavigation active="home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF7F3",
    },

    content: {
        paddingBottom: 105,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAF7F3",
    },

    loadingText: {
        marginTop: 10,
        fontSize: 15,
        fontWeight: "600",
        color: "#6F625D",
    },

    pageHeader: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    titleBox: {
        flex: 1,
        paddingRight: 15,
    },

    title: {
        fontSize: 28,
        fontWeight: "900",
        color: "#2B2522",
    },

    subtitle: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: "500",
        color: "#6F625D",
    },

    countCircle: {
        minWidth: 62,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 14,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
    },

    countText: {
        fontSize: 20,
        fontWeight: "900",
        color: "#C92A1D",
    },

    countLabel: {
        marginTop: 1,
        fontSize: 9,
        fontWeight: "700",
        color: "#A82016",
    },

    summaryCard: {
        marginHorizontal: 18,
        marginBottom: 16,
        padding: 15,
        borderRadius: 18,
        backgroundColor: "#FFF8F5",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        flexDirection: "row",
        alignItems: "center",
    },

    summaryIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    summaryIconText: {
        fontSize: 22,
    },

    summaryTextBox: {
        flex: 1,
        marginLeft: 12,
    },

    summaryTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: "#2B2522",
    },

    summarySubtitle: {
        marginTop: 3,
        fontSize: 11,
        fontWeight: "500",
        color: "#9A8E88",
    },

    summaryCount: {
        minWidth: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#F1D6D0",
    },

    summaryCountText: {
        fontSize: 14,
        fontWeight: "900",
        color: "#C92A1D",
    },

    materialCard: {
        marginHorizontal: 18,
        marginBottom: 14,
        padding: 18,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.07,
        shadowRadius: 5,
        elevation: 3,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    materialIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "#FDE8E5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    materialIcon: {
        fontSize: 23,
    },

    materialInfo: {
        flex: 1,
    },

    materialName: {
        fontSize: 17,
        fontWeight: "900",
        color: "#2B2522",
    },

    category: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "600",
        color: "#9A8E88",
    },

    stockBadge: {
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 10,
    },

    stockBadgeText: {
        fontSize: 9,
        fontWeight: "900",
    },

    inStockBadge: {
        backgroundColor: "#E8F5E9",
    },

    inStockText: {
        color: "#2E7D32",
    },

    lowStockBadge: {
        backgroundColor: "#FFEBEE",
    },

    lowStockText: {
        color: "#C62828",
    },

    cardLine: {
        height: 1,
        backgroundColor: "#F1D6D0",
        marginVertical: 15,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 7,
    },

    infoLabel: {
        fontSize: 13,
        fontWeight: "500",
        color: "#6F625D",
    },

    infoValue: {
        maxWidth: "55%",
        fontSize: 13,
        fontWeight: "800",
        color: "#2B2522",
        textAlign: "right",
    },

    bottomSpace: {
        height: 20,
    },
});