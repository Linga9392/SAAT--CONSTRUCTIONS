import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { loginUser } from "../services/api";

export default function LoginScreen() {
    const [email, setEmail] =
        useState("karthik@example.com");

    const [password, setPassword] =
        useState("SAAT@1234");

    const [loading, setLoading] =
        useState(false);

    const handleLogin = async () => {
        if (!email.trim()) {
            Alert.alert(
                "Required",
                "Please enter your email address."
            );
            return;
        }

        if (!password.trim()) {
            Alert.alert(
                "Required",
                "Please enter your password."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await loginUser(
                email.trim(),
                password
            );

            if (
                response?.success === true &&
                response?.data?.token
            ) {
                router.replace("/dashboard");
                return;
            }

            throw new Error(
                response?.message ||
                    "Login failed. Please try again."
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to login.";

            Alert.alert(
                "Login Failed",
                message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={[
                    "#A82016",
                    "#C92A1D",
                    "#E05A4F",
                ]}
                style={styles.container}
            >
                <View style={styles.brandSection}>
                    <View style={styles.logoBox}>
                        <Text style={styles.logoText}>
                            SAAT
                        </Text>
                    </View>

                    <Text style={styles.companyName}>
                        SRI AMMA ANNA TEMPLE
                    </Text>

                    <Text style={styles.companyName}>
                        CONSTRUCTION
                    </Text>

                    <View style={styles.line} />

                    <Text style={styles.since}>
                        Since 1974
                    </Text>
                </View>

                <View style={styles.loginCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.title}>
                            Welcome Back
                        </Text>

                        <Text style={styles.subtitle}>
                            Login to continue to SAAT
                            Construction
                        </Text>
                    </View>

                    <Text style={styles.label}>
                        Email Address
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        placeholderTextColor="#9A8E88"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                    />

                    <Text style={styles.label}>
                        Password
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        placeholderTextColor="#9A8E88"
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                    />

                    <Pressable
                        style={({ pressed }) => [
                            styles.loginButton,
                            pressed &&
                                styles.loginButtonPressed,
                            loading &&
                                styles.loginButtonDisabled,
                        ]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator
                                size="small"
                                color="#FFFFFF"
                            />
                        ) : (
                            <Text
                                style={
                                    styles.loginButtonText
                                }
                            >
                                LOGIN
                            </Text>
                        )}
                    </Pressable>

                    <View style={styles.registerSection}>
                        <Text style={styles.registerLabel}>
                            Don't have an account?
                        </Text>

                        <Pressable
                            onPress={() =>
                                router.push("/register")
                            }
                            disabled={loading}
                        >
                            <Text style={styles.registerLink}>
                                Register
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.securityBox}>
                        <Text style={styles.securityIcon}>
                            🔒
                        </Text>

                        <Text style={styles.footerText}>
                            Secure Construction
                            Management System
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 24,
    },

    brandSection: {
        alignItems: "center",
        marginBottom: 24,
    },

    logoBox: {
        width: 78,
        height: 78,
        borderRadius: 22,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 7,
        elevation: 6,
    },

    logoText: {
        fontSize: 25,
        fontWeight: "900",
        color: "#C92A1D",
        letterSpacing: 1,
    },

    companyName: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "900",
        letterSpacing: 1.2,
        textAlign: "center",
    },

    line: {
        width: 64,
        height: 2,
        backgroundColor: "#FFFFFF",
        marginTop: 12,
        marginBottom: 7,
        opacity: 0.9,
    },

    since: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
        opacity: 0.9,
    },

    loginCard: {
        width: "100%",
        maxWidth: 520,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },

    cardHeader: {
        marginBottom: 24,
    },

    title: {
        fontSize: 28,
        fontWeight: "900",
        color: "#2B2522",
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 13,
        lineHeight: 19,
        color: "#6F625D",
    },

    label: {
        fontSize: 13,
        fontWeight: "800",
        color: "#2B2522",
        marginBottom: 8,
    },

    input: {
        width: "100%",
        height: 52,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 15,
        color: "#2B2522",
        backgroundColor: "#FFF8F5",
        marginBottom: 18,
        outlineStyle: "none",
    } as any,

    loginButton: {
        width: "100%",
        height: 52,
        borderRadius: 13,
        backgroundColor: "#C92A1D",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 4,
        shadowColor: "#C92A1D",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },

    loginButtonPressed: {
        opacity: 0.75,
    },

    loginButtonDisabled: {
        opacity: 0.6,
    },

    loginButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "900",
        letterSpacing: 1,
    },

    registerSection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 18,
    },

    registerLabel: {
        fontSize: 12,
        color: "#9A8E88",
        fontWeight: "600",
        marginRight: 5,
    },

    registerLink: {
        fontSize: 13,
        color: "#C92A1D",
        fontWeight: "900",
    },

    securityBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 18,
    },

    securityIcon: {
        fontSize: 13,
        marginRight: 6,
    },

    footerText: {
        fontSize: 11,
        color: "#9A8E88",
        fontWeight: "600",
        textAlign: "center",
    },
});