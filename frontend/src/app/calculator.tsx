import React, { useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { router } from "expo-router";
import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

type CalculatorType =
    | "concrete"
    | "brick"
    | "steel"
    | "area"
    | "cost";

export default function CalculatorScreen() {
    const [type, setType] =
        useState<CalculatorType>("concrete");

    const [length, setLength] = useState("");
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [quantity, setQuantity] = useState("");
    const [rate, setRate] = useState("");

    const reset = () => {
        setLength("");
        setWidth("");
        setHeight("");
        setQuantity("");
        setRate("");
    };

    const result = useMemo(() => {
        const l = Number(length);
        const w = Number(width);
        const h = Number(height);
        const q = Number(quantity);
        const r = Number(rate);

        if (type === "concrete") {
            if (!l || !w || !h) return null;

            const volume = l * w * h;

            return {
                title: "Concrete Volume",
                value: volume.toFixed(2),
                unit: "m³",
                note: "Calculated using Length × Width × Height.",
            };
        }

        if (type === "brick") {
            if (!l || !w || !h) return null;

            const wallVolume = l * w * h;

            const brickVolume =
                0.19 * 0.09 * 0.09;

            const bricks =
                wallVolume / brickVolume;

            return {
                title: "Estimated Bricks",
                value: Math.ceil(bricks).toString(),
                unit: "bricks",
                note: "Approximate calculation including standard brick dimensions.",
            };
        }

        if (type === "steel") {
            if (!l || !q) return null;

            const weightPerMeter =
                (l * l) / 162;

            const totalWeight =
                weightPerMeter * q;

            return {
                title: "Steel Weight",
                value: totalWeight.toFixed(2),
                unit: "kg",
                note: "Approximate steel weight based on diameter and length.",
            };
        }

        if (type === "area") {
            if (!l || !w) return null;

            const area = l * w;

            return {
                title: "Area",
                value: area.toFixed(2),
                unit: "m²",
                note: "Calculated using Length × Width.",
            };
        }

        if (type === "cost") {
            if (!q || !r) return null;

            const total = q * r;

            return {
                title: "Estimated Cost",
                value: total.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                }),
                unit: "₹",
                note: "Quantity × Rate.",
            };
        }

        return null;
    }, [
        type,
        length,
        width,
        height,
        quantity,
        rate,
    ]);

    const calculatorTypes = [
        {
            id: "concrete" as CalculatorType,
            title: "Concrete",
            icon: "🏗️",
        },
        {
            id: "brick" as CalculatorType,
            title: "Bricks",
            icon: "🧱",
        },
        {
            id: "steel" as CalculatorType,
            title: "Steel",
            icon: "🔩",
        },
        {
            id: "area" as CalculatorType,
            title: "Area",
            icon: "📐",
        },
        {
            id: "cost" as CalculatorType,
            title: "Cost",
            icon: "💰",
        },
    ];

    const getInputLabel = () => {
        if (type === "steel") {
            return "Diameter (mm)";
        }

        if (type === "cost") {
            return "Quantity";
        }

        return "Length (m)";
    };

    const calculate = () => {
        if (!result) {
            Alert.alert(
                "Missing Information",
                "Please enter all required values."
            );
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title="Construction Calculator"
                showBack
            />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={
                        styles.content
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    <View style={styles.heroCard}>
                        <View style={styles.heroIcon}>
                            <Text style={styles.heroEmoji}>
                                🧮
                            </Text>
                        </View>

                        <View style={styles.heroText}>
                            <Text style={styles.heroTitle}>
                                Smart Construction Calculator
                            </Text>

                            <Text style={styles.heroSubtitle}>
                                Quickly estimate quantities,
                                measurements and construction
                                costs.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>
                        Select Calculator
                    </Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={
                            false
                        }
                        contentContainerStyle={
                            styles.typeRow
                        }
                    >
                        {calculatorTypes.map(
                            (item) => {
                                const active =
                                    type === item.id;

                                return (
                                    <Pressable
                                        key={item.id}
                                        style={[
                                            styles.typeCard,
                                            active &&
                                                styles.typeCardActive,
                                        ]}
                                        onPress={() => {
                                            setType(
                                                item.id
                                            );
                                            reset();
                                        }}
                                    >
                                        <Text
                                            style={
                                                styles.typeIcon
                                            }
                                        >
                                            {item.icon}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.typeTitle,
                                                active &&
                                                    styles.typeTitleActive,
                                            ]}
                                        >
                                            {item.title}
                                        </Text>
                                    </Pressable>
                                );
                            }
                        )}
                    </ScrollView>

                    <View style={styles.formCard}>
                        <Text style={styles.formTitle}>
                            {type === "concrete" &&
                                "Concrete Volume"}

                            {type === "brick" &&
                                "Brick Estimation"}

                            {type === "steel" &&
                                "Steel Weight"}

                            {type === "area" &&
                                "Area Calculation"}

                            {type === "cost" &&
                                "Cost Estimation"}
                        </Text>

                        <Text style={styles.formSubtitle}>
                            Enter the required measurements
                            below.
                        </Text>

                        <Text style={styles.label}>
                            {getInputLabel()}
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder={
                                type === "steel"
                                    ? "Example: 12"
                                    : "Example: 10"
                            }
                            placeholderTextColor="#9A8E88"
                            keyboardType="numeric"
                            value={length}
                            onChangeText={setLength}
                        />

                        {type !== "steel" &&
                            type !== "cost" && (
                                <>
                                    <Text
                                        style={
                                            styles.label
                                        }
                                    >
                                        Width (m)
                                    </Text>

                                    <TextInput
                                        style={
                                            styles.input
                                        }
                                        placeholder="Example: 5"
                                        placeholderTextColor="#9A8E88"
                                        keyboardType="numeric"
                                        value={width}
                                        onChangeText={
                                            setWidth
                                        }
                                    />
                                </>
                            )}

                        {(type === "concrete" ||
                            type === "brick") && (
                            <>
                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    Height (m)
                                </Text>

                                <TextInput
                                    style={
                                        styles.input
                                    }
                                    placeholder="Example: 0.15"
                                    placeholderTextColor="#9A8E88"
                                    keyboardType="numeric"
                                    value={height}
                                    onChangeText={
                                        setHeight
                                    }
                                />
                            </>
                        )}

                        {type === "steel" && (
                            <>
                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    Length (m)
                                </Text>

                                <TextInput
                                    style={
                                        styles.input
                                    }
                                    placeholder="Example: 12"
                                    placeholderTextColor="#9A8E88"
                                    keyboardType="numeric"
                                    value={quantity}
                                    onChangeText={
                                        setQuantity
                                    }
                                />
                            </>
                        )}

                        {type === "cost" && (
                            <>
                                <Text
                                    style={
                                        styles.label
                                    }
                                >
                                    Rate (₹)
                                </Text>

                                <TextInput
                                    style={
                                        styles.input
                                    }
                                    placeholder="Example: 2500"
                                    placeholderTextColor="#9A8E88"
                                    keyboardType="numeric"
                                    value={rate}
                                    onChangeText={
                                        setRate
                                    }
                                />
                            </>
                        )}

                        <View style={styles.buttonRow}>
                            <Pressable
                                style={
                                    styles.resetButton
                                }
                                onPress={reset}
                            >
                                <Text
                                    style={
                                        styles.resetText
                                    }
                                >
                                    Reset
                                </Text>
                            </Pressable>

                            <Pressable
                                style={
                                    styles.calculateButton
                                }
                                onPress={calculate}
                            >
                                <Text
                                    style={
                                        styles.calculateText
                                    }
                                >
                                    Calculate
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {result && (
                        <View
                            style={
                                styles.resultCard
                            }
                        >
                            <Text
                                style={
                                    styles.resultSmall
                                }
                            >
                                RESULT
                            </Text>

                            <Text
                                style={
                                    styles.resultTitle
                                }
                            >
                                {result.title}
                            </Text>

                            <View
                                style={
                                    styles.resultValueRow
                                }
                            >
                                <Text
                                    style={
                                        styles.resultValue
                                    }
                                >
                                    {result.value}
                                </Text>

                                <Text
                                    style={
                                        styles.resultUnit
                                    }
                                >
                                    {result.unit}
                                </Text>
                            </View>

                            <Text
                                style={
                                    styles.resultNote
                                }
                            >
                                {result.note}
                            </Text>
                        </View>
                    )}

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>
                            ⚠️ Important
                        </Text>

                        <Text style={styles.infoText}>
                            These calculations are estimates
                            for planning purposes. Final
                            quantities should be verified by
                            the site engineer or qualified
                            construction professional.
                        </Text>
                    </View>

                    <Pressable
                        style={styles.materialButton}
                        onPress={() =>
                            router.push("/materials")
                        }
                    >
                        <Text
                            style={
                                styles.materialButtonIcon
                            }
                        >
                            🧱
                        </Text>

                        <View style={styles.materialText}>
                            <Text
                                style={
                                    styles.materialTitle
                                }
                            >
                                Check Materials
                            </Text>

                            <Text
                                style={
                                    styles.materialSubtitle
                                }
                            >
                                Open inventory and stock
                                management
                            </Text>
                        </View>

                        <Text style={styles.arrow}>
                            →
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>

            <BottomNavigation active="home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF7F3",
    },

    flex: {
        flex: 1,
    },

    content: {
        padding: 16,
        paddingBottom: 110,
    },

    heroCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#C92A1D",
        borderRadius: 18,
        padding: 18,
        marginBottom: 22,
    },

    heroIcon: {
        width: 58,
        height: 58,
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    heroEmoji: {
        fontSize: 30,
    },

    heroText: {
        flex: 1,
    },

    heroTitle: {
        color: "#FFFFFF",
        fontSize: 19,
        fontWeight: "800",
        marginBottom: 5,
    },

    heroSubtitle: {
        color: "#FDE8E5",
        fontSize: 13,
        lineHeight: 19,
    },

    sectionTitle: {
        color: "#2B2522",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 12,
    },

    typeRow: {
        gap: 10,
        paddingBottom: 18,
    },

    typeCard: {
        width: 100,
        minHeight: 92,
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },

    typeCardActive: {
        backgroundColor: "#FDE8E5",
        borderColor: "#C92A1D",
    },

    typeIcon: {
        fontSize: 27,
        marginBottom: 5,
    },

    typeTitle: {
        color: "#6F625D",
        fontSize: 13,
        fontWeight: "700",
    },

    typeTitleActive: {
        color: "#C92A1D",
    },

    formCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        marginBottom: 16,
    },

    formTitle: {
        color: "#2B2522",
        fontSize: 19,
        fontWeight: "800",
    },

    formSubtitle: {
        color: "#9A8E88",
        fontSize: 13,
        marginTop: 4,
        marginBottom: 18,
    },

    label: {
        color: "#2B2522",
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 7,
        marginTop: 8,
    },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#E6D5D0",
        borderRadius: 12,
        backgroundColor: "#FFFCFA",
        paddingHorizontal: 14,
        color: "#2B2522",
        fontSize: 15,
    },

    buttonRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
    },

    resetButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#C92A1D",
        alignItems: "center",
        justifyContent: "center",
    },

    resetText: {
        color: "#C92A1D",
        fontSize: 15,
        fontWeight: "800",
    },

    calculateButton: {
        flex: 2,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#C92A1D",
        alignItems: "center",
        justifyContent: "center",
    },

    calculateText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },

    resultCard: {
        backgroundColor: "#FFF8F5",
        borderRadius: 18,
        padding: 20,
        borderWidth: 1,
        borderColor: "#E9C3BC",
        marginBottom: 16,
    },

    resultSmall: {
        color: "#C92A1D",
        fontSize: 11,
        fontWeight: "900",
        letterSpacing: 1,
    },

    resultTitle: {
        color: "#2B2522",
        fontSize: 17,
        fontWeight: "800",
        marginTop: 4,
    },

    resultValueRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginTop: 8,
    },

    resultValue: {
        color: "#C92A1D",
        fontSize: 34,
        fontWeight: "900",
    },

    resultUnit: {
        color: "#6F625D",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 8,
    },

    resultNote: {
        color: "#6F625D",
        fontSize: 13,
        lineHeight: 19,
        marginTop: 8,
    },

    infoCard: {
        backgroundColor: "#FFF3E0",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#F5D5A0",
    },

    infoTitle: {
        color: "#A45A00",
        fontSize: 14,
        fontWeight: "800",
        marginBottom: 5,
    },

    infoText: {
        color: "#6F625D",
        fontSize: 12,
        lineHeight: 18,
    },

    materialButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 16,
        padding: 15,
    },

    materialButtonIcon: {
        fontSize: 25,
        marginRight: 12,
    },

    materialText: {
        flex: 1,
    },

    materialTitle: {
        color: "#2B2522",
        fontSize: 15,
        fontWeight: "800",
    },

    materialSubtitle: {
        color: "#9A8E88",
        fontSize: 12,
        marginTop: 3,
    },

    arrow: {
        color: "#C92A1D",
        fontSize: 23,
        fontWeight: "800",
    },
});