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

type Member = {
    id: number;
    project_id: number;
    full_name: string;
    phone: string;
    role: string;
    joining_date: string;
    daily_wage: string;
    status: string;
};

export default function MembersScreen() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    const loadMembers = async () => {
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
                `${API_BASE_URL}/members`,
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
                        "Failed to load members"
                );
            }

            setMembers(
                Array.isArray(data.data)
                    ? data.data
                    : []
            );
        } catch (error) {
            Alert.alert(
                "Members Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load members"
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadMembers();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color="#C92A1D"
                />

                <Text style={styles.loadingText}>
                    Loading members...
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
                            Members
                        </Text>

                        <Text style={styles.subtitle}>
                            Manage construction team members
                        </Text>
                    </View>

                    <View style={styles.countCircle}>
                        <Text style={styles.countText}>
                            {members.length}
                        </Text>

                        <Text style={styles.countLabel}>
                            Members
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            Team Members
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Construction workforce
                        </Text>
                    </View>

                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>
                            {members.length}
                        </Text>
                    </View>
                </View>

                {members.length === 0 ? (
                    <EmptyState
                        icon="👷"
                        title="No Members Found"
                        message="Team members will appear here once they are added."
                    />
                ) : (
                    members.map((member) => (
                        <View
                            key={member.id}
                            style={styles.memberCard}
                        >
                            <View style={styles.cardHeader}>
                                <View
                                    style={
                                        styles.memberIconCircle
                                    }
                                >
                                    <Text
                                        style={
                                            styles.memberIcon
                                        }
                                    >
                                        👷
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.memberTitleBox
                                    }
                                >
                                    <Text
                                        style={
                                            styles.memberName
                                        }
                                        numberOfLines={2}
                                    >
                                        {member.full_name}
                                    </Text>

                                    <Text
                                        style={
                                            styles.memberRole
                                        }
                                    >
                                        {member.role ||
                                            "OTHER"}
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.statusBadge
                                    }
                                >
                                    <Text
                                        style={
                                            styles.statusText
                                        }
                                    >
                                        {member.status ||
                                            "ACTIVE"}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.cardLine} />

                            <View style={styles.infoRow}>
                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    📱 Phone
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {member.phone || "-"}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    🏗️ Project
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    #{member.project_id}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    💰 Daily Wage
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {member.daily_wage
                                        ? `₹${Number(
                                              member.daily_wage
                                          ).toLocaleString(
                                              "en-IN"
                                          )}`
                                        : "-"}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    📅 Joining Date
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {member.joining_date
                                        ? new Date(
                                              member.joining_date
                                          ).toLocaleDateString()
                                        : "-"}
                                </Text>
                            </View>
                        </View>
                    ))
                )}

                <View style={styles.bottomSpace} />
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

    sectionHeader: {
        marginHorizontal: 20,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    sectionTitle: {
        fontSize: 19,
        fontWeight: "900",
        color: "#2B2522",
    },

    sectionSubtitle: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "500",
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
    },

    countBadgeText: {
        fontSize: 13,
        fontWeight: "900",
        color: "#C92A1D",
    },

    memberCard: {
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

    memberIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "#FDE8E5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    memberIcon: {
        fontSize: 23,
    },

    memberTitleBox: {
        flex: 1,
    },

    memberName: {
        fontSize: 17,
        fontWeight: "900",
        color: "#2B2522",
    },

    memberRole: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "700",
        color: "#C92A1D",
    },

    statusBadge: {
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: "#E8F5E9",
    },

    statusText: {
        fontSize: 9,
        fontWeight: "900",
        color: "#2E7D32",
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