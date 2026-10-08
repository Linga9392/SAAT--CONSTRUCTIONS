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
import BottomNavigation from "../components/BottomNavigation";

const API_BASE_URL = "http://localhost:5000/api/v1";

type DashboardData = {
    total_projects: string;
    active_projects: string;
    active_members: string;
    today_present: string;
    today_absent: string;
    total_materials: string;
    total_expenses: string;
    total_paid_payroll: string;
};

type StoredUser = {
    id: number;
    full_name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
};

type QuickAccessItem = {
    title: string;
    icon: string;
    route: string;
};

export default function DashboardScreen() {
    const [dashboard, setDashboard] =
        useState<DashboardData | null>(null);

    const [user, setUser] =
        useState<StoredUser | null>(null);

    const [loading, setLoading] =
        useState(true);

    const loadDashboard = async () => {
        try {
            setLoading(true);

            const token =
                await AsyncStorage.getItem(
                    "auth_token"
                );

            const storedUser =
                await AsyncStorage.getItem("user");

            if (!token) {
                await AsyncStorage.removeItem(
                    "auth_token"
                );

                await AsyncStorage.removeItem(
                    "user"
                );

                router.replace("/");
                return;
            }

            if (storedUser) {
                try {
                    setUser(
                        JSON.parse(storedUser)
                    );
                } catch {
                    await AsyncStorage.removeItem(
                        "user"
                    );
                }
            }

            const response = await fetch(
                `${API_BASE_URL}/dashboard/summary`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const text =
                await response.text();

            let data;

            try {
                data = text
                    ? JSON.parse(text)
                    : {};
            } catch {
                throw new Error(
                    "Invalid response received from dashboard API."
                );
            }

            console.log(
                "DASHBOARD STATUS:",
                response.status
            );

            console.log(
                "DASHBOARD RESPONSE:",
                data
            );

            if (response.status === 401) {
                await AsyncStorage.removeItem(
                    "auth_token"
                );

                await AsyncStorage.removeItem(
                    "user"
                );

                router.replace("/");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        data.error ||
                        "Failed to load dashboard"
                );
            }

            setDashboard(
                data?.data || null
            );
        } catch (error) {
            console.error(
                "DASHBOARD ERROR:",
                error
            );

            Alert.alert(
                "Dashboard Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadDashboard();
        }, [])
    );

    const openMenu = () => {
        Alert.alert(
            "SAAT Construction",
            "Menu"
        );
    };

    const openNotifications = () => {
        router.push("/notifications");
    };

    const quickAccess: QuickAccessItem[] = [
        {
            title: "Members",
            icon: "👷",
            route: "/members",
        },
        {
            title: "Attendance",
            icon: "📋",
            route: "/attendance",
        },
        {
            title: "Projects",
            icon: "🏗️",
            route: "/projects",
        },
        {
            title: "Materials",
            icon: "🧱",
            route: "/materials",
        },
        {
            title: "Inventory",
            icon: "📦",
            route: "/inventory",
        },
        {
            title: "Purchases",
            icon: "🧾",
            route: "/purchases",
        },
        {
            title: "Suppliers",
            icon: "🏢",
            route: "/suppliers",
        },
        {
            title: "Calculator",
            icon: "🧮",
            route: "/calculator",
        },
        {
            title: "Site Progress",
            icon: "📈",
            route: "/site-progress",
        },
        {
            title: "Site Reports",
            icon: "📍",
            route: "/site-reports",
        },
        {
            title: "Expenses",
            icon: "💰",
            route: "/expenses",
        },
        {
            title: "Payroll",
            icon: "💵",
            route: "/payroll",
        },
        {
            title: "BOQ / Items",
            icon: "📊",
            route: "/boq",
        },
        {
            title: "Documents",
            icon: "📁",
            route: "/documents",
        },
        {
            title: "Notifications",
            icon: "🔔",
            route: "/notifications",
        },
        {
            title: "Reports",
            icon: "📈",
            route: "/reports",
        },
        {
            title: "Profile",
            icon: "👤",
            route: "/profile",
        },
    ];

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color="#C92A1D"
                />

                <Text style={styles.loadingText}>
                    Loading dashboard...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    styles.content
                }
            >
                <View style={styles.topHeader}>
                    <Pressable
                        style={styles.headerButton}
                        onPress={openMenu}
                    >
                        <Text
                            style={styles.menuIcon}
                        >
                            ☰
                        </Text>
                    </Pressable>

                    <View
                        style={
                            styles.logoContainer
                        }
                    >
                        <Text
                            style={styles.logoMain}
                        >
                            SAAT
                        </Text>

                        <Text
                            style={styles.logoSub}
                        >
                            Construction
                        </Text>
                    </View>

                    <Pressable
                        style={styles.headerButton}
                        onPress={
                            openNotifications
                        }
                    >
                        <Text
                            style={
                                styles.notificationIcon
                            }
                        >
                            🔔
                        </Text>
                    </Pressable>
                </View>

                <View
                    style={styles.headerLine}
                />

                <View
                    style={
                        styles.welcomeSection
                    }
                >
                    <Text
                        style={
                            styles.welcomeText
                        }
                    >
                        Welcome 👋
                    </Text>

                    <Text
                        style={styles.userName}
                        numberOfLines={1}
                    >
                        {user?.full_name ||
                            "User"}
                    </Text>

                    <Text
                        style={styles.appName}
                    >
                        SAAT Construction
                    </Text>

                    <Text
                        style={
                            styles.appSubtitle
                        }
                    >
                        Construction Management
                    </Text>
                </View>

                <View style={styles.statsGrid}>
                    <View
                        style={[
                            styles.statCard,
                            styles.projectCard,
                        ]}
                    >
                        <View
                            style={
                                styles.statIconCircle
                            }
                        >
                            <Text
                                style={
                                    styles.statIcon
                                }
                            >
                                🏗️
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.statNumber
                            }
                        >
                            {dashboard?.total_projects ||
                                "0"}
                        </Text>

                        <Text
                            style={
                                styles.statTitle
                            }
                        >
                            Total Projects
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.statCard,
                            styles.memberCard,
                        ]}
                    >
                        <View
                            style={
                                styles.statIconCircle
                            }
                        >
                            <Text
                                style={
                                    styles.statIcon
                                }
                            >
                                👷
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.statNumber
                            }
                        >
                            {dashboard?.active_members ||
                                "0"}
                        </Text>

                        <Text
                            style={
                                styles.statTitle
                            }
                        >
                            Active Members
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.statCard,
                            styles.attendanceCard,
                        ]}
                    >
                        <View
                            style={
                                styles.statIconCircle
                            }
                        >
                            <Text
                                style={
                                    styles.statIcon
                                }
                            >
                                📋
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.statNumber
                            }
                        >
                            {dashboard?.today_present ||
                                "0"}
                        </Text>

                        <Text
                            style={
                                styles.statTitle
                            }
                        >
                            Present Today
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.statCard,
                            styles.materialCard,
                        ]}
                    >
                        <View
                            style={
                                styles.statIconCircle
                            }
                        >
                            <Text
                                style={
                                    styles.statIcon
                                }
                            >
                                🧱
                            </Text>
                        </View>

                        <Text
                            style={
                                styles.statNumber
                            }
                        >
                            {dashboard?.total_materials ||
                                "0"}
                        </Text>

                        <Text
                            style={
                                styles.statTitle
                            }
                        >
                            Materials
                        </Text>
                    </View>
                </View>

                <View
                    style={styles.sectionHeader}
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Today's Overview
                    </Text>

                    <View
                        style={
                            styles.sectionLine
                        }
                    />
                </View>

                <View
                    style={styles.overviewCard}
                >
                    <View
                        style={
                            styles.overviewRow
                        }
                    >
                        <Text
                            style={
                                styles.overviewLabel
                            }
                        >
                            Active Projects
                        </Text>

                        <Text
                            style={
                                styles.overviewValue
                            }
                        >
                            {dashboard?.active_projects ||
                                "0"}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.overviewDivider
                        }
                    />

                    <View
                        style={
                            styles.overviewRow
                        }
                    >
                        <Text
                            style={
                                styles.overviewLabel
                            }
                        >
                            Absent Today
                        </Text>

                        <Text
                            style={
                                styles.overviewValue
                            }
                        >
                            {dashboard?.today_absent ||
                                "0"}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.overviewDivider
                        }
                    />

                    <View
                        style={
                            styles.overviewRow
                        }
                    >
                        <Text
                            style={
                                styles.overviewLabel
                            }
                        >
                            Total Expenses
                        </Text>

                        <Text
                            style={
                                styles.overviewValue
                            }
                        >
                            ₹
                            {dashboard?.total_expenses ||
                                "0"}
                        </Text>
                    </View>

                    <View
                        style={
                            styles.overviewDivider
                        }
                    />

                    <View
                        style={
                            styles.overviewRow
                        }
                    >
                        <Text
                            style={
                                styles.overviewLabel
                            }
                        >
                            Paid Payroll
                        </Text>

                        <Text
                            style={
                                styles.overviewValue
                            }
                        >
                            ₹
                            {dashboard?.total_paid_payroll ||
                                "0"}
                        </Text>
                    </View>
                </View>

                <View
                    style={styles.sectionHeader}
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Quick Access
                    </Text>

                    <View
                        style={
                            styles.sectionLine
                        }
                    />
                </View>

                <View
                    style={styles.quickGrid}
                >
                    {quickAccess.map(
                        (item) => (
                            <Pressable
                                key={item.title}
                                style={({
                                    pressed,
                                }) => [
                                    styles.quickCard,
                                    pressed &&
                                        styles.quickCardPressed,
                                ]}
                                onPress={() =>
                                    router.push(
                                        item.route as any
                                    )
                                }
                            >
                                <View
                                    style={
                                        styles.quickIconCircle
                                    }
                                >
                                    <Text
                                        style={
                                            styles.quickIcon
                                        }
                                    >
                                        {item.icon}
                                    </Text>
                                </View>

                                <Text
                                    style={
                                        styles.quickTitle
                                    }
                                >
                                    {item.title}
                                </Text>

                                <Text
                                    style={
                                        styles.quickArrow
                                    }
                                >
                                    ›
                                </Text>
                            </Pressable>
                        )
                    )}
                </View>

                <View
                    style={styles.bottomSpace}
                />
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
        color: "#777777",
    },

    topHeader: {
        height: 82,
        paddingHorizontal: 18,
        paddingTop: 24,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#FFF9F4",
    },

    headerButton: {
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
    },

    menuIcon: {
        fontSize: 28,
        color: "#1F1F1F",
    },

    notificationIcon: {
        fontSize: 22,
    },

    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    logoMain: {
        fontSize: 23,
        fontWeight: "900",
        color: "#C92A1D",
        letterSpacing: 1,
    },

    logoSub: {
        marginLeft: 6,
        fontSize: 18,
        fontWeight: "800",
        color: "#222222",
    },

    headerLine: {
        height: 1,
        backgroundColor: "#E5DED8",
    },

    welcomeSection: {
        paddingHorizontal: 22,
        paddingTop: 25,
        paddingBottom: 18,
    },

    welcomeText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#777777",
    },

    userName: {
        marginTop: 4,
        fontSize: 25,
        fontWeight: "900",
        color: "#202020",
    },

    appName: {
        marginTop: 4,
        fontSize: 17,
        fontWeight: "800",
        color: "#C92A1D",
    },

    appSubtitle: {
        marginTop: 5,
        fontSize: 14,
        color: "#777777",
    },

    statsGrid: {
        paddingHorizontal: 18,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    statCard: {
        width: "48%",
        minHeight: 145,
        borderRadius: 20,
        padding: 17,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#E8E2DD",
        justifyContent: "space-between",
    },

    projectCard: {
        backgroundColor: "#FFF1ED",
    },

    memberCard: {
        backgroundColor: "#F0F6EE",
    },

    attendanceCard: {
        backgroundColor: "#FFF7E7",
    },

    materialCard: {
        backgroundColor: "#EEF5FA",
    },

    statIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
    },

    statIcon: {
        fontSize: 22,
    },

    statNumber: {
        marginTop: 8,
        fontSize: 27,
        fontWeight: "900",
        color: "#222222",
    },

    statTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#666666",
    },

    sectionHeader: {
        paddingHorizontal: 22,
        paddingTop: 12,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    sectionTitle: {
        fontSize: 21,
        fontWeight: "900",
        color: "#202020",
    },

    sectionLine: {
        flex: 1,
        height: 1,
        marginLeft: 12,
        backgroundColor: "#E1DAD4",
    },

    overviewCard: {
        marginHorizontal: 18,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: "#E8E3DF",
    },

    overviewRow: {
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    overviewLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: "#6F625D",
    },

    overviewValue: {
        fontSize: 16,
        fontWeight: "900",
        color: "#C92A1D",
    },

    overviewDivider: {
        height: 1,
        backgroundColor: "#EEE8E3",
    },

    quickGrid: {
        paddingHorizontal: 18,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    quickCard: {
        width: "48%",
        minHeight: 125,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#E8E3DF",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.04,
        shadowRadius: 5,
        elevation: 2,
    },

    quickCardPressed: {
        backgroundColor: "#FFF1ED",
    },

    quickIconCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#FFF0EC",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },

    quickIcon: {
        fontSize: 21,
    },

    quickTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: "#222222",
        paddingRight: 18,
    },

    quickArrow: {
        position: "absolute",
        right: 14,
        top: 16,
        fontSize: 25,
        color: "#A0A0A0",
    },

    bottomSpace: {
        height: 20,
    },
});