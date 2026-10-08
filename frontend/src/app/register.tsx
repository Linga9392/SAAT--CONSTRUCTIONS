import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { registerUser } from "../services/api";

export default function RegisterScreen() {
    const [fullName, setFullName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleRegister = async () => {
        if (!fullName.trim()) {
            Alert.alert(
                "Required",
                "Please enter your full name."
            );
            return;
        }

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

        if (
            password.trim().length < 6
        ) {
            Alert.alert(
                "Invalid Password",
                "Password must be at least 6 characters."
            );
            return;
        }

        try {
            setLoading(true);

            await registerUser(
                fullName.trim(),
                email.trim(),
                password,
                phone.trim()
            );

            Alert.alert(
                "Registration Successful",
                "Your account has been created successfully.",
                [
                    {
                        text: "Go to Login",
                        onPress: () =>
                            router.replace("/"),
                    },
                ]
            );
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Unable to register.";

            Alert.alert(
                "Registration Failed",
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
                <KeyboardAvoidingView
                    behavior={
                        Platform.OS === "ios"
                            ? "padding"
                            : undefined
                    }
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={
                            styles.scrollContent
                        }
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View
                            style={styles.brandSection}
                        >
                            <View
                                style={styles.logoBox}
                            >
                                <Text
                                    style={
                                        styles.logoText
                                    }
                                >
                                    SAAT
                                </Text>
                            </View>

                            <Text
                                style={
                                    styles.companyName
                                }
                            >
                                SRI AMMA ANNA TEMPLE
                            </Text>

                            <Text
                                style={
                                    styles.companyName
                                }
                            >
                                CONSTRUCTION
                            </Text>

                            <View
                                style={styles.line}
                            />

                            <Text
                                style={styles.since}
                            >
                                Since 1974
                            </Text>
                        </View>

                        <View
                            style={styles.registerCard}
                        >
                            <View
                                style={
                                    styles.cardHeader
                                }
                            >
                                <Text
                                    style={
                                        styles.title
                                    }
                                >
                                    Create Account
                                </Text>

                                <Text
                                    style={
                                        styles.subtitle
                                    }
                                >
                                    Register for SAAT
                                    Construction
                                </Text>
                            </View>

                            <Text
                                style={styles.label}
                            >
                                Full Name
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                placeholderTextColor="#9A8E88"
                                value={fullName}
                                onChangeText={
                                    setFullName
                                }
                                editable={!loading}
                            />

                            <Text
                                style={styles.label}
                            >
                                Email Address
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#9A8E88"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={email}
                                onChangeText={setEmail}
                                editable={!loading}
                            />

                            <Text
                                style={styles.label}
                            >
                                Phone Number
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Enter your phone number"
                                placeholderTextColor="#9A8E88"
                                keyboardType="phone-pad"
                                value={phone}
                                onChangeText={setPhone}
                                editable={!loading}
                            />

                            <Text
                                style={styles.label}
                            >
                                Password
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Create a password"
                                placeholderTextColor="#9A8E88"
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                                value={password}
                                onChangeText={
                                    setPassword
                                }
                                editable={!loading}
                            />

                            <Pressable
                                style={({
                                    pressed,
                                }) => [
                                    styles.registerButton,
                                    pressed &&
                                        styles.buttonPressed,
                                    loading &&
                                        styles.buttonDisabled,
                                ]}
                                onPress={
                                    handleRegister
                                }
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
                                            styles.buttonText
                                        }
                                    >
                                        REGISTER
                                    </Text>
                                )}
                            </Pressable>

                            <View
                                style={
                                    styles.loginSection
                                }
                            >
                                <Text
                                    style={
                                        styles.loginLabel
                                    }
                                >
                                    Already have an
                                    account?
                                </Text>

                                <Pressable
                                    onPress={() =>
                                        router.replace(
                                            "/"
                                        )
                                    }
                                    disabled={loading}
                                >
                                    <Text
                                        style={
                                            styles.loginLink
                                        }
                                    >
                                        Login
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <View
                            style={
                                styles.securityBox
                            }
                        >
                            <Text
                                style={
                                    styles.securityIcon
                                }
                            >
                                🔒
                            </Text>

                            <Text
                                style={
                                    styles.securityText
                                }
                            >
                                Secure Construction
                                Management System
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
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
    },

    keyboardView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 28,
    },

    brandSection: {
        alignItems: "center",
        marginBottom: 24,
    },

    logoBox: {
        width: 72,
        height: 72,
        borderRadius: 21,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 13,
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
        fontSize: 24,
        fontWeight: "900",
        color: "#C92A1D",
        letterSpacing: 1,
    },

    companyName: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "900",
        letterSpacing: 1.1,
        textAlign: "center",
    },

    line: {
        width: 62,
        height: 2,
        backgroundColor: "#FFFFFF",
        marginTop: 11,
        marginBottom: 6,
        opacity: 0.9,
    },

    since: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
        opacity: 0.9,
    },

    registerCard: {
        width: "100%",
        maxWidth: 520,
        alignSelf: "center",
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
        marginBottom: 23,
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
        marginBottom: 17,
        outlineStyle: "none",
    } as any,

    registerButton: {
        width: "100%",
        height: 52,
        borderRadius: 13,
        backgroundColor: "#C92A1D",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 3,
        shadowColor: "#C92A1D",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },

    buttonPressed: {
        opacity: 0.75,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "900",
        letterSpacing: 1,
    },

    loginSection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 19,
    },

    loginLabel: {
        fontSize: 12,
        color: "#9A8E88",
        fontWeight: "600",
        marginRight: 5,
    },

    loginLink: {
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

    securityText: {
        fontSize: 11,
        color: "#FFFFFF",
        fontWeight: "600",
    },
});