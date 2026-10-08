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

type ProjectReport = {
    project_id: number;
    project_name: string;
    total_expenses: number | string;
    total_payroll: number | string;
    total_materials: number | string;
    total_members: number | string;
    total_site_reports: number | string;
};

type MonthlyExpense = {
    month: string;
    total_expenses: number | string;
};

export default function ReportsScreen() {
    const [projects, setProjects] = useState<ProjectReport[]>([]);
    const [monthlyExpenses, setMonthlyExpenses] =
        useState<MonthlyExpense[]>([]);
    const [loading, setLoading] = useState(true);

    const loadReports = async () => {
        try {
            setLoading(true);

            const token =
                await AsyncStorage.getItem("auth_token");

            if (!token) {
                throw new Error(
                    "Authorization token not found"
                );
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            const projectResponse = await fetch(
                `${API_BASE_URL}/reports/project`,
                {
                    method: "GET",
                    headers,
                }
            );

            const projectData =
                await projectResponse.json();

            if (!projectResponse.ok) {
                throw new Error(
                    projectData.message ||
                        "Failed to load project reports"
                );
            }

            const expenseResponse = await fetch(
                `${API_BASE_URL}/reports/monthly-expenses`,
                {
                    method: "GET",
                    headers,
                }
            );

            const expenseData =
                await expenseResponse.json();

            if (!expenseResponse.ok) {
                throw new Error(
                    expenseData.message ||
                        "Failed to load expense reports"
                );
            }

            setProjects(
                Array.isArray(projectData.data)
                    ? projectData.data
                    : []
            );

            setMonthlyExpenses(
                Array.isArray(expenseData.data)
                    ? expenseData.data
                    : []
            );
        } catch (error) {
            Alert.alert(
                "Reports Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load reports"
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadReports();
        }, [])
    );

    const formatAmount = (
        amount: number | string
    ) => {
        const value = Number(amount || 0);

        return value.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        });
    };

    const totalProjectExpenses = projects.reduce(
        (total, project) =>
            total +
            Number(project.total_expenses || 0),
        0
    );

    const totalPayroll = projects.reduce(
        (total, project) =>
            total +
            Number(project.total_payroll || 0),
        0
    );

    const totalMaterials = projects.reduce(
        (total, project) =>
            total +
            Number(project.total_materials || 0),
        0
    );

    const totalMembers = projects.reduce(
        (total, project) =>
            total +
            Number(project.total_members || 0),
        0
    );

    const totalSiteReports = projects.reduce(
        (total, project) =>
            total +
            Number(project.total_site_reports || 0),
        0
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <View style={styles.loadingCircle}>
                    <ActivityIndicator
                        size="large"
                        color="#C92A1D"
                    />
                </View>

                <Text style={styles.loadingTitle}>
                    Loading Reports
                </Text>

                <Text style={styles.loadingText}>
                    Preparing your project overview...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <AppHeader
                    title="SAAT Construction"
                    showMenu
                    showNotification
                />

                <View style={styles.pageHeader}>
                    <View style={styles.pageHeaderInfo}>
                        <Text style={styles.title}>
                            Reports
                        </Text>

                        <Text style={styles.subtitle}>
                            Project and expense overview
                        </Text>
                    </View>

                    <View style={styles.headerIconCircle}>
                        <Text style={styles.headerIcon}>
                            📊
                        </Text>
                    </View>
                </View>

                <View style={styles.heroCard}>
                    <View style={styles.heroTop}>
                        <View style={styles.heroIconCircle}>
                            <Text style={styles.heroIcon}>
                                📊
                            </Text>
                        </View>

                        <View style={styles.heroInfo}>
                            <Text style={styles.heroTitle}>
                                Construction Overview
                            </Text>

                            <Text style={styles.heroSubtitle}>
                                Track your project performance
                                and finances
                            </Text>
                        </View>
                    </View>

                    <View style={styles.heroDivider} />

                    <View style={styles.heroStats}>
                        <View style={styles.heroStat}>
                            <Text style={styles.heroStatNumber}>
                                {projects.length}
                            </Text>

                            <Text style={styles.heroStatLabel}>
                                Projects
                            </Text>
                        </View>

                        <View style={styles.heroVerticalLine} />

                        <View style={styles.heroStat}>
                            <Text style={styles.heroStatNumber}>
                                ₹
                                {formatAmount(
                                    totalProjectExpenses
                                )}
                            </Text>

                            <Text style={styles.heroStatLabel}>
                                Expenses
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.summaryGrid}>
                    <View style={styles.summaryCard}>
                        <View
                            style={[
                                styles.summaryIconCircle,
                                styles.redBackground,
                            ]}
                        >
                            <Text style={styles.summaryIcon}>
                                🏗️
                            </Text>
                        </View>

                        <Text style={styles.summaryNumber}>
                            {projects.length}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Projects
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <View
                            style={[
                                styles.summaryIconCircle,
                                styles.goldBackground,
                            ]}
                        >
                            <Text style={styles.summaryIcon}>
                                💰
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.summaryNumber,
                                styles.goldText,
                            ]}
                        >
                            ₹
                            {formatAmount(
                                totalProjectExpenses
                            )}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Expenses
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <View
                            style={[
                                styles.summaryIconCircle,
                                styles.greenBackground,
                            ]}
                        >
                            <Text style={styles.summaryIcon}>
                                👷
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.summaryNumber,
                                styles.greenText,
                            ]}
                        >
                            {totalMembers}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Members
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <View
                            style={[
                                styles.summaryIconCircle,
                                styles.purpleBackground,
                            ]}
                        >
                            <Text style={styles.summaryIcon}>
                                💵
                            </Text>
                        </View>

                        <Text
                            style={[
                                styles.summaryNumber,
                                styles.purpleText,
                            ]}
                        >
                            ₹
                            {formatAmount(
                                totalPayroll
                            )}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Payroll
                        </Text>
                    </View>
                </View>

                <View style={styles.activityCard}>
                    <View style={styles.activityHeader}>
                        <View>
                            <Text style={styles.activityTitle}>
                                Activity Summary
                            </Text>

                            <Text style={styles.activitySubtitle}>
                                Overall project activity
                            </Text>
                        </View>

                        <View style={styles.activityIconCircle}>
                            <Text style={styles.activityIcon}>
                                📈
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.activityRow}>
                        <View style={styles.activityItem}>
                            <Text style={styles.activityNumber}>
                                {totalMaterials}
                            </Text>

                            <Text style={styles.activityLabel}>
                                Materials
                            </Text>
                        </View>

                        <View style={styles.activityItem}>
                            <Text style={styles.activityNumber}>
                                {totalSiteReports}
                            </Text>

                            <Text style={styles.activityLabel}>
                                Site Reports
                            </Text>
                        </View>

                        <View style={styles.activityItem}>
                            <Text style={styles.activityNumber}>
                                {monthlyExpenses.length}
                            </Text>

                            <Text style={styles.activityLabel}>
                                Months
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionInfo}>
                        <Text style={styles.sectionTitle}>
                            Project Reports
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Financial and workforce summary
                        </Text>
                    </View>

                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>
                            {projects.length}
                        </Text>
                    </View>
                </View>

                {projects.length === 0 ? (
                    <EmptyState
                        icon="📊"
                        title="No Project Reports"
                        message="Project report data will appear here once project activities are available."
                    />
                ) : (
                    projects.map((project) => (
                        <View
                            key={project.project_id}
                            style={styles.reportCard}
                        >
                            <View style={styles.reportHeader}>
                                <View
                                    style={
                                        styles.projectIconCircle
                                    }
                                >
                                    <Text
                                        style={
                                            styles.projectIcon
                                        }
                                    >
                                        🏗️
                                    </Text>
                                </View>

                                <View style={styles.projectInfo}>
                                    <Text
                                        style={
                                            styles.projectName
                                        }
                                        numberOfLines={2}
                                    >
                                        {project.project_name}
                                    </Text>

                                    <View
                                        style={
                                            styles.projectIdBadge
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.projectId
                                            }
                                        >
                                            PROJECT #
                                            {project.project_id}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.metricsGrid}>
                                <View style={styles.metricCard}>
                                    <View
                                        style={
                                            styles.metricIconCircle
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.metricIcon
                                            }
                                        >
                                            💰
                                        </Text>
                                    </View>

                                    <Text
                                        style={
                                            styles.metricLabel
                                        }
                                    >
                                        Expenses
                                    </Text>

                                    <Text
                                        style={[
                                            styles.metricValue,
                                            styles.redText,
                                        ]}
                                    >
                                        ₹
                                        {formatAmount(
                                            project.total_expenses
                                        )}
                                    </Text>
                                </View>

                                <View style={styles.metricCard}>
                                    <View
                                        style={[
                                            styles.metricIconCircle,
                                            styles.purpleBackground,
                                        ]}
                                    >
                                        <Text
                                            style={
                                                styles.metricIcon
                                            }
                                        >
                                            💵
                                        </Text>
                                    </View>

                                    <Text
                                        style={
                                            styles.metricLabel
                                        }
                                    >
                                        Payroll
                                    </Text>

                                    <Text
                                        style={[
                                            styles.metricValue,
                                            styles.purpleText,
                                        ]}
                                    >
                                        ₹
                                        {formatAmount(
                                            project.total_payroll
                                        )}
                                    </Text>
                                </View>

                                <View style={styles.metricCard}>
                                    <View
                                        style={[
                                            styles.metricIconCircle,
                                            styles.goldBackground,
                                        ]}
                                    >
                                        <Text
                                            style={
                                                styles.metricIcon
                                            }
                                        >
                                            🧱
                                        </Text>
                                    </View>

                                    <Text
                                        style={
                                            styles.metricLabel
                                        }
                                    >
                                        Materials
                                    </Text>

                                    <Text
                                        style={[
                                            styles.metricValue,
                                            styles.goldText,
                                        ]}
                                    >
                                        {project.total_materials}
                                    </Text>
                                </View>

                                <View style={styles.metricCard}>
                                    <View
                                        style={[
                                            styles.metricIconCircle,
                                            styles.greenBackground,
                                        ]}
                                    >
                                        <Text
                                            style={
                                                styles.metricIcon
                                            }
                                        >
                                            👷
                                        </Text>
                                    </View>

                                    <Text
                                        style={
                                            styles.metricLabel
                                        }
                                    >
                                        Members
                                    </Text>

                                    <Text
                                        style={[
                                            styles.metricValue,
                                            styles.greenText,
                                        ]}
                                    >
                                        {project.total_members}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.siteReportRow}>
                                <View style={styles.siteReportLeft}>
                                    <View
                                        style={
                                            styles.siteReportIconCircle
                                        }
                                    >
                                        <Text>📋</Text>
                                    </View>

                                    <View>
                                        <Text
                                            style={
                                                styles.siteReportLabel
                                            }
                                        >
                                            Site Reports
                                        </Text>

                                        <Text
                                            style={
                                                styles.siteReportSub
                                            }
                                        >
                                            Recorded project
                                            activities
                                        </Text>
                                    </View>
                                </View>

                                <Text
                                    style={
                                        styles.siteReportValue
                                    }
                                >
                                    {project.total_site_reports}
                                </Text>
                            </View>
                        </View>
                    ))
                )}

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionInfo}>
                        <Text style={styles.sectionTitle}>
                            Monthly Expenses
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Expense trend by month
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.countBadge,
                            styles.goldBackground,
                        ]}
                    >
                        <Text
                            style={[
                                styles.countBadgeText,
                                styles.goldText,
                            ]}
                        >
                            {monthlyExpenses.length}
                        </Text>
                    </View>
                </View>

                {monthlyExpenses.length === 0 ? (
                    <EmptyState
                        icon="💰"
                        title="No Monthly Expenses"
                        message="Monthly expense information will appear here."
                    />
                ) : (
                    monthlyExpenses.map(
                        (expense, index) => (
                            <View
                                key={`${expense.month}-${index}`}
                                style={styles.expenseCard}
                            >
                                <View style={styles.expenseLeft}>
                                    <View
                                        style={
                                            styles.expenseIconCircle
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
                                                styles.month
                                            }
                                        >
                                            {expense.month}
                                        </Text>

                                        <Text
                                            style={
                                                styles.monthLabel
                                            }
                                        >
                                            Monthly Expense
                                        </Text>
                                    </View>
                                </View>

                                <Text
                                    style={
                                        styles.expenseAmount
                                    }
                                >
                                    ₹
                                    {formatAmount(
                                        expense.total_expenses
                                    )}
                                </Text>
                            </View>
                        )
                    )
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>
                        SRI AMMA ANNA TEMPLE CONSTRUCTION
                    </Text>

                    <Text style={styles.footerSince}>
                        Since 1974
                    </Text>
                </View>
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
        paddingBottom: 100,
    },

    loadingContainer: {
        flex: 1,
        backgroundColor: "#FAF7F3",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },

    loadingCircle: {
        width: 76,
        height: 76,
        borderRadius: 22,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    loadingTitle: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: "900",
        color: "#2B2522",
    },

    loadingText: {
        marginTop: 5,
        fontSize: 13,
        color: "#9A8E88",
    },

    pageHeader: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 17,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    pageHeaderInfo: {
        flex: 1,
    },

    title: {
        fontSize: 29,
        fontWeight: "900",
        color: "#2B2522",
    },

    subtitle: {
        marginTop: 5,
        fontSize: 14,
        color: "#6F625D",
    },

    headerIconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 12,
    },

    headerIcon: {
        fontSize: 25,
    },

    heroCard: {
        marginHorizontal: 18,
        marginBottom: 18,
        padding: 18,
        backgroundColor: "#C92A1D",
        borderRadius: 23,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7,
        elevation: 4,
    },

    heroTop: {
        flexDirection: "row",
        alignItems: "center",
    },

    heroIconCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },

    heroIcon: {
        fontSize: 25,
    },

    heroInfo: {
        flex: 1,
        marginLeft: 13,
    },

    heroTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: "#FFFFFF",
    },

    heroSubtitle: {
        marginTop: 4,
        fontSize: 12,
        lineHeight: 17,
        color: "#FDE8E4",
    },

    heroDivider: {
        height: 1,
        backgroundColor: "#E57A72",
        marginVertical: 16,
    },

    heroStats: {
        flexDirection: "row",
        alignItems: "center",
    },

    heroStat: {
        flex: 1,
        alignItems: "center",
    },

    heroStatNumber: {
        fontSize: 18,
        fontWeight: "900",
        color: "#FFFFFF",
    },

    heroStatLabel: {
        marginTop: 3,
        fontSize: 10,
        color: "#FDE8E4",
        fontWeight: "700",
    },

    heroVerticalLine: {
        width: 1,
        height: 34,
        backgroundColor: "#E57A72",
    },

    summaryGrid: {
        marginHorizontal: 18,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 18,
    },

    summaryCard: {
        width: "48%",
        minHeight: 115,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#F1D6D0",
    },

    summaryIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },

    summaryIcon: {
        fontSize: 19,
    },

    summaryNumber: {
        fontSize: 16,
        fontWeight: "900",
        color: "#C92A1D",
    },

    summaryLabel: {
        marginTop: 3,
        fontSize: 11,
        color: "#9A8E88",
        fontWeight: "700",
    },

    redBackground: {
        backgroundColor: "#FDE8E5",
    },

    goldBackground: {
        backgroundColor: "#FFF3E0",
    },

    greenBackground: {
        backgroundColor: "#E8F5E9",
    },

    purpleBackground: {
        backgroundColor: "#F1EEFF",
    },

    redText: {
        color: "#C92A1D",
    },

    goldText: {
        color: "#9A6A10",
    },

    greenText: {
        color: "#2E7D32",
    },

    purpleText: {
        color: "#6D4BC3",
    },

    activityCard: {
        marginHorizontal: 18,
        marginBottom: 24,
        padding: 17,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F1D6D0",
    },

    activityHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    activityTitle: {
        fontSize: 17,
        fontWeight: "900",
        color: "#2B2522",
    },

    activitySubtitle: {
        marginTop: 3,
        fontSize: 11,
        color: "#9A8E88",
    },

    activityIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    activityIcon: {
        fontSize: 19,
    },

    divider: {
        height: 1,
        backgroundColor: "#F1ECE8",
        marginVertical: 14,
    },

    activityRow: {
        flexDirection: "row",
    },

    activityItem: {
        flex: 1,
        alignItems: "center",
    },

    activityNumber: {
        fontSize: 18,
        fontWeight: "900",
        color: "#C92A1D",
    },

    activityLabel: {
        marginTop: 4,
        fontSize: 10,
        color: "#9A8E88",
        fontWeight: "700",
    },

    sectionHeader: {
        marginHorizontal: 20,
        marginBottom: 13,
        marginTop: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    sectionInfo: {
        flex: 1,
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
        minWidth: 34,
        height: 34,
        paddingHorizontal: 8,
        borderRadius: 17,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 10,
    },

    countBadgeText: {
        fontSize: 13,
        fontWeight: "900",
        color: "#C92A1D",
    },

    reportCard: {
        marginHorizontal: 18,
        marginBottom: 16,
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
        shadowOpacity: 0.04,
        shadowRadius: 5,
        elevation: 2,
    },

    reportHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    projectIconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    projectIcon: {
        fontSize: 23,
    },

    projectInfo: {
        flex: 1,
        marginLeft: 13,
    },

    projectName: {
        fontSize: 17,
        fontWeight: "900",
        color: "#2B2522",
        lineHeight: 22,
    },

    projectIdBadge: {
        alignSelf: "flex-start",
        marginTop: 5,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 6,
        backgroundColor: "#FAF7F3",
    },

    projectId: {
        fontSize: 9,
        color: "#9A8E88",
        fontWeight: "900",
    },

    metricsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    metricCard: {
        width: "48%",
        padding: 12,
        marginBottom: 9,
        borderRadius: 14,
        backgroundColor: "#FAF7F3",
    },

    metricIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    metricIcon: {
        fontSize: 16,
    },

    metricLabel: {
        marginTop: 7,
        fontSize: 11,
        color: "#9A8E88",
        fontWeight: "700",
    },

    metricValue: {
        marginTop: 3,
        fontSize: 15,
        fontWeight: "900",
    },

    siteReportRow: {
        marginTop: 3,
        padding: 11,
        borderRadius: 12,
        backgroundColor: "#FAF7F3",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    siteReportLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },

    siteReportIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 9,
    },

    siteReportLabel: {
        fontSize: 12,
        color: "#444444",
        fontWeight: "800",
    },

    siteReportSub: {
        marginTop: 2,
        fontSize: 9,
        color: "#9A8E88",
    },

    siteReportValue: {
        fontSize: 16,
        color: "#C92A1D",
        fontWeight: "900",
    },

    expenseCard: {
        marginHorizontal: 18,
        marginBottom: 12,
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#F0DEC0",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    expenseLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },

    expenseIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#FFF3E0",
        alignItems: "center",
        justifyContent: "center",
    },

    expenseIcon: {
        fontSize: 21,
    },

    expenseInfo: {
        flex: 1,
        marginLeft: 12,
    },

    month: {
        fontSize: 16,
        fontWeight: "900",
        color: "#6B4E16",
    },

    monthLabel: {
        marginTop: 4,
        fontSize: 11,
        color: "#92743A",
    },

    expenseAmount: {
        marginLeft: 10,
        fontSize: 17,
        fontWeight: "900",
        color: "#2E7D32",
    },

    footer: {
        marginHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 10,
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#F1D6D0",
    },

    footerTitle: {
        fontSize: 9,
        fontWeight: "900",
        color: "#C92A1D",
        letterSpacing: 0.8,
        textAlign: "center",
    },

    footerSince: {
        marginTop: 5,
        fontSize: 10,
        color: "#9A8E88",
        fontWeight: "700",
    },
});