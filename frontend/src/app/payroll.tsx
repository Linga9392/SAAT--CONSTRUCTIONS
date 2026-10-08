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

type Payroll = {
    id: number;
    project_id: number;
    member_id: number;
    salary_month: string;
    total_days: number;
    present_days: number;
    half_days: number;
    absent_days: number;
    overtime_hours: number;
    total_salary: number | string;
    payment_status: string;
    paid_at: string | null;
};

export default function PayrollScreen() {
    const [payroll, setPayroll] = useState<Payroll[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPayroll = async () => {
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
                `${API_BASE_URL}/payroll`,
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
                        "Failed to load payroll"
                );
            }

            setPayroll(
                Array.isArray(data.data)
                    ? data.data
                    : []
            );
        } catch (error) {
            Alert.alert(
                "Payroll Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load payroll"
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadPayroll();
        }, [])
    );

    const totalPayroll = payroll.reduce(
        (total, item) =>
            total + Number(item.total_salary || 0),
        0
    );

    const paidCount = payroll.filter(
        (item) =>
            item.payment_status?.toUpperCase() ===
            "PAID"
    ).length;

    const pendingCount = payroll.filter(
        (item) =>
            item.payment_status?.toUpperCase() ===
            "PENDING"
    ).length;

    const totalOvertime = payroll.reduce(
        (total, item) =>
            total + Number(item.overtime_hours || 0),
        0
    );

    const formatAmount = (
        amount: number | string
    ) => {
        return Number(amount || 0).toLocaleString(
            "en-IN"
        );
    };

    const formatMonth = (month: string) => {
        if (!month) {
            return "-";
        }

        const date = new Date(month);

        if (Number.isNaN(date.getTime())) {
            return month.slice(0, 10);
        }

        return date.toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
        });
    };

    const getStatusStyle = (status: string) => {
        const normalized =
            status?.toUpperCase();

        if (normalized === "PAID") {
            return {
                backgroundColor: "#E8F5E9",
                color: "#2E7D32",
            };
        }

        if (normalized === "PENDING") {
            return {
                backgroundColor: "#FFF3E0",
                color: "#EF8C00",
            };
        }

        return {
            backgroundColor: "#FFEBEE",
            color: "#C62828",
        };
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#C92A1D"
                />

                <Text style={styles.loadingText}>
                    Loading payroll...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader
                title="Payroll"
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
                            Payroll
                        </Text>

                        <Text style={styles.subtitle}>
                            Manage labour payments and salaries
                        </Text>
                    </View>

                    <View style={styles.payrollIcon}>
                        <Text style={styles.payrollIconText}>
                            💰
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
                            Total Payroll
                        </Text>

                        <Text style={styles.summaryAmount}>
                            ₹{formatAmount(totalPayroll)}
                        </Text>
                    </View>

                    <View style={styles.summaryCount}>
                        <Text
                            style={
                                styles.summaryCountNumber
                            }
                        >
                            {payroll.length}
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
                            style={[
                                styles.quickIcon,
                                styles.paidIcon,
                            ]}
                        >
                            <Text style={styles.iconText}>
                                ✓
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.quickStatNumber
                            }
                        >
                            {paidCount}
                        </Text>

                        <Text
                            style={
                                styles.quickStatLabel
                            }
                        >
                            Paid
                        </Text>
                    </View>

                    <View style={styles.quickStatCard}>
                        <View
                            style={[
                                styles.quickIcon,
                                styles.pendingIcon,
                            ]}
                        >
                            <Text style={styles.iconText}>
                                ⏳
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.quickStatNumber
                            }
                        >
                            {pendingCount}
                        </Text>

                        <Text
                            style={
                                styles.quickStatLabel
                            }
                        >
                            Pending
                        </Text>
                    </View>

                    <View style={styles.quickStatCard}>
                        <View
                            style={[
                                styles.quickIcon,
                                styles.overtimeIcon,
                            ]}
                        >
                            <Text style={styles.iconText}>
                                ⏱️
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.quickStatNumber
                            }
                        >
                            {totalOvertime}h
                        </Text>

                        <Text
                            style={
                                styles.quickStatLabel
                            }
                        >
                            Overtime
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            Payroll Records
                        </Text>

                        <Text
                            style={
                                styles.sectionSubtitle
                            }
                        >
                            Labour salary and payment details
                        </Text>
                    </View>

                    <View style={styles.countBadge}>
                        <Text
                            style={
                                styles.countBadgeText
                            }
                        >
                            {payroll.length}
                        </Text>
                    </View>
                </View>

                {payroll.length === 0 ? (
                    <EmptyState
                        icon="💰"
                        title="No Payroll Records Found"
                        message="Labour salary and payment records will appear here."
                    />
                ) : (
                    payroll.map((item) => {
                        const statusStyle =
                            getStatusStyle(
                                item.payment_status
                            );

                        return (
                            <View
                                key={item.id}
                                style={styles.payrollCard}
                            >
                                <View
                                    style={
                                        styles.cardHeader
                                    }
                                >
                                    <View
                                        style={
                                            styles.employeeIcon
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.employeeIconText
                                            }
                                        >
                                            👷
                                        </Text>
                                    </View>

                                    <View
                                        style={
                                            styles.employeeInfo
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.month
                                            }
                                        >
                                            {formatMonth(
                                                item.salary_month
                                            )}
                                        </Text>

                                        <Text
                                            style={
                                                styles.memberText
                                            }
                                        >
                                            Member #
                                            {item.member_id}
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.statusBadge,
                                            {
                                                backgroundColor:
                                                    statusStyle.backgroundColor,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                {
                                                    color:
                                                        statusStyle.color,
                                                },
                                            ]}
                                        >
                                            {item.payment_status ||
                                                "PENDING"}
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={
                                        styles.salaryBox
                                    }
                                >
                                    <View>
                                        <Text
                                            style={
                                                styles.salaryLabel
                                            }
                                        >
                                            Total Salary
                                        </Text>

                                        <Text
                                            style={
                                                styles.salarySubLabel
                                            }
                                        >
                                            Monthly payroll
                                        </Text>
                                    </View>

                                    <Text
                                        style={
                                            styles.salary
                                        }
                                    >
                                        ₹
                                        {formatAmount(
                                            item.total_salary
                                        )}
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.divider
                                    }
                                />

                                <Text
                                    style={
                                        styles.attendanceTitle
                                    }
                                >
                                    Attendance Summary
                                </Text>

                                <View
                                    style={
                                        styles.infoGrid
                                    }
                                >
                                    <View
                                        style={
                                            styles.gridItem
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.gridLabel
                                            }
                                        >
                                            Project
                                        </Text>

                                        <Text
                                            style={
                                                styles.gridValue
                                            }
                                        >
                                            #{item.project_id}
                                        </Text>
                                    </View>

                                    <View
                                        style={
                                            styles.gridItem
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.gridLabel
                                            }
                                        >
                                            Total Days
                                        </Text>

                                        <Text
                                            style={
                                                styles.gridValue
                                            }
                                        >
                                            {item.total_days}
                                        </Text>
                                    </View>

                                    <View
                                        style={
                                            styles.gridItem
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.gridLabel
                                            }
                                        >
                                            Present
                                        </Text>

                                        <Text
                                            style={[
                                                styles.gridValue,
                                                {
                                                    color:
                                                        "#2E7D32",
                                                },
                                            ]}
                                        >
                                            {item.present_days}
                                        </Text>
                                    </View>

                                    <View
                                        style={
                                            styles.gridItem
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.gridLabel
                                            }
                                        >
                                            Half Days
                                        </Text>

                                        <Text
                                            style={
                                                styles.gridValue
                                            }
                                        >
                                            {item.half_days}
                                        </Text>
                                    </View>

                                    <View
                                        style={
                                            styles.gridItem
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.gridLabel
                                            }
                                        >
                                            Absent
                                        </Text>

                                        <Text
                                            style={[
                                                styles.gridValue,
                                                {
                                                    color:
                                                        "#C62828",
                                                },
                                            ]}
                                        >
                                            {item.absent_days}
                                        </Text>
                                    </View>

                                    <View
                                        style={
                                            styles.gridItem
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.gridLabel
                                            }
                                        >
                                            Overtime
                                        </Text>

                                        <Text
                                            style={
                                                styles.gridValue
                                            }
                                        >
                                            {item.overtime_hours}h
                                        </Text>
                                    </View>
                                </View>

                                {item.paid_at && (
                                    <View
                                        style={
                                            styles.paidRow
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.paidLabel
                                            }
                                        >
                                            ✓ Payment Completed
                                        </Text>

                                        <Text
                                            style={
                                                styles.paidDate
                                            }
                                        >
                                            {item.paid_at.slice(
                                                0,
                                                10
                                            )}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>
                        SRI AMMA ANNA TEMPLE
                    </Text>

                    <Text
                        style={styles.footerSubtitle}
                    >
                        CONSTRUCTION
                    </Text>

                    <Text style={styles.footerSince}>
                        Since 1974
                    </Text>
                </View>

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

    payrollIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#FDE8E5",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        alignItems: "center",
        justifyContent: "center",
    },

    payrollIconText: {
        fontSize: 24,
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
    },

    quickIcon: {
        width: 36,
        height: 36,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
    },

    paidIcon: {
        backgroundColor: "#E8F5E9",
    },

    pendingIcon: {
        backgroundColor: "#FFF3E0",
    },

    overtimeIcon: {
        backgroundColor: "#FDE8E5",
    },

    iconText: {
        fontSize: 17,
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

    payrollCard: {
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

    employeeIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    employeeIconText: {
        fontSize: 23,
    },

    employeeInfo: {
        flex: 1,
    },

    month: {
        fontSize: 17,
        fontWeight: "900",
        color: "#2B2522",
    },

    memberText: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "600",
        color: "#9A8E88",
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
    },

    statusText: {
        fontSize: 10,
        fontWeight: "900",
    },

    salaryBox: {
        marginTop: 15,
        padding: 14,
        borderRadius: 14,
        backgroundColor: "#FAF7F3",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    salaryLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#6F625D",
    },

    salarySubLabel: {
        marginTop: 3,
        fontSize: 10,
        color: "#9A8E88",
    },

    salary: {
        fontSize: 21,
        fontWeight: "900",
        color: "#C92A1D",
    },

    divider: {
        height: 1,
        backgroundColor: "#F1D6D0",
        marginVertical: 15,
    },

    attendanceTitle: {
        marginBottom: 5,
        fontSize: 12,
        fontWeight: "900",
        color: "#C92A1D",
    },

    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    gridItem: {
        width: "33.33%",
        paddingVertical: 9,
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

    paidRow: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#F1D6D0",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    paidLabel: {
        fontSize: 12,
        fontWeight: "800",
        color: "#2E7D32",
    },

    paidDate: {
        fontSize: 12,
        fontWeight: "700",
        color: "#6F625D",
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