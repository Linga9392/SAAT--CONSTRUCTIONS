import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const API_BASE_URL = "http://localhost:5000/api/v1";

type UserProfile = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
};

export default function ProfileScreen() {
    const [profile, setProfile] =
        useState<UserProfile | null>(null);

    const [loading, setLoading] =
        useState(true);

    const loadProfile = async () => {
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
                `${API_BASE_URL}/profile`,
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
                        "Failed to load profile"
                );
            }

            setProfile(data.data || null);
        } catch (error) {
            Alert.alert(
                "Profile Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load profile"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem(
                            "auth_token"
                        );

                        await AsyncStorage.removeItem(
                            "user"
                        );

                        router.replace("/");
                    },
                },
            ]
        );
    };

    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [])
    );

    const getInitial = () => {
        return (
            profile?.full_name
                ?.charAt(0)
                ?.toUpperCase() || "U"
        );
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
                    Loading Profile
                </Text>

                <Text style={styles.loadingText}>
                    Getting your account details...
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
                            My Account
                        </Text>

                        <Text style={styles.subtitle}>
                            Manage your profile information
                        </Text>
                    </View>

                    <View style={styles.headerIconCircle}>
                        <Text style={styles.headerIcon}>
                            👤
                        </Text>
                    </View>
                </View>

                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {getInitial()}
                            </Text>
                        </View>

                        <View style={styles.onlineDot} />
                    </View>

                    <Text style={styles.name}>
                        {profile?.full_name || "User"}
                    </Text>

                    <View style={styles.roleBadge}>
                        <Text style={styles.roleBadgeText}>
                            {profile?.role || "USER"}
                        </Text>
                    </View>

                    <View style={styles.statusRow}>
                        <View style={styles.statusDot} />

                        <Text style={styles.statusText}>
                            {profile?.status || "ACTIVE"}
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            Personal Information
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Your account details
                        </Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View
                            style={[
                                styles.infoIconCircle,
                                styles.nameIcon,
                            ]}
                        >
                            <Text style={styles.infoIcon}>
                                👤
                            </Text>
                        </View>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>
                                Full Name
                            </Text>

                            <Text style={styles.value}>
                                {profile?.full_name || "-"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View
                            style={[
                                styles.infoIconCircle,
                                styles.emailIcon,
                            ]}
                        >
                            <Text style={styles.infoIcon}>
                                ✉️
                            </Text>
                        </View>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>
                                Email Address
                            </Text>

                            <Text
                                style={styles.value}
                                numberOfLines={2}
                            >
                                {profile?.email || "-"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View
                            style={[
                                styles.infoIconCircle,
                                styles.phoneIcon,
                            ]}
                        >
                            <Text style={styles.infoIcon}>
                                📱
                            </Text>
                        </View>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>
                                Phone Number
                            </Text>

                            <Text style={styles.value}>
                                {profile?.phone || "-"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View
                            style={[
                                styles.infoIconCircle,
                                styles.roleIcon,
                            ]}
                        >
                            <Text style={styles.infoIcon}>
                                🏗️
                            </Text>
                        </View>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>
                                Role
                            </Text>

                            <Text style={styles.value}>
                                {profile?.role || "-"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <View
                            style={[
                                styles.infoIconCircle,
                                styles.statusIcon,
                            ]}
                        >
                            <Text style={styles.infoIcon}>
                                ✓
                            </Text>
                        </View>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>
                                Account Status
                            </Text>

                            <Text style={styles.activeStatus}>
                                {profile?.status || "-"}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.accountCard}>
                    <View style={styles.accountHeader}>
                        <View style={styles.accountHeaderInfo}>
                            <Text style={styles.accountTitle}>
                                Account Actions
                            </Text>

                            <Text style={styles.accountSubtitle}>
                                Manage your account
                            </Text>
                        </View>

                        <View style={styles.accountIconCircle}>
                            <Text style={styles.accountIcon}>
                                ⚙️
                            </Text>
                        </View>
                    </View>

                    <View style={styles.actionDivider} />

                    <Pressable
                        style={({ pressed }) => [
                            styles.actionRow,
                            pressed && styles.pressed,
                        ]}
                        onPress={() =>
                            Alert.alert(
                                "Edit Profile",
                                "Profile editing can be added later."
                            )
                        }
                    >
                        <View
                            style={[
                                styles.actionIconCircle,
                                styles.editIcon,
                            ]}
                        >
                            <Text style={styles.actionIcon}>
                                ✏️
                            </Text>
                        </View>

                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>
                                Edit Profile
                            </Text>

                            <Text style={styles.actionSubtitle}>
                                Update your personal details
                            </Text>
                        </View>

                        <Text style={styles.arrow}>
                            ›
                        </Text>
                    </Pressable>

                    <View style={styles.actionDivider} />

                    <Pressable
                        style={({ pressed }) => [
                            styles.actionRow,
                            pressed && styles.pressed,
                        ]}
                        onPress={handleLogout}
                    >
                        <View
                            style={[
                                styles.actionIconCircle,
                                styles.logoutIcon,
                            ]}
                        >
                            <Text style={styles.actionIcon}>
                                🚪
                            </Text>
                        </View>

                        <View style={styles.actionContent}>
                            <Text style={styles.logoutTitle}>
                                Logout
                            </Text>

                            <Text style={styles.actionSubtitle}>
                                Sign out from your account
                            </Text>
                        </View>

                        <Text style={styles.arrow}>
                            ›
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>
                        SRI AMMA ANNA TEMPLE CONSTRUCTION
                    </Text>

                    <Text style={styles.footerSince}>
                        Since 1974
                    </Text>
                </View>

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
        textAlign: "center",
    },

    pageHeader: {
        paddingHorizontal: 20,
        paddingTop: 22,
        paddingBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    pageHeaderInfo: {
        flex: 1,
        paddingRight: 12,
    },

    title: {
        fontSize: 29,
        fontWeight: "900",
        color: "#2B2522",
    },

    subtitle: {
        marginTop: 5,
        fontSize: 13,
        lineHeight: 19,
        color: "#6F625D",
    },

    headerIconCircle: {
        width: 52,
        height: 52,
        borderRadius: 18,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    headerIcon: {
        fontSize: 25,
    },

    profileCard: {
        marginHorizontal: 18,
        marginBottom: 24,
        paddingVertical: 26,
        paddingHorizontal: 18,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        alignItems: "center",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },

    avatarContainer: {
        position: "relative",
        marginBottom: 13,
    },

    avatar: {
        width: 94,
        height: 94,
        borderRadius: 47,
        backgroundColor: "#FDE8E5",
        borderWidth: 3,
        borderColor: "#F6D0CA",
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        fontSize: 38,
        fontWeight: "900",
        color: "#C92A1D",
    },

    onlineDot: {
        position: "absolute",
        right: 2,
        bottom: 4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#2E7D32",
        borderWidth: 3,
        borderColor: "#FFFFFF",
    },

    name: {
        fontSize: 24,
        fontWeight: "900",
        color: "#2B2522",
        textAlign: "center",
    },

    roleBadge: {
        marginTop: 8,
        paddingHorizontal: 13,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: "#FDE8E5",
    },

    roleBadgeText: {
        fontSize: 10,
        fontWeight: "900",
        color: "#C92A1D",
    },

    statusRow: {
        marginTop: 9,
        flexDirection: "row",
        alignItems: "center",
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#2E7D32",
        marginRight: 6,
    },

    statusText: {
        fontSize: 12,
        color: "#2E7D32",
        fontWeight: "800",
    },

    sectionHeader: {
        marginHorizontal: 20,
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
        color: "#9A8E88",
    },

    infoCard: {
        marginHorizontal: 18,
        marginBottom: 24,
        paddingHorizontal: 17,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F1D6D0",
    },

    infoRow: {
        minHeight: 75,
        flexDirection: "row",
        alignItems: "center",
    },

    infoIconCircle: {
        width: 43,
        height: 43,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },

    nameIcon: {
        backgroundColor: "#FDE8E5",
    },

    emailIcon: {
        backgroundColor: "#F1EEFF",
    },

    phoneIcon: {
        backgroundColor: "#E8F5E9",
    },

    roleIcon: {
        backgroundColor: "#FFF3E0",
    },

    statusIcon: {
        backgroundColor: "#E8F5E9",
    },

    infoIcon: {
        fontSize: 18,
    },

    infoContent: {
        flex: 1,
        marginLeft: 13,
    },

    label: {
        fontSize: 11,
        color: "#9A8E88",
        fontWeight: "700",
    },

    value: {
        marginTop: 4,
        fontSize: 15,
        color: "#2B2522",
        fontWeight: "800",
    },

    activeStatus: {
        marginTop: 4,
        fontSize: 15,
        color: "#2E7D32",
        fontWeight: "900",
    },

    divider: {
        height: 1,
        backgroundColor: "#F1ECE8",
    },

    accountCard: {
        marginHorizontal: 18,
        marginBottom: 22,
        paddingHorizontal: 17,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F1D6D0",
    },

    accountHeader: {
        paddingTop: 17,
        paddingBottom: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    accountHeaderInfo: {
        flex: 1,
        paddingRight: 10,
    },

    accountTitle: {
        fontSize: 17,
        fontWeight: "900",
        color: "#2B2522",
    },

    accountSubtitle: {
        marginTop: 3,
        fontSize: 11,
        color: "#9A8E88",
    },

    accountIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    accountIcon: {
        fontSize: 18,
    },

    actionRow: {
        minHeight: 72,
        flexDirection: "row",
        alignItems: "center",
    },

    pressed: {
        opacity: 0.65,
    },

    actionIconCircle: {
        width: 43,
        height: 43,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
    },

    editIcon: {
        backgroundColor: "#FFF3E0",
    },

    logoutIcon: {
        backgroundColor: "#FFEBEE",
    },

    actionIcon: {
        fontSize: 18,
    },

    actionContent: {
        flex: 1,
        marginLeft: 13,
    },

    actionTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: "#2B2522",
    },

    logoutTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: "#C92A1D",
    },

    actionSubtitle: {
        marginTop: 3,
        fontSize: 11,
        color: "#9A8E88",
    },

    arrow: {
        fontSize: 28,
        color: "#AAA09A",
        marginLeft: 8,
    },

    actionDivider: {
        height: 1,
        backgroundColor: "#F1ECE8",
    },

    footer: {
        marginHorizontal: 18,
        paddingVertical: 18,
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

    bottomSpace: {
        height: 20,
    },
});