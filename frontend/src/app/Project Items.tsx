import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import EmptyState from "../components/EmptyState";

const API_BASE_URL = "http://localhost:5000/api/v1";

type BOQItem = {
    id: number;
    project_id: number;
    item_name: string;
    description: string;
    unit: string;
    quantity: number | string;
    unit_price: number | string;
    total_amount: number | string;
};

export default function BOQScreen() {
    const [items, setItems] = useState<BOQItem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadItems = async () => {
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
                `${API_BASE_URL}/project-items`,
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
                        "Failed to load BOQ items"
                );
            }

            setItems(
                Array.isArray(data.data)
                    ? data.data
                    : []
            );
        } catch (error) {
            Alert.alert(
                "BOQ Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load BOQ items"
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadItems();
        }, [])
    );

    const totalEstimate = items.reduce(
        (total, item) =>
            total + Number(item.total_amount || 0),
        0
    );

    const formatAmount = (
        amount: number | string
    ) => {
        return Number(amount || 0).toLocaleString(
            "en-IN"
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color="#C92A1D"
                />

                <Text style={styles.loadingText}>
                    Loading BOQ items...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader
                title="BOQ / Project Items"
                showMenu={true}
                showNotification={true}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.pageHeader}>
                    <View style={styles.pageHeaderInfo}>
                        <Text style={styles.title}>
                            BOQ / Project Items
                        </Text>

                        <Text style={styles.subtitle}>
                            Manage project items and cost estimates
                        </Text>
                    </View>

                    <View style={styles.boqIconCircle}>
                        <Text style={styles.boqIcon}>
                            📋
                        </Text>
                    </View>
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryIconCircle}>
                        <Text style={styles.summaryIcon}>
                            ₹
                        </Text>
                    </View>

                    <View style={styles.summaryInfo}>
                        <Text style={styles.summaryLabel}>
                            Total Estimate
                        </Text>

                        <Text style={styles.summaryAmount}>
                            ₹{formatAmount(totalEstimate)}
                        </Text>
                    </View>

                    <View style={styles.summaryCount}>
                        <Text style={styles.summaryCountNumber}>
                            {items.length}
                        </Text>

                        <Text style={styles.summaryCountLabel}>
                            Items
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionInfo}>
                        <Text style={styles.sectionTitle}>
                            Project Items
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Bill of quantity and cost details
                        </Text>
                    </View>

                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>
                            {items.length}
                        </Text>
                    </View>
                </View>

                {items.length === 0 ? (
                    <EmptyState
                        icon="📋"
                        title="No BOQ Items Found"
                        message="Project items and cost estimates will appear here."
                    />
                ) : (
                    items.map((item) => (
                        <View
                            key={item.id}
                            style={styles.itemCard}
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.itemIconCircle}>
                                    <Text style={styles.itemIcon}>
                                        🧱
                                    </Text>
                                </View>

                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>
                                        {item.item_name}
                                    </Text>

                                    <View
                                        style={
                                            styles.projectBadge
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.projectBadgeText
                                            }
                                        >
                                            Project #
                                            {item.project_id}
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={
                                        styles.headerAmountContainer
                                    }
                                >
                                    <Text
                                        style={
                                            styles.headerAmount
                                        }
                                    >
                                        ₹
                                        {formatAmount(
                                            item.total_amount
                                        )}
                                    </Text>

                                    <Text
                                        style={
                                            styles.headerAmountLabel
                                        }
                                    >
                                        Total
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.cardLine} />

                            <View style={styles.descriptionBox}>
                                <Text
                                    style={
                                        styles.descriptionLabel
                                    }
                                >
                                    Description
                                </Text>

                                <Text
                                    style={
                                        styles.descriptionText
                                    }
                                >
                                    {item.description || "-"}
                                </Text>
                            </View>

                            <View style={styles.infoGrid}>
                                <View style={styles.gridItem}>
                                    <Text style={styles.gridLabel}>
                                        Unit
                                    </Text>

                                    <Text style={styles.gridValue}>
                                        {item.unit || "-"}
                                    </Text>
                                </View>

                                <View style={styles.gridItem}>
                                    <Text style={styles.gridLabel}>
                                        Quantity
                                    </Text>

                                    <Text style={styles.gridValue}>
                                        {item.quantity}
                                    </Text>
                                </View>

                                <View style={styles.gridItem}>
                                    <Text style={styles.gridLabel}>
                                        Unit Price
                                    </Text>

                                    <Text style={styles.gridValue}>
                                        ₹
                                        {formatAmount(
                                            item.unit_price
                                        )}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.totalRow}>
                                <View>
                                    <Text
                                        style={
                                            styles.totalLabel
                                        }
                                    >
                                        Total Amount
                                    </Text>

                                    <Text
                                        style={
                                            styles.totalSubText
                                        }
                                    >
                                        Quantity × Unit Price
                                    </Text>
                                </View>

                                <Text
                                    style={
                                        styles.totalValue
                                    }
                                >
                                    ₹
                                    {formatAmount(
                                        item.total_amount
                                    )}
                                </Text>
                            </View>
                        </View>
                    ))
                )}

                <View style={styles.footerCard}>
                    <Text style={styles.footerTitle}>
                        SRI AMMA ANNA TEMPLE
                    </Text>

                    <Text style={styles.footerSubTitle}>
                        CONSTRUCTION
                    </Text>

                    <Text style={styles.footerSince}>
                        Since 1974
                    </Text>
                </View>

                <View style={styles.bottomSpace} />
            </ScrollView>

            <BottomNavigation active="finance" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF7F3",
    },

    content: {
        paddingBottom: 100,
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAF7F3",
    },

    loadingText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "600",
        color: "#6F625D",
    },

    pageHeader: {
        paddingHorizontal: 18,
        paddingTop: 22,
        paddingBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    pageHeaderInfo: {
        flex: 1,
        paddingRight: 10,
    },

    title: {
        fontSize: 27,
        fontWeight: "900",
        color: "#2B2522",
    },

    subtitle: {
        marginTop: 5,
        fontSize: 13,
        lineHeight: 19,
        fontWeight: "500",
        color: "#6F625D",
    },

    boqIconCircle: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    boqIcon: {
        fontSize: 25,
    },

    summaryCard: {
        marginHorizontal: 18,
        marginBottom: 18,
        padding: 18,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },

    summaryIconCircle: {
        width: 54,
        height: 54,
        borderRadius: 17,
        backgroundColor: "#C92A1D",
        alignItems: "center",
        justifyContent: "center",
    },

    summaryIcon: {
        fontSize: 23,
        fontWeight: "900",
        color: "#FFFFFF",
    },

    summaryInfo: {
        flex: 1,
        marginLeft: 13,
    },

    summaryLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#6F625D",
    },

    summaryAmount: {
        marginTop: 4,
        fontSize: 22,
        fontWeight: "900",
        color: "#C92A1D",
    },

    summaryCount: {
        alignItems: "center",
        paddingLeft: 14,
        borderLeftWidth: 1,
        borderLeftColor: "#F1D6D0",
    },

    summaryCountNumber: {
        fontSize: 21,
        fontWeight: "900",
        color: "#2B2522",
    },

    summaryCountLabel: {
        marginTop: 2,
        fontSize: 10,
        fontWeight: "600",
        color: "#9A8E88",
    },

    sectionHeader: {
        marginHorizontal: 18,
        marginBottom: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    sectionInfo: {
        flex: 1,
        paddingRight: 10,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "900",
        color: "#2B2522",
    },

    sectionSubtitle: {
        marginTop: 3,
        fontSize: 12,
        color: "#9A8E88",
    },

    countBadge: {
        minWidth: 38,
        height: 38,
        paddingHorizontal: 9,
        borderRadius: 19,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    countBadgeText: {
        fontSize: 13,
        fontWeight: "900",
        color: "#C92A1D",
    },

    itemCard: {
        marginHorizontal: 18,
        marginBottom: 14,
        padding: 18,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    itemIconCircle: {
        width: 52,
        height: 52,
        borderRadius: 17,
        backgroundColor: "#FFF1ED",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    itemIcon: {
        fontSize: 24,
    },

    itemInfo: {
        flex: 1,
    },

    itemName: {
        fontSize: 17,
        fontWeight: "900",
        color: "#2B2522",
    },

    projectBadge: {
        alignSelf: "flex-start",
        marginTop: 5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "#FAF7F3",
    },

    projectBadgeText: {
        fontSize: 10,
        fontWeight: "800",
        color: "#6F625D",
    },

    headerAmountContainer: {
        alignItems: "flex-end",
        marginLeft: 8,
    },

    headerAmount: {
        fontSize: 16,
        fontWeight: "900",
        color: "#C92A1D",
    },

    headerAmountLabel: {
        marginTop: 2,
        fontSize: 9,
        fontWeight: "700",
        color: "#9A8E88",
    },

    cardLine: {
        height: 1,
        backgroundColor: "#F1EEEB",
        marginVertical: 15,
    },

    descriptionBox: {
        padding: 13,
        backgroundColor: "#FAF7F3",
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: "#C92A1D",
        marginBottom: 8,
    },

    descriptionLabel: {
        fontSize: 11,
        fontWeight: "800",
        color: "#C92A1D",
        marginBottom: 5,
    },

    descriptionText: {
        fontSize: 13,
        lineHeight: 19,
        color: "#4F4540",
    },

    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    gridItem: {
        width: "33.33%",
        paddingVertical: 10,
    },

    gridLabel: {
        fontSize: 10,
        fontWeight: "600",
        color: "#9A8E88",
        marginBottom: 4,
    },

    gridValue: {
        fontSize: 14,
        fontWeight: "900",
        color: "#2B2522",
    },

    totalRow: {
        marginTop: 8,
        paddingTop: 13,
        borderTopWidth: 1,
        borderTopColor: "#F1EEEB",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    totalLabel: {
        fontSize: 12,
        fontWeight: "800",
        color: "#6F625D",
    },

    totalSubText: {
        marginTop: 2,
        fontSize: 10,
        color: "#9A8E88",
    },

    totalValue: {
        fontSize: 19,
        fontWeight: "900",
        color: "#C92A1D",
    },

    footerCard: {
        marginHorizontal: 18,
        marginTop: 10,
        paddingVertical: 20,
        alignItems: "center",
    },

    footerTitle: {
        fontSize: 11,
        fontWeight: "900",
        color: "#2B2522",
        letterSpacing: 1,
    },

    footerSubTitle: {
        marginTop: 3,
        fontSize: 10,
        fontWeight: "800",
        color: "#C92A1D",
        letterSpacing: 1,
    },

    footerSince: {
        marginTop: 5,
        fontSize: 10,
        fontWeight: "600",
        color: "#9A8E88",
    },

    bottomSpace: {
        height: 20,
    },
});