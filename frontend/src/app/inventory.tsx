import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const API_BASE_URL = "http://localhost:5000/api/v1";

type Material = {
    id: number;
    material_name: string;
    category?: string;
    unit?: string;
};

type Project = {
    id: number;
    project_name: string;
};

type StockItem = {
    material_id: number;
    material_name: string;
    category?: string;
    material_unit?: string;
    total_stock_in: number;
    total_stock_out: number;
    current_stock: number;
};

type InventoryTransaction = {
    id: number;
    material_id: number;
    material_name?: string;
    project_name?: string;
    transaction_type: "STOCK_IN" | "STOCK_OUT";
    quantity: number;
    unit: string;
    rate: number;
    notes?: string;
    transaction_date: string;
};

export default function InventoryScreen() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [stock, setStock] = useState<StockItem[]>([]);
    const [transactions, setTransactions] = useState<
        InventoryTransaction[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [transactionType, setTransactionType] =
        useState<"STOCK_IN" | "STOCK_OUT">("STOCK_IN");

    const [materialId, setMaterialId] = useState("");
    const [projectId, setProjectId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [rate, setRate] = useState("");
    const [notes, setNotes] = useState("");

    const [showMaterialList, setShowMaterialList] =
        useState(false);

    const [showProjectList, setShowProjectList] =
        useState(false);

    const selectedMaterial = materials.find(
        (item) => String(item.id) === materialId
    );

    const selectedProject = projects.find(
        (item) => String(item.id) === projectId
    );

    const selectedStock = stock.find(
        (item) =>
            Number(item.material_id) ===
            Number(materialId)
    );

    const totalStock = useMemo(() => {
        return stock.reduce(
            (sum, item) =>
                sum + Number(item.current_stock || 0),
            0
        );
    }, [stock]);

    const lowStockCount = useMemo(() => {
        return stock.filter(
            (item) =>
                Number(item.current_stock) <= 10
        ).length;
    }, [stock]);

    const request = async (
        endpoint: string,
        options: RequestInit = {}
    ) => {
        const token =
            await AsyncStorage.getItem("auth_token");

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...(options.headers || {}),
                },
            }
        );

        const text = await response.text();

        let data: any = {};

        try {
            data = text ? JSON.parse(text) : {};
        } catch {
            throw new Error(
                "Server returned invalid response."
            );
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                    data.error ||
                    `Request failed with status ${response.status}`
            );
        }

        return data;
    };

    const loadData = async () => {
        try {
            setLoading(true);

            const [
                materialResponse,
                projectResponse,
                stockResponse,
                transactionResponse,
            ] = await Promise.all([
                request("/materials"),
                request("/projects"),
                request("/inventory/stock"),
                request("/inventory"),
            ]);

            setMaterials(
                materialResponse?.data || []
            );

            setProjects(
                projectResponse?.data || []
            );

            setStock(
                stockResponse?.data || []
            );

            setTransactions(
                transactionResponse?.data || []
            );
        } catch (error: any) {
            Alert.alert(
                "Error",
                error.message ||
                    "Unable to load inventory."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const selectMaterial = (
        material: Material
    ) => {
        setMaterialId(
            String(material.id)
        );

        if (material.unit) {
            setUnit(material.unit);
        }

        setShowMaterialList(false);
    };

    const selectProject = (
        project: Project
    ) => {
        setProjectId(
            String(project.id)
        );

        setShowProjectList(false);
    };

    const clearForm = () => {
        setMaterialId("");
        setProjectId("");
        setQuantity("");
        setUnit("");
        setRate("");
        setNotes("");

        setShowMaterialList(false);
        setShowProjectList(false);
    };

    const saveTransaction = async () => {
        if (!materialId) {
            Alert.alert(
                "Required",
                "Please select a material."
            );
            return;
        }

        if (!quantity || Number(quantity) <= 0) {
            Alert.alert(
                "Required",
                "Enter a valid quantity."
            );
            return;
        }

        if (!unit.trim()) {
            Alert.alert(
                "Required",
                "Enter the unit."
            );
            return;
        }

        if (Number(rate) < 0) {
            Alert.alert(
                "Invalid",
                "Rate cannot be negative."
            );
            return;
        }

        if (
            transactionType ===
                "STOCK_OUT" &&
            selectedStock &&
            Number(quantity) >
                Number(selectedStock.current_stock)
        ) {
            Alert.alert(
                "Insufficient Stock",
                `Available stock: ${selectedStock.current_stock} ${selectedStock.material_unit || unit}`
            );
            return;
        }

        try {
            setSaving(true);

            await request(
                "/inventory",
                {
                    method: "POST",
                    body: JSON.stringify({
                        project_id:
                            projectId
                                ? Number(projectId)
                                : null,

                        material_id:
                            Number(materialId),

                        transaction_type:
                            transactionType,

                        quantity:
                            Number(quantity),

                        unit:
                            unit.trim(),

                        rate:
                            Number(rate) || 0,

                        reference_type:
                            "MANUAL",

                        reference_id:
                            null,

                        notes:
                            notes.trim() || null,

                        transaction_date:
                            new Date()
                                .toISOString()
                                .split("T")[0],
                    }),
                }
            );

            Alert.alert(
                "Success",
                transactionType ===
                    "STOCK_IN"
                    ? "Stock added successfully."
                    : "Stock issued successfully."
            );

            clearForm();

            await loadData();
        } catch (error: any) {
            Alert.alert(
                "Error",
                error.message ||
                    "Unable to save inventory transaction."
            );
        } finally {
            setSaving(false);
        }
    };

    const deleteTransaction = (
        id: number
    ) => {
        Alert.alert(
            "Delete Transaction",
            "Are you sure you want to delete this inventory transaction?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await request(
                                `/inventory/${id}`,
                                {
                                    method: "DELETE",
                                }
                            );

                            Alert.alert(
                                "Success",
                                "Transaction deleted successfully."
                            );

                            await loadData();
                        } catch (
                            error: any
                        ) {
                            Alert.alert(
                                "Error",
                                error.message ||
                                    "Unable to delete transaction."
                            );
                        }
                    },
                },
            ]
        );
    };

    const formatNumber = (
        value: number
    ) => {
        return Number(value || 0).toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2,
            }
        );
    };

    if (loading) {
        return (
            <View
                style={
                    styles.loadingContainer
                }
            >
                <ActivityIndicator
                    size="large"
                    color="#C92A1D"
                />

                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Loading inventory...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader
                title="Inventory"
                showBack
                showNotification
            />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={
                    styles.content
                }
                keyboardShouldPersistTaps="handled"
            >
                <Text
                    style={styles.pageTitle}
                >
                    Inventory Management
                </Text>

                <Text
                    style={styles.pageSubtitle}
                >
                    Track material stock received and issued
                </Text>

                <View
                    style={styles.summaryGrid}
                >
                    <View
                        style={
                            styles.summaryCard
                        }
                    >
                        <Text
                            style={
                                styles.summaryIcon
                            }
                        >
                            📦
                        </Text>

                        <Text
                            style={
                                styles.summaryValue
                            }
                        >
                            {stock.length}
                        </Text>

                        <Text
                            style={
                                styles.summaryLabel
                            }
                        >
                            Materials
                        </Text>
                    </View>

                    <View
                        style={
                            styles.summaryCard
                        }
                    >
                        <Text
                            style={
                                styles.summaryIcon
                            }
                        >
                            📊
                        </Text>

                        <Text
                            style={
                                styles.summaryValue
                            }
                        >
                            {formatNumber(
                                totalStock
                            )}
                        </Text>

                        <Text
                            style={
                                styles.summaryLabel
                            }
                        >
                            Current Stock
                        </Text>
                    </View>

                    <View
                        style={
                            styles.summaryCard
                        }
                    >
                        <Text
                            style={
                                styles.summaryIcon
                            }
                        >
                            ⚠️
                        </Text>

                        <Text
                            style={[
                                styles.summaryValue,
                                {
                                    color:
                                        "#EF8C00",
                                },
                            ]}
                        >
                            {lowStockCount}
                        </Text>

                        <Text
                            style={
                                styles.summaryLabel
                            }
                        >
                            Low Stock
                        </Text>
                    </View>

                    <View
                        style={
                            styles.summaryCard
                        }
                    >
                        <Text
                            style={
                                styles.summaryIcon
                            }
                        >
                            🔄
                        </Text>

                        <Text
                            style={
                                styles.summaryValue
                            }
                        >
                            {
                                transactions.length
                            }
                        </Text>

                        <Text
                            style={
                                styles.summaryLabel
                            }
                        >
                            Transactions
                        </Text>
                    </View>
                </View>

                <View
                    style={styles.formCard}
                >
                    <Text
                        style={styles.formTitle}
                    >
                        Stock Transaction
                    </Text>

                    <Text
                        style={styles.formSubtitle}
                    >
                        Add received stock or issue material to site
                    </Text>

                    <Text
                        style={styles.label}
                    >
                        Transaction Type
                    </Text>

                    <View
                        style={styles.typeRow}
                    >
                        <Pressable
                            style={[
                                styles.typeButton,
                                transactionType ===
                                    "STOCK_IN" &&
                                    styles.activeTypeButton,
                            ]}
                            onPress={() =>
                                setTransactionType(
                                    "STOCK_IN"
                                )
                            }
                        >
                            <Text
                                style={[
                                    styles.typeButtonText,
                                    transactionType ===
                                        "STOCK_IN" &&
                                        styles.activeTypeText,
                                ]}
                            >
                                📥 Stock In
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[
                                styles.typeButton,
                                transactionType ===
                                    "STOCK_OUT" &&
                                    styles.activeOutButton,
                            ]}
                            onPress={() =>
                                setTransactionType(
                                    "STOCK_OUT"
                                )
                            }
                        >
                            <Text
                                style={[
                                    styles.typeButtonText,
                                    transactionType ===
                                        "STOCK_OUT" &&
                                        styles.activeOutText,
                                ]}
                            >
                                📤 Stock Out
                            </Text>
                        </Pressable>
                    </View>

                    <Text
                        style={styles.label}
                    >
                        Material *
                    </Text>

                    <Pressable
                        style={
                            styles.selector
                        }
                        onPress={() => {
                            setShowMaterialList(
                                !showMaterialList
                            );

                            setShowProjectList(
                                false
                            );
                        }}
                    >
                        <Text
                            style={
                                selectedMaterial
                                    ? styles.selectorText
                                    : styles.placeholder
                            }
                        >
                            {selectedMaterial
                                ? selectedMaterial.material_name
                                : "Select Material"}
                        </Text>

                        <Text
                            style={styles.arrow}
                        >
                            {showMaterialList
                                ? "▲"
                                : "▼"}
                        </Text>
                    </Pressable>

                    {showMaterialList && (
                        <View
                            style={
                                styles.dropdown
                            }
                        >
                            {materials.length ===
                            0 ? (
                                <Text
                                    style={
                                        styles.emptyDropdown
                                    }
                                >
                                    No materials found
                                </Text>
                            ) : (
                                materials.map(
                                    (
                                        material
                                    ) => (
                                        <Pressable
                                            key={
                                                material.id
                                            }
                                            style={
                                                styles.dropdownItem
                                            }
                                            onPress={() =>
                                                selectMaterial(
                                                    material
                                                )
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.dropdownTitle
                                                }
                                            >
                                                {
                                                    material.material_name
                                                }
                                            </Text>

                                            <Text
                                                style={
                                                    styles.dropdownSub
                                                }
                                            >
                                                {material.category ||
                                                    "Material"}

                                                {material.unit
                                                    ? ` • ${material.unit}`
                                                    : ""}
                                            </Text>
                                        </Pressable>
                                    )
                                )
                            )}
                        </View>
                    )}

                    {selectedStock && (
                        <View
                            style={
                                styles.availableStockCard
                            }
                        >
                            <Text
                                style={
                                    styles.availableLabel
                                }
                            >
                                Available Stock
                            </Text>

                            <Text
                                style={
                                    styles.availableValue
                                }
                            >
                                {formatNumber(
                                    Number(
                                        selectedStock.current_stock
                                    )
                                )}{" "}
                                {selectedStock.material_unit ||
                                    unit}
                            </Text>
                        </View>
                    )}

                    <Text
                        style={styles.label}
                    >
                        Project
                    </Text>

                    <Pressable
                        style={
                            styles.selector
                        }
                        onPress={() => {
                            setShowProjectList(
                                !showProjectList
                            );

                            setShowMaterialList(
                                false
                            );
                        }}
                    >
                        <Text
                            style={
                                selectedProject
                                    ? styles.selectorText
                                    : styles.placeholder
                            }
                        >
                            {selectedProject
                                ? selectedProject.project_name
                                : "Select Project (Optional)"}
                        </Text>

                        <Text
                            style={styles.arrow}
                        >
                            {showProjectList
                                ? "▲"
                                : "▼"}
                        </Text>
                    </Pressable>

                    {showProjectList && (
                        <View
                            style={
                                styles.dropdown
                            }
                        >
                            <Pressable
                                style={
                                    styles.dropdownItem
                                }
                                onPress={() => {
                                    setProjectId(
                                        ""
                                    );

                                    setShowProjectList(
                                        false
                                    );
                                }}
                            >
                                <Text
                                    style={
                                        styles.dropdownTitle
                                    }
                                >
                                    No Project
                                </Text>

                                <Text
                                    style={
                                        styles.dropdownSub
                                    }
                                >
                                    General stock
                                </Text>
                            </Pressable>

                            {projects.map(
                                (
                                    project
                                ) => (
                                    <Pressable
                                        key={
                                            project.id
                                        }
                                        style={
                                            styles.dropdownItem
                                        }
                                        onPress={() =>
                                            selectProject(
                                                project
                                            )
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.dropdownTitle
                                            }
                                        >
                                            {
                                                project.project_name
                                            }
                                        </Text>
                                    </Pressable>
                                )
                            )}
                        </View>
                    )}

                    <View
                        style={styles.row}
                    >
                        <View
                            style={styles.half}
                        >
                            <Text
                                style={
                                    styles.label
                                }
                            >
                                Quantity *
                            </Text>

                            <TextInput
                                style={
                                    styles.input
                                }
                                value={
                                    quantity
                                }
                                onChangeText={
                                    setQuantity
                                }
                                keyboardType="decimal-pad"
                                placeholder="100"
                                placeholderTextColor="#9A8E88"
                            />
                        </View>

                        <View
                            style={styles.half}
                        >
                            <Text
                                style={
                                    styles.label
                                }
                            >
                                Unit *
                            </Text>

                            <TextInput
                                style={
                                    styles.input
                                }
                                value={
                                    unit
                                }
                                onChangeText={
                                    setUnit
                                }
                                placeholder="bags"
                                placeholderTextColor="#9A8E88"
                            />
                        </View>
                    </View>

                    <Text
                        style={styles.label}
                    >
                        Rate
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={rate}
                        onChangeText={setRate}
                        keyboardType="decimal-pad"
                        placeholder="420"
                        placeholderTextColor="#9A8E88"
                    />

                    <Text
                        style={styles.label}
                    >
                        Notes
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            styles.notesInput,
                        ]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Example: Received from supplier"
                        placeholderTextColor="#9A8E88"
                        multiline
                        numberOfLines={4}
                    />

                    <Pressable
                        style={[
                            styles.saveButton,
                            saving &&
                                styles.disabledButton,
                        ]}
                        onPress={
                            saveTransaction
                        }
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator
                                color="#FFFFFF"
                            />
                        ) : (
                            <Text
                                style={
                                    styles.saveButtonText
                                }
                            >
                                {transactionType ===
                                    "STOCK_IN"
                                    ? "Add Stock"
                                    : "Issue Stock"}
                            </Text>
                        )}
                    </Pressable>

                    <Pressable
                        style={
                            styles.clearButton
                        }
                        onPress={
                            clearForm
                        }
                    >
                        <Text
                            style={
                                styles.clearButtonText
                            }
                        >
                            Clear
                        </Text>
                    </Pressable>
                </View>

                <Text
                    style={styles.sectionTitle}
                >
                    Current Stock
                </Text>

                {stock.length === 0 ? (
                    <View
                        style={
                            styles.emptyCard
                        }
                    >
                        <Text
                            style={
                                styles.emptyIcon
                            }
                        >
                            📦
                        </Text>

                        <Text
                            style={
                                styles.emptyTitle
                            }
                        >
                            No stock records
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            Add stock using the form above.
                        </Text>
                    </View>
                ) : (
                    stock.map((item) => (
                        <View
                            key={
                                item.material_id
                            }
                            style={
                                styles.stockCard
                            }
                        >
                            <View
                                style={
                                    styles.stockTop
                                }
                            >
                                <View
                                    style={
                                        styles.stockTitleArea
                                    }
                                >
                                    <Text
                                        style={
                                            styles.stockMaterial
                                        }
                                    >
                                        {
                                            item.material_name
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.stockCategory
                                        }
                                    >
                                        {item.category ||
                                            "Material"}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.stockBadge,
                                        Number(
                                            item.current_stock
                                        ) <=
                                            10 &&
                                            styles.lowStockBadge,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.stockBadgeText
                                        }
                                    >
                                        {Number(
                                            item.current_stock
                                        ) <=
                                        10
                                            ? "LOW"
                                            : "OK"}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={
                                    styles.stockMain
                                }
                            >
                                <Text
                                    style={
                                        styles.stockNumber
                                    }
                                >
                                    {formatNumber(
                                        Number(
                                            item.current_stock
                                        )
                                    )}
                                </Text>

                                <Text
                                    style={
                                        styles.stockUnit
                                    }
                                >
                                    {item.material_unit ||
                                        ""}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.stockDetails
                                }
                            >
                                <Text
                                    style={
                                        styles.stockInText
                                    }
                                >
                                    In:{" "}
                                    {formatNumber(
                                        Number(
                                            item.total_stock_in
                                        )
                                    )}
                                </Text>

                                <Text
                                    style={
                                        styles.stockOutText
                                    }
                                >
                                    Out:{" "}
                                    {formatNumber(
                                        Number(
                                            item.total_stock_out
                                        )
                                    )}
                                </Text>
                            </View>
                        </View>
                    ))
                )}

                <View
                    style={
                        styles.historyHeader
                    }
                >
                    <View>
                        <Text
                            style={
                                styles.sectionTitle
                            }
                        >
                            Transaction History
                        </Text>

                        <Text
                            style={
                                styles.historySubtitle
                            }
                        >
                            Stock in and stock out records
                        </Text>
                    </View>

                    <Pressable
                        style={
                            styles.refreshButton
                        }
                        onPress={
                            loadData
                        }
                    >
                        <Text
                            style={
                                styles.refreshText
                            }
                        >
                            ↻ Refresh
                        </Text>
                    </Pressable>
                </View>

                {transactions.length ===
                0 ? (
                    <View
                        style={
                            styles.emptyCard
                        }
                    >
                        <Text
                            style={
                                styles.emptyIcon
                            }
                        >
                            🔄
                        </Text>

                        <Text
                            style={
                                styles.emptyTitle
                            }
                        >
                            No transactions
                        </Text>
                    </View>
                ) : (
                    transactions.map(
                        (
                            transaction
                        ) => (
                            <View
                                key={
                                    transaction.id
                                }
                                style={
                                    styles.transactionCard
                                }
                            >
                                <View
                                    style={
                                        styles.transactionTop
                                    }
                                >
                                    <View
                                        style={
                                            styles.transactionTitleArea
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.transactionMaterial
                                            }
                                        >
                                            {transaction.material_name ||
                                                "Material"}
                                        </Text>

                                        <Text
                                            style={
                                                styles.transactionProject
                                            }
                                        >
                                            {transaction.project_name ||
                                                "General Stock"}
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.transactionBadge,
                                            transaction.transaction_type ===
                                                "STOCK_IN"
                                                ? styles.stockInBadge
                                                : styles.stockOutBadge,
                                        ]}
                                    >
                                        <Text
                                            style={
                                                styles.transactionBadgeText
                                            }
                                        >
                                            {transaction.transaction_type ===
                                            "STOCK_IN"
                                                ? "STOCK IN"
                                                : "STOCK OUT"}
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={
                                        styles.transactionInfo
                                    }
                                >
                                    <Text
                                        style={
                                            styles.transactionQuantity
                                        }
                                    >
                                        {formatNumber(
                                            Number(
                                                transaction.quantity
                                            )
                                        )}{" "}
                                        {
                                            transaction.unit
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.transactionDate
                                        }
                                    >
                                        {transaction.transaction_date
                                            ? transaction.transaction_date.split(
                                                  "T"
                                              )[0]
                                            : "-"}
                                    </Text>
                                </View>

                                {transaction.notes && (
                                    <Text
                                        style={
                                            styles.transactionNotes
                                        }
                                    >
                                        {
                                            transaction.notes
                                        }
                                    </Text>
                                )}

                                <Pressable
                                    style={
                                        styles.deleteTransactionButton
                                    }
                                    onPress={() =>
                                        deleteTransaction(
                                            transaction.id
                                        )
                                    }
                                >
                                    <Text
                                        style={
                                            styles.deleteTransactionText
                                        }
                                    >
                                        🗑 Delete
                                    </Text>
                                </Pressable>
                            </View>
                        )
                    )
                )}
            </ScrollView>

            <BottomNavigation
                active="finance"
            />
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
        backgroundColor: "#FAF7F3",
        alignItems: "center",
        justifyContent: "center",
    },

    loadingText: {
        marginTop: 12,
        color: "#6F625D",
        fontSize: 14,
    },

    scroll: {
        flex: 1,
    },

    content: {
        padding: 18,
        paddingBottom: 120,
    },

    pageTitle: {
        fontSize: 26,
        fontWeight: "800",
        color: "#2B2522",
    },

    pageSubtitle: {
        marginTop: 5,
        marginBottom: 18,
        color: "#6F625D",
        fontSize: 14,
    },

    summaryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 18,
    },

    summaryCard: {
        width: "48%",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 16,
        padding: 14,
    },

    summaryIcon: {
        fontSize: 22,
    },

    summaryValue: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: "800",
        color: "#2B2522",
    },

    summaryLabel: {
        marginTop: 3,
        color: "#6F625D",
        fontSize: 12,
    },

    formCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 18,
        padding: 16,
        marginBottom: 24,
    },

    formTitle: {
        color: "#2B2522",
        fontSize: 20,
        fontWeight: "800",
    },

    formSubtitle: {
        color: "#6F625D",
        fontSize: 12,
        marginTop: 4,
    },

    label: {
        marginTop: 13,
        marginBottom: 6,
        color: "#2B2522",
        fontSize: 13,
        fontWeight: "700",
    },

    typeRow: {
        flexDirection: "row",
        gap: 10,
    },

    typeButton: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF8F5",
    },

    activeTypeButton: {
        backgroundColor: "#E8F5E9",
        borderColor: "#2E7D32",
    },

    activeOutButton: {
        backgroundColor: "#FFEBEE",
        borderColor: "#C62828",
    },

    typeButtonText: {
        color: "#6F625D",
        fontSize: 13,
        fontWeight: "700",
    },

    activeTypeText: {
        color: "#2E7D32",
    },

    activeOutText: {
        color: "#C62828",
    },

    selector: {
        minHeight: 46,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 11,
        paddingHorizontal: 13,
        backgroundColor: "#FFF8F5",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    selectorText: {
        color: "#2B2522",
        fontSize: 14,
        flex: 1,
    },

    placeholder: {
        color: "#9A8E88",
        fontSize: 14,
    },

    arrow: {
        color: "#C92A1D",
        fontSize: 12,
    },

    dropdown: {
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 11,
        backgroundColor: "#FFFFFF",
        marginTop: 5,
        overflow: "hidden",
    },

    dropdownItem: {
        paddingHorizontal: 13,
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor: "#F5E6E2",
    },

    dropdownTitle: {
        color: "#2B2522",
        fontSize: 14,
        fontWeight: "700",
    },

    dropdownSub: {
        color: "#6F625D",
        fontSize: 12,
        marginTop: 3,
    },

    emptyDropdown: {
        padding: 14,
        textAlign: "center",
        color: "#9A8E88",
    },

    availableStockCard: {
        marginTop: 8,
        padding: 12,
        borderRadius: 11,
        backgroundColor: "#E8F5E9",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    availableLabel: {
        color: "#2E7D32",
        fontSize: 12,
        fontWeight: "600",
    },

    availableValue: {
        color: "#2E7D32",
        fontSize: 15,
        fontWeight: "800",
    },

    row: {
        flexDirection: "row",
        gap: 10,
    },

    half: {
        flex: 1,
    },

    input: {
        height: 46,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 11,
        paddingHorizontal: 13,
        backgroundColor: "#FFF8F5",
        color: "#2B2522",
        fontSize: 14,
    },

    notesInput: {
        height: 85,
        paddingTop: 12,
        textAlignVertical: "top",
    },

    saveButton: {
        marginTop: 18,
        height: 48,
        backgroundColor: "#C92A1D",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    disabledButton: {
        opacity: 0.6,
    },

    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },

    clearButton: {
        marginTop: 9,
        height: 44,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF8F5",
    },

    clearButtonText: {
        color: "#6F625D",
        fontWeight: "700",
    },

    sectionTitle: {
        color: "#2B2522",
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 10,
    },

    stockCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 16,
        padding: 15,
        marginBottom: 11,
    },

    stockTop: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },

    stockTitleArea: {
        flex: 1,
        paddingRight: 10,
    },

    stockMaterial: {
        color: "#2B2522",
        fontSize: 16,
        fontWeight: "800",
    },

    stockCategory: {
        color: "#6F625D",
        fontSize: 11,
        marginTop: 3,
    },

    stockBadge: {
        backgroundColor: "#E8F5E9",
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20,
    },

    lowStockBadge: {
        backgroundColor: "#FFF3E0",
    },

    stockBadgeText: {
        color: "#2E7D32",
        fontSize: 10,
        fontWeight: "800",
    },

    stockMain: {
        flexDirection: "row",
        alignItems: "baseline",
        marginTop: 14,
    },

    stockNumber: {
        color: "#C92A1D",
        fontSize: 28,
        fontWeight: "800",
    },

    stockUnit: {
        marginLeft: 7,
        color: "#6F625D",
        fontSize: 13,
    },

    stockDetails: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#F5E6E2",
    },

    stockInText: {
        color: "#2E7D32",
        fontSize: 12,
        fontWeight: "700",
    },

    stockOutText: {
        color: "#C62828",
        fontSize: 12,
        fontWeight: "700",
    },

    historyHeader: {
        marginTop: 14,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },

    historySubtitle: {
        color: "#6F625D",
        fontSize: 12,
        marginTop: -6,
    },

    refreshButton: {
        backgroundColor: "#FDE8E5",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },

    refreshText: {
        color: "#C92A1D",
        fontSize: 12,
        fontWeight: "700",
    },

    emptyCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 16,
        padding: 30,
        alignItems: "center",
        marginBottom: 15,
    },

    emptyIcon: {
        fontSize: 36,
    },

    emptyTitle: {
        marginTop: 10,
        color: "#2B2522",
        fontSize: 17,
        fontWeight: "800",
    },

    emptyText: {
        marginTop: 5,
        color: "#6F625D",
        fontSize: 13,
    },

    transactionCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 16,
        padding: 15,
        marginBottom: 11,
    },

    transactionTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    transactionTitleArea: {
        flex: 1,
        paddingRight: 8,
    },

    transactionMaterial: {
        color: "#2B2522",
        fontSize: 15,
        fontWeight: "800",
    },

    transactionProject: {
        color: "#6F625D",
        fontSize: 11,
        marginTop: 3,
    },

    transactionBadge: {
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20,
    },

    stockInBadge: {
        backgroundColor: "#E8F5E9",
    },

    stockOutBadge: {
        backgroundColor: "#FFEBEE",
    },

    transactionBadgeText: {
        fontSize: 9,
        fontWeight: "800",
        color: "#2B2522",
    },

    transactionInfo: {
        marginTop: 13,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    transactionQuantity: {
        color: "#C92A1D",
        fontSize: 15,
        fontWeight: "800",
    },

    transactionDate: {
        color: "#6F625D",
        fontSize: 11,
    },

    transactionNotes: {
        color: "#6F625D",
        fontSize: 12,
        marginTop: 9,
    },

    deleteTransactionButton: {
        marginTop: 12,
        backgroundColor: "#FFEBEE",
        borderRadius: 9,
        paddingVertical: 9,
        alignItems: "center",
    },

    deleteTransactionText: {
        color: "#C62828",
        fontSize: 12,
        fontWeight: "800",
    },
});