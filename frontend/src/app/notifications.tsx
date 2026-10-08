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

type NotificationItem = {
    id: number;
    project_id: number | null;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
};

export default function NotificationsScreen() {
    const [notifications, setNotifications] =
        useState<NotificationItem[]>([]);

    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
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
                `${API_BASE_URL}/notifications`,
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
                        "Failed to load notifications"
                );
            }

            setNotifications(
                Array.isArray(data.data)
                    ? data.data
                    : []
            );
        } catch (error) {
            Alert.alert(
                "Notifications Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load notifications"
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadNotifications();
        }, [])
    );

    const unreadCount = notifications.filter(
        (item) => !item.is_read
    ).length;

    const readCount = notifications.filter(
        (item) => item.is_read
    ).length;

    const formatDate = (date: string) => {
        if (!date) {
            return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleString();
    };

    const getNotificationIcon = (type: string) => {
        switch (type?.toUpperCase()) {
            case "PROJECT":
                return "🏗️";

            case "ATTENDANCE":
                return "📋";

            case "PAYROLL":
                return "💰";

            case "MATERIAL":
                return "🧱";

            case "EXPENSE":
                return "💳";

            case "REPORT":
                return "📊";

            default:
                return "🔔";
        }
    };

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
                    Loading Notifications
                </Text>

                <Text style={styles.loadingText}>
                    Getting your latest updates...
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
                    title="Notifications"
                    showMenu
                    showNotification={false}
                />

                <View style={styles.pageHeader}>
                    <View style={styles.pageHeaderInfo}>
                        <Text style={styles.title}>
                            Notifications
                        </Text>

                        <Text style={styles.subtitle}>
                            Stay updated with your project
                        </Text>
                    </View>

                    <View style={styles.headerIconCircle}>
                        <Text style={styles.headerIcon}>
                            🔔
                        </Text>

                        {unreadCount > 0 && (
                            <View style={styles.headerDot} />
                        )}
                    </View>
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryIconCircle}>
                        <Text style={styles.summaryIcon}>
                            🔔
                        </Text>
                    </View>

                    <View style={styles.summaryContent}>
                        <Text style={styles.summaryLabel}>
                            Notification Center
                        </Text>

                        <Text style={styles.summaryValue}>
                            {notifications.length}{" "}
                            {notifications.length === 1
                                ? "Notification"
                                : "Notifications"}
                        </Text>
                    </View>

                    <View style={styles.newCircle}>
                        <Text style={styles.newNumber}>
                            {unreadCount}
                        </Text>

                        <Text style={styles.newLabel}>
                            NEW
                        </Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <View style={styles.unreadIconBox}>
                            <Text style={styles.statIcon}>
                                🔴
                            </Text>
                        </View>

                        <View>
                            <Text style={styles.statNumber}>
                                {unreadCount}
                            </Text>

                            <Text style={styles.statLabel}>
                                Unread
                            </Text>
                        </View>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.readIconBox}>
                            <Text style={styles.statIcon}>
                                ✓
                            </Text>
                        </View>

                        <View>
                            <Text style={styles.statNumber}>
                                {readCount}
                            </Text>

                            <Text style={styles.statLabel}>
                                Read
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionInfo}>
                        <Text style={styles.sectionTitle}>
                            Recent Notifications
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Your latest project updates
                        </Text>
                    </View>

                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>
                            {notifications.length}
                        </Text>
                    </View>
                </View>

                {notifications.length === 0 ? (
                    <EmptyState
                        icon="🔔"
                        title="No Notifications"
                        message="You don't have any notifications yet."
                    />
                ) : (
                    notifications.map((notification) => (
                        <View
                            key={notification.id}
                            style={[
                                styles.notificationCard,
                                !notification.is_read &&
                                    styles.unreadCard,
                            ]}
                        >
                            <View style={styles.cardTop}>
                                <View
                                    style={[
                                        styles.notificationIconCircle,
                                        !notification.is_read &&
                                            styles.unreadIconCircle,
                                    ]}
                                >
                                    <Text style={styles.notificationIcon}>
                                        {getNotificationIcon(
                                            notification.type
                                        )}
                                    </Text>
                                </View>

                                <View style={styles.cardContent}>
                                    <View style={styles.titleRow}>
                                        <Text
                                            style={[
                                                styles.notificationTitle,
                                                !notification.is_read &&
                                                    styles.unreadTitle,
                                            ]}
                                            numberOfLines={2}
                                        >
                                            {notification.title}
                                        </Text>

                                        {!notification.is_read && (
                                            <View style={styles.newBadge}>
                                                <Text
                                                    style={
                                                        styles.newBadgeText
                                                    }
                                                >
                                                    NEW
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <Text style={styles.message}>
                                        {notification.message}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.infoRow}>
                                <View style={styles.typeBadge}>
                                    <Text style={styles.typeText}>
                                        {notification.type ||
                                            "GENERAL"}
                                    </Text>
                                </View>

                                <Text style={styles.date}>
                                    {formatDate(
                                        notification.created_at
                                    )}
                                </Text>
                            </View>

                            {notification.project_id !== null && (
                                <View style={styles.projectBox}>
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

                                    <View>
                                        <Text
                                            style={
                                                styles.projectLabel
                                            }
                                        >
                                            PROJECT
                                        </Text>

                                        <Text
                                            style={
                                                styles.projectValue
                                            }
                                        >
                                            Project #
                                            {notification.project_id}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    ))
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

            <BottomNavigation active="account" />
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
        position: "relative",
    },

    headerIcon: {
        fontSize: 24,
    },

    headerDot: {
        position: "absolute",
        top: 8,
        right: 9,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#C92A1D",
    },

    summaryCard: {
        marginHorizontal: 18,
        padding: 18,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.04,
        shadowRadius: 5,
        elevation: 2,
    },

    summaryIconCircle: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    summaryIcon: {
        fontSize: 23,
    },

    summaryContent: {
        flex: 1,
        marginLeft: 13,
    },

    summaryLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#9A8E88",
    },

    summaryValue: {
        marginTop: 4,
        fontSize: 18,
        fontWeight: "900",
        color: "#2B2522",
    },

    newCircle: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    newNumber: {
        fontSize: 18,
        fontWeight: "900",
        color: "#C92A1D",
    },

    newLabel: {
        marginTop: 1,
        fontSize: 8,
        fontWeight: "900",
        color: "#C92A1D",
    },

    statsRow: {
        marginHorizontal: 18,
        marginTop: 14,
        flexDirection: "row",
        gap: 10,
    },

    statCard: {
        flex: 1,
        minHeight: 76,
        padding: 13,
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        flexDirection: "row",
        alignItems: "center",
    },

    unreadIconBox: {
        width: 38,
        height: 38,
        borderRadius: 11,
        backgroundColor: "#FFEBEE",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    readIconBox: {
        width: 38,
        height: 38,
        borderRadius: 11,
        backgroundColor: "#E8F5E9",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    statIcon: {
        fontSize: 17,
    },

    statNumber: {
        fontSize: 19,
        fontWeight: "900",
        color: "#2B2522",
    },

    statLabel: {
        marginTop: 2,
        fontSize: 11,
        fontWeight: "600",
        color: "#9A8E88",
    },

    sectionHeader: {
        marginHorizontal: 20,
        marginTop: 25,
        marginBottom: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    sectionInfo: {
        flex: 1,
    },

    sectionTitle: {
        fontSize: 19,
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

    notificationCard: {
        marginHorizontal: 18,
        marginBottom: 13,
        padding: 17,
        borderRadius: 19,
        backgroundColor: "#FFFFFF",
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

    unreadCard: {
        backgroundColor: "#FFF8F5",
        borderLeftWidth: 4,
        borderLeftColor: "#C92A1D",
    },

    cardTop: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    notificationIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "#F3F1EF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    unreadIconCircle: {
        backgroundColor: "#FDE8E5",
    },

    notificationIcon: {
        fontSize: 22,
    },

    cardContent: {
        flex: 1,
    },

    titleRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },

    notificationTitle: {
        flex: 1,
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "800",
        color: "#2B2522",
    },

    unreadTitle: {
        fontWeight: "900",
    },

    newBadge: {
        marginLeft: 8,
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderRadius: 7,
        backgroundColor: "#C92A1D",
    },

    newBadgeText: {
        fontSize: 8,
        fontWeight: "900",
        color: "#FFFFFF",
    },

    message: {
        marginTop: 7,
        fontSize: 13,
        lineHeight: 19,
        color: "#6F625D",
    },

    divider: {
        height: 1,
        backgroundColor: "#F1ECE8",
        marginVertical: 13,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    typeBadge: {
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 8,
        backgroundColor: "#FDE8E5",
    },

    typeText: {
        fontSize: 9,
        fontWeight: "900",
        color: "#C92A1D",
    },

    date: {
        flex: 1,
        marginLeft: 10,
        textAlign: "right",
        fontSize: 10,
        color: "#9A8E88",
    },

    projectBox: {
        marginTop: 11,
        padding: 10,
        borderRadius: 11,
        backgroundColor: "#FAF7F3",
        flexDirection: "row",
        alignItems: "center",
    },

    projectIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 9,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 9,
    },

    projectIcon: {
        fontSize: 17,
    },

    projectLabel: {
        fontSize: 8,
        fontWeight: "900",
        color: "#9A8E88",
    },

    projectValue: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: "800",
        color: "#2B2522",
    },

    footer: {
        marginTop: 25,
        marginHorizontal: 20,
        paddingTop: 18,
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#F1D6D0",
    },

    footerTitle: {
        fontSize: 9,
        fontWeight: "900",
        letterSpacing: 0.8,
        color: "#C92A1D",
        textAlign: "center",
    },

    footerSince: {
        marginTop: 5,
        fontSize: 10,
        fontWeight: "700",
        color: "#9A8E88",
    },
});