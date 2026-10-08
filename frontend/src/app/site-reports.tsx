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

type SiteReport = {
    id: number;
    project_id: number;
    report_date: string;
    work_completed?: string | null;
    workers_count?: number | string | null;
    materials_used?: string | null;
    issues?: string | null;
    safety_notes?: string | null;
    weather?: string | null;
    supervisor_notes?: string | null;
};

export default function SiteReportsScreen() {
    const [reports, setReports] = useState<SiteReport[]>([]);
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

            const response = await fetch(
                `${API_BASE_URL}/site-reports`,
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
                        "Failed to load site reports"
                );
            }

            setReports(
                Array.isArray(data.data)
                    ? data.data
                    : []
            );
        } catch (error) {
            Alert.alert(
                "Site Reports Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load site reports"
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#C92A1D"
                />

                <Text style={styles.loadingText}>
                    Loading site reports...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader
                title="Site Reports"
                showBack={true}
                showNotification={true}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.pageHeader}>
                    <View style={styles.headerInfo}>
                        <Text style={styles.title}>
                            Site Reports
                        </Text>

                        <Text style={styles.subtitle}>
                            Daily construction site reports
                        </Text>
                    </View>

                    <View style={styles.countCircle}>
                        <Text style={styles.countText}>
                            {reports.length}
                        </Text>
                    </View>
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryIcon}>
                        <Text style={styles.summaryIconText}>
                            🏗️
                        </Text>
                    </View>

                    <View style={styles.summaryInfo}>
                        <Text style={styles.summaryTitle}>
                            Construction Reports
                        </Text>

                        <Text style={styles.summaryText}>
                            Track daily work progress and
                            site conditions
                        </Text>
                    </View>

                    <Text style={styles.summaryCount}>
                        {reports.length}
                    </Text>
                </View>

                {reports.length === 0 ? (
                    <EmptyState
                        icon="📋"
                        title="No Site Reports Found"
                        message="Construction site reports will appear here once they are added."
                    />
                ) : (
                    reports.map((item) => (
                        <View
                            key={item.id}
                            style={styles.reportCard}
                        >
                            <View style={styles.cardHeader}>
                                <View
                                    style={
                                        styles.reportIconContainer
                                    }
                                >
                                    <Text
                                        style={
                                            styles.reportIcon
                                        }
                                    >
                                        🏗️
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.reportHeaderInfo
                                    }
                                >
                                    <Text
                                        style={
                                            styles.reportTitle
                                        }
                                    >
                                        Project #{item.project_id}
                                    </Text>

                                    <Text
                                        style={
                                            styles.reportDate
                                        }
                                    >
                                        {item.report_date
                                            ? item.report_date.slice(
                                                  0,
                                                  10
                                              )
                                            : "-"}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    Work Completed
                                </Text>

                                <Text style={styles.sectionText}>
                                    {item.work_completed ||
                                        "-"}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoBox}>
                                    <Text style={styles.infoIcon}>
                                        👷
                                    </Text>

                                    <View>
                                        <Text
                                            style={
                                                styles.infoLabel
                                            }
                                        >
                                            Workers
                                        </Text>

                                        <Text
                                            style={
                                                styles.infoValue
                                            }
                                        >
                                            {item.workers_count ||
                                                0}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.infoBox}>
                                    <Text style={styles.infoIcon}>
                                        ☀️
                                    </Text>

                                    <View>
                                        <Text
                                            style={
                                                styles.infoLabel
                                            }
                                        >
                                            Weather
                                        </Text>

                                        <Text
                                            style={
                                                styles.infoValue
                                            }
                                        >
                                            {item.weather ||
                                                "-"}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    🧱 Materials Used
                                </Text>

                                <Text style={styles.sectionText}>
                                    {item.materials_used ||
                                        "-"}
                                </Text>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    ⚠️ Issues
                                </Text>

                                <Text style={styles.sectionText}>
                                    {item.issues || "-"}
                                </Text>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    🦺 Safety Notes
                                </Text>

                                <Text style={styles.sectionText}>
                                    {item.safety_notes ||
                                        "-"}
                                </Text>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>
                                    📝 Supervisor Notes
                                </Text>

                                <Text style={styles.sectionText}>
                                    {item.supervisor_notes ||
                                        "-"}
                                </Text>
                            </View>
                        </View>
                    ))
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

    countCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#F1D6D0",
    },

    countText: {
        fontSize: 18,
        fontWeight: "900",
        color: "#C92A1D",
    },

    summaryCard: {
        minHeight: 92,
        backgroundColor: "#FFF8F5",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },

    summaryIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    summaryIconText: {
        fontSize: 23,
    },

    summaryInfo: {
        flex: 1,
    },

    summaryTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: "#2B2522",
    },

    summaryText: {
        marginTop: 3,
        fontSize: 12,
        lineHeight: 17,
        color: "#9A8E88",
    },

    summaryCount: {
        fontSize: 24,
        fontWeight: "900",
        color: "#C92A1D",
        marginLeft: 8,
    },

    reportCard: {
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

    reportIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    reportIcon: {
        fontSize: 24,
    },

    reportHeaderInfo: {
        flex: 1,
    },

    reportTitle: {
        fontSize: 17,
        fontWeight: "900",
        color: "#2B2522",
    },

    reportDate: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "600",
        color: "#9A8E88",
    },

    divider: {
        height: 1,
        backgroundColor: "#F1D6D0",
        marginVertical: 15,
    },

    section: {
        marginBottom: 14,
    },

    sectionTitle: {
        fontSize: 12,
        fontWeight: "800",
        color: "#C92A1D",
        marginBottom: 5,
    },

    sectionText: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500",
        color: "#4D4440",
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 14,
    },

    infoBox: {
        flex: 1,
        minHeight: 64,
        backgroundColor: "#FAF7F3",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
    },

    infoIcon: {
        fontSize: 20,
        marginRight: 9,
    },

    infoLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "#9A8E88",
    },

    infoValue: {
        marginTop: 2,
        fontSize: 14,
        fontWeight: "800",
        color: "#2B2522",
    },

    bottomSpace: {
        height: 20,
    },
});