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

type Expense = {
    id: number;
    project_id: number;
    expense_date: string;
    category: string;
    description: string;
    amount: number | string;
    payment_method: string;
    vendor_name: string;
    reference_number: string;
};

export default function ExpensesScreen() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    const loadExpenses = async () => {
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
                `${API_BASE_URL}/expenses`,
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
                        "Failed to load expenses"
                );
            }

            setExpenses(
                Array.isArray(data.data)
                    ? data.data
                    : []
            );
        } catch (error) {
            Alert.alert(
                "Expenses Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load expenses"
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadExpenses();
        }, [])
    );

    const totalExpenses = expenses.reduce(
        (total, expense) =>
            total + Number(expense.amount || 0),
        0
    );

    const formatAmount = (
        amount: number | string
    ) => {
        return Number(amount || 0).toLocaleString(
            "en-IN"
        );
    };

    const formatDate = (date: string) => {
        if (!date) {
            return "-";
        }

        return date.slice(0, 10);
    };

    const projectCount = new Set(
        expenses.map(
            (expense) => expense.project_id
        )
    ).size;

    const vendorCount = new Set(
        expenses
            .map(
                (expense) =>
                    expense.vendor_name
            )
            .filter(Boolean)
    ).size;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#C92A1D"
                />

                <Text style={styles.loadingText}>
                    Loading expenses...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader
                title="Finance"
                showMenu={true}
                showNotification={true}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.pageHeader}>
                    <View style={styles.headerInfo}>
                        <Text style={styles.title}>
                            Finance
                        </Text>

                        <Text style={styles.subtitle}>
                            Track project expenses
                        </Text>
                    </View>

                    <View style={styles.financeIcon}>
                        <Text style={styles.financeIconText}>
                            ₹
                        </Text>
                    </View>
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryIcon}>
                        <Text style={styles.summaryIconText}>
                            ₹
                        </Text>
                    </View>

                    <View style={styles.summaryInfo}>
                        <Text style={styles.summaryLabel}>
                            Total Expenses
                        </Text>

                        <Text style={styles.summaryAmount}>
                            ₹{formatAmount(totalExpenses)}
                        </Text>
                    </View>

                    <View style={styles.summaryCount}>
                        <Text
                            style={
                                styles.summaryCountNumber
                            }
                        >
                            {expenses.length}
                        </Text>

                        <Text
                            style={
                                styles.summaryCountLabel
                            }
                        >
                            Records
                        </Text>
                    </View>
                </View>

                <View style={styles.quickStats}>
                    <View style={styles.quickStatCard}>
                        <View
                            style={
                                styles.quickIconContainer
                            }
                        >
                            <Text
                                style={
                                    styles.quickIcon
                                }
                            >
                                📊
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.quickStatNumber
                            }
                        >
                            {expenses.length}
                        </Text>

                        <Text
                            style={
                                styles.quickStatLabel
                            }
                        >
                            Expenses
                        </Text>
                    </View>

                    <View style={styles.quickStatCard}>
                        <View
                            style={
                                styles.quickIconContainer
                            }
                        >
                            <Text
                                style={
                                    styles.quickIcon
                                }
                            >
                                🏗️
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.quickStatNumber
                            }
                        >
                            {projectCount}
                        </Text>

                        <Text
                            style={
                                styles.quickStatLabel
                            }
                        >
                            Projects
                        </Text>
                    </View>

                    <View style={styles.quickStatCard}>
                        <View
                            style={
                                styles.quickIconContainer
                            }
                        >
                            <Text
                                style={
                                    styles.quickIcon
                                }
                            >
                                🏪
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.quickStatNumber
                            }
                        >
                            {vendorCount}
                        </Text>

                        <Text
                            style={
                                styles.quickStatLabel
                            }
                        >
                            Vendors
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            Expense Records
                        </Text>

                        <Text
                            style={
                                styles.sectionSubtitle
                            }
                        >
                            Recent project expenses
                        </Text>
                    </View>

                    <View style={styles.countBadge}>
                        <Text
                            style={
                                styles.countBadgeText
                            }
                        >
                            {expenses.length}
                        </Text>
                    </View>
                </View>

                {expenses.length === 0 ? (
                    <EmptyState
                        icon="💰"
                        title="No Expenses Found"
                        message="Project expenses will appear here once they are added."
                    />
                ) : (
                    expenses.map((expense) => (
                        <View
                            key={expense.id}
                            style={styles.expenseCard}
                        >
                            <View
                                style={
                                    styles.cardHeader
                                }
                            >
                                <View
                                    style={
                                        styles.expenseIconContainer
                                    }
                                >
                                    <Text
                                        style={
                                            styles.expenseIcon
                                        }
                                    >
                                        💰
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.expenseInfo
                                    }
                                >
                                    <Text
                                        style={
                                            styles.category
                                        }
                                    >
                                        {expense.category ||
                                            "Expense"}
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
                                            {
                                                expense.project_id
                                            }
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={
                                        styles.amountContainer
                                    }
                                >
                                    <Text
                                        style={
                                            styles.amount
                                        }
                                    >
                                        ₹
                                        {formatAmount(
                                            expense.amount
                                        )}
                                    </Text>

                                    <Text
                                        style={
                                            styles.amountLabel
                                        }
                                    >
                                        Amount
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={styles.divider}
                            />

                            <View style={styles.infoRow}>
                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    📅 Date
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {formatDate(
                                        expense.expense_date
                                    )}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.descriptionBox
                                }
                            >
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
                                    {expense.description ||
                                        "-"}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    💳 Payment
                                </Text>

                                <View
                                    style={
                                        styles.paymentBadge
                                    }
                                >
                                    <Text
                                        style={
                                            styles.paymentBadgeText
                                        }
                                    >
                                        {expense.payment_method ||
                                            "-"}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    🏪 Vendor
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {expense.vendor_name ||
                                        "-"}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    🔖 Reference
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {expense.reference_number ||
                                        "-"}
                                </Text>
                            </View>
                        </View>
                    ))
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>
                        SRI AMMA ANNA TEMPLE
                    </Text>

                    <Text style={styles.footerSubtitle}>
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

    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FAF7F3",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: "600",
        color: "#6F625D",
    },

    content: {
        paddingHorizontal: 16,
        paddingBottom: 105,
    },

    pageHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 22,
        paddingBottom: 16,
    },

    headerInfo: {
        flex: 1,
        paddingRight: 12,
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
        color: "#9A8E88",
    },

    financeIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#FDE8E5",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        alignItems: "center",
        justifyContent: "center",
    },

    financeIconText: {
        fontSize: 24,
        fontWeight: "900",
        color: "#C92A1D",
    },

    summaryCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },

    summaryIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "#C92A1D",
        alignItems: "center",
        justifyContent: "center",
    },

    summaryIconText: {
        fontSize: 23,
        fontWeight: "900",
        color: "#FFFFFF",
    },

    summaryInfo: {
        flex: 1,
        marginLeft: 12,
    },

    summaryLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#9A8E88",
    },

    summaryAmount: {
        marginTop: 3,
        fontSize: 23,
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
        fontSize: 20,
        fontWeight: "900",
        color: "#2B2522",
    },

    summaryCountLabel: {
        marginTop: 2,
        fontSize: 10,
        fontWeight: "600",
        color: "#9A8E88",
    },

    quickStats: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 22,
    },

    quickStatCard: {
        flex: 1,
        minHeight: 105,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
    },

    quickIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 11,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    quickIcon: {
        fontSize: 18,
    },

    quickStatNumber: {
        marginTop: 6,
        fontSize: 18,
        fontWeight: "900",
        color: "#2B2522",
    },

    quickStatLabel: {
        marginTop: 2,
        fontSize: 10,
        fontWeight: "700",
        color: "#9A8E88",
    },

    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "900",
        color: "#2B2522",
    },

    sectionSubtitle: {
        marginTop: 3,
        fontSize: 12,
        fontWeight: "500",
        color: "#9A8E88",
    },

    countBadge: {
        minWidth: 36,
        height: 36,
        paddingHorizontal: 9,
        borderRadius: 18,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    countBadgeText: {
        fontSize: 13,
        fontWeight: "900",
        color: "#C92A1D",
    },

    expenseCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        padding: 16,
        marginBottom: 14,
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

    expenseIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    expenseIcon: {
        fontSize: 23,
    },

    expenseInfo: {
        flex: 1,
    },

    category: {
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

    amountContainer: {
        alignItems: "flex-end",
        marginLeft: 8,
    },

    amount: {
        fontSize: 18,
        fontWeight: "900",
        color: "#C92A1D",
    },

    amountLabel: {
        marginTop: 2,
        fontSize: 9,
        fontWeight: "700",
        color: "#9A8E88",
    },

    divider: {
        height: 1,
        backgroundColor: "#F1D6D0",
        marginVertical: 14,
    },

    infoRow: {
        minHeight: 34,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 5,
    },

    infoLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6F625D",
    },

    infoValue: {
        maxWidth: "58%",
        fontSize: 13,
        fontWeight: "700",
        color: "#2B2522",
        textAlign: "right",
    },

    descriptionBox: {
        marginVertical: 8,
        padding: 13,
        backgroundColor: "#FAF7F3",
        borderRadius: 12,
        borderLeftWidth: 3,
        borderLeftColor: "#C92A1D",
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
        fontWeight: "500",
        color: "#4D4440",
    },

    paymentBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 9,
        backgroundColor: "#E8F5E9",
    },

    paymentBadgeText: {
        fontSize: 11,
        fontWeight: "800",
        color: "#2E7D32",
    },

    footer: {
        alignItems: "center",
        paddingVertical: 20,
    },

    footerTitle: {
        fontSize: 11,
        fontWeight: "900",
        color: "#2B2522",
        letterSpacing: 1,
    },

    footerSubtitle: {
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