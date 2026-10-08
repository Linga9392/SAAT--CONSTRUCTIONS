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

type Attendance = {
    id: number;
    user_id: number;
    project_id: number;
    member_id: number;
    attendance_date: string;
    status: string;
    overtime_hours: string;
    wage_amount: string;
};

export default function AttendanceScreen() {
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);

    const loadAttendance = async () => {
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
                `${API_BASE_URL}/attendance`,
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
                        "Failed to load attendance"
                );
            }

            setAttendance(
                Array.isArray(data.data)
                    ? data.data
                    : []
            );
        } catch (error) {
            Alert.alert(
                "Attendance Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load attendance"
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadAttendance();
        }, [])
    );

    const getStatusStyle = (status: string) => {
        if (status === "PRESENT") {
            return {
                badge: styles.presentBadge,
                text: styles.presentText,
            };
        }

        if (status === "ABSENT") {
            return {
                badge: styles.absentBadge,
                text: styles.absentText,
            };
        }

        return {
            badge: styles.otherBadge,
            text: styles.otherText,
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
                    Loading attendance...
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
                            Attendance
                        </Text>

                        <Text style={styles.subtitle}>
                            Track daily worker attendance
                        </Text>
                    </View>

                    <View style={styles.countCircle}>
                        <Text style={styles.countText}>
                            {attendance.length}
                        </Text>

                        <Text style={styles.countLabel}>
                            Records
                        </Text>
                    </View>
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryIcon}>
                        <Text style={styles.summaryIconText}>
                            📋
                        </Text>
                    </View>

                    <View style={styles.summaryTextBox}>
                        <Text style={styles.summaryTitle}>
                            Attendance Records
                        </Text>

                        <Text style={styles.summarySubtitle}>
                            Daily workforce attendance details
                        </Text>
                    </View>

                    <View style={styles.summaryCount}>
                        <Text style={styles.summaryCountText}>
                            {attendance.length}
                        </Text>
                    </View>
                </View>

                {attendance.length === 0 ? (
                    <EmptyState
                        icon="📋"
                        title="No Attendance Records"
                        message="Attendance records will appear here once they are added."
                    />
                ) : (
                    attendance.map((record) => {
                        const statusStyle =
                            getStatusStyle(record.status);

                        return (
                            <View
                                key={record.id}
                                style={styles.attendanceCard}
                            >
                                <View style={styles.cardHeader}>
                                    <View
                                        style={
                                            styles.attendanceIconCircle
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.attendanceIcon
                                            }
                                        >
                                            👷
                                        </Text>
                                    </View>

                                    <View
                                        style={
                                            styles.headerInfo
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.memberTitle
                                            }
                                        >
                                            Member #
                                            {record.member_id}
                                        </Text>

                                        <Text
                                            style={
                                                styles.projectText
                                            }
                                        >
                                            Project #
                                            {record.project_id}
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.statusBadge,
                                            statusStyle.badge,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                statusStyle.text,
                                            ]}
                                        >
                                            {record.status ||
                                                "UNKNOWN"}
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
                                        📅 Date
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {record.attendance_date
                                            ? new Date(
                                                  record.attendance_date
                                              ).toLocaleDateString(
                                                  "en-IN"
                                              )
                                            : "-"}
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        ⏱️ Overtime
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {record.overtime_hours ||
                                            "0"}{" "}
                                        hrs
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        💰 Wage
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {record.wage_amount
                                            ? `₹${Number(
                                                  record.wage_amount
                                              ).toLocaleString(
                                                  "en-IN"
                                              )}`
                                            : "-"}
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

    attendanceCard: {
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

    attendanceIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "#FDE8E5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    attendanceIcon: {
        fontSize: 23,
    },

    headerInfo: {
        flex: 1,
    },

    memberTitle: {
        fontSize: 17,
        fontWeight: "900",
        color: "#2B2522",
    },

    projectText: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "700",
        color: "#C92A1D",
    },

    statusBadge: {
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 10,
    },

    presentBadge: {
        backgroundColor: "#E8F5E9",
    },

    absentBadge: {
        backgroundColor: "#FFEBEE",
    },

    otherBadge: {
        backgroundColor: "#FFF3E0",
    },

    statusText: {
        fontSize: 9,
        fontWeight: "900",
    },

    presentText: {
        color: "#2E7D32",
    },

    absentText: {
        color: "#C62828",
    },

    otherText: {
        color: "#EF8C00",
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