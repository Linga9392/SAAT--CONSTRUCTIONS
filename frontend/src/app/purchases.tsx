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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const API_BASE_URL = "http://localhost:5000/api/v1";

type Supplier = {
    id: number;
    supplier_name: string;
    company_name?: string;
};

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

type Purchase = {
    id: number;
    supplier_id: number;
    material_id: number;
    project_id?: number | null;
    supplier_name?: string;
    company_name?: string;
    material_name?: string;
    project_name?: string;
    invoice_number?: string;
    purchase_date: string;
    quantity: number;
    unit: string;
    rate: number;
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    payment_status: string;
    notes?: string;
};

export default function PurchasesScreen() {
    const router = useRouter();

    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] = useState<number | null>(null);

    const [supplierId, setSupplierId] = useState("");
    const [materialId, setMaterialId] = useState("");
    const [projectId, setProjectId] = useState("");

    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [purchaseDate, setPurchaseDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("");
    const [rate, setRate] = useState("");
    const [paidAmount, setPaidAmount] = useState("");
    const [notes, setNotes] = useState("");

    const [showSupplierList, setShowSupplierList] = useState(false);
    const [showMaterialList, setShowMaterialList] = useState(false);
    const [showProjectList, setShowProjectList] = useState(false);

    const selectedSupplier = suppliers.find(
        (item) => String(item.id) === supplierId
    );

    const selectedMaterial = materials.find(
        (item) => String(item.id) === materialId
    );

    const selectedProject = projects.find(
        (item) => String(item.id) === projectId
    );

    const totalAmount = useMemo(() => {
        const qty = Number(quantity) || 0;
        const price = Number(rate) || 0;

        return qty * price;
    }, [quantity, rate]);

    const paid = Number(paidAmount) || 0;

    const pendingAmount = Math.max(
        totalAmount - paid,
        0
    );

    const paymentStatus =
        totalAmount > 0 && paid >= totalAmount
            ? "PAID"
            : paid > 0
                ? "PARTIAL"
                : "PENDING";

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
                purchaseResponse,
                supplierResponse,
                materialResponse,
                projectResponse,
            ] = await Promise.all([
                request("/purchases"),
                request("/suppliers"),
                request("/materials"),
                request("/projects"),
            ]);

            setPurchases(
                purchaseResponse?.data || []
            );

            setSuppliers(
                supplierResponse?.data || []
            );

            setMaterials(
                materialResponse?.data || []
            );

            setProjects(
                projectResponse?.data || []
            );
        } catch (error: any) {
            Alert.alert(
                "Error",
                error.message ||
                "Unable to load purchase data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const clearForm = () => {
        setEditingId(null);
        setSupplierId("");
        setMaterialId("");
        setProjectId("");
        setInvoiceNumber("");
        setPurchaseDate(
            new Date().toISOString().split("T")[0]
        );
        setQuantity("");
        setUnit("");
        setRate("");
        setPaidAmount("");
        setNotes("");

        setShowSupplierList(false);
        setShowMaterialList(false);
        setShowProjectList(false);
    };

    const selectMaterial = (material: Material) => {
        setMaterialId(String(material.id));

        if (material.unit) {
            setUnit(material.unit);
        }

        setShowMaterialList(false);
    };

    const savePurchase = async () => {
        if (!supplierId) {
            Alert.alert(
                "Required",
                "Please select a supplier."
            );
            return;
        }

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

        if (!rate || Number(rate) < 0) {
            Alert.alert(
                "Required",
                "Enter a valid rate."
            );
            return;
        }

        if (paid < 0) {
            Alert.alert(
                "Invalid",
                "Paid amount cannot be negative."
            );
            return;
        }

        if (paid > totalAmount) {
            Alert.alert(
                "Invalid",
                "Paid amount cannot be greater than total amount."
            );
            return;
        }

        try {
            setSaving(true);

            const body = {
                project_id: projectId
                    ? Number(projectId)
                    : null,

                supplier_id: Number(supplierId),

                material_id: Number(materialId),

                invoice_number:
                    invoiceNumber.trim() || null,

                purchase_date:
                    purchaseDate.trim(),

                quantity: Number(quantity),

                unit: unit.trim(),

                rate: Number(rate),

                paid_amount: paid,

                notes:
                    notes.trim() || null,
            };

            if (editingId) {
                await request(
                    `/purchases/${editingId}`,
                    {
                        method: "PATCH",
                        body: JSON.stringify(body),
                    }
                );

                Alert.alert(
                    "Success",
                    "Purchase updated successfully."
                );
            } else {
                await request(
                    "/purchases",
                    {
                        method: "POST",
                        body: JSON.stringify(body),
                    }
                );

                Alert.alert(
                    "Success",
                    "Purchase created successfully."
                );
            }

            clearForm();

            await loadData();
        } catch (error: any) {
            Alert.alert(
                "Error",
                error.message ||
                "Unable to save purchase."
            );
        } finally {
            setSaving(false);
        }
    };

    const editPurchase = (purchase: Purchase) => {
        setEditingId(purchase.id);

        setSupplierId(
            String(purchase.supplier_id)
        );

        setMaterialId(
            String(purchase.material_id)
        );

        setProjectId(
            purchase.project_id
                ? String(purchase.project_id)
                : ""
        );

        setInvoiceNumber(
            purchase.invoice_number || ""
        );

        setPurchaseDate(
            purchase.purchase_date
                ? purchase.purchase_date.split("T")[0]
                : new Date()
                    .toISOString()
                    .split("T")[0]
        );

        setQuantity(
            String(purchase.quantity)
        );

        setUnit(
            purchase.unit || ""
        );

        setRate(
            String(purchase.rate)
        );

        setPaidAmount(
            String(purchase.paid_amount)
        );

        setNotes(
            purchase.notes || ""
        );

        setShowSupplierList(false);
        setShowMaterialList(false);
        setShowProjectList(false);

        ScrollView;
    };

    const deletePurchase = (id: number) => {
        Alert.alert(
            "Delete Purchase",
            "Are you sure you want to delete this purchase?",
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
                                `/purchases/${id}`,
                                {
                                    method: "DELETE",
                                }
                            );

                            Alert.alert(
                                "Success",
                                "Purchase deleted successfully."
                            );

                            if (editingId === id) {
                                clearForm();
                            }

                            await loadData();
                        } catch (error: any) {
                            Alert.alert(
                                "Error",
                                error.message ||
                                "Unable to delete purchase."
                            );
                        }
                    },
                },
            ]
        );
    };

    const totalPurchases = purchases.length;

    const totalValue = purchases.reduce(
        (sum, item) =>
            sum + Number(item.total_amount || 0),
        0
    );

    const totalPaid = purchases.reduce(
        (sum, item) =>
            sum + Number(item.paid_amount || 0),
        0
    );

    const totalPending = purchases.reduce(
        (sum, item) =>
            sum + Number(item.pending_amount || 0),
        0
    );

    const formatMoney = (value: number) => {
        return `₹${value.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
        })}`;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#C92A1D"
                />
                <Text style={styles.loadingText}>
                    Loading purchases...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader
                title="Purchases"
                showBack
                showNotification
            />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.pageTitle}>
                    Purchase Management
                </Text>

                <Text style={styles.pageSubtitle}>
                    Manage suppliers, materials and purchase costs
                </Text>

                <View style={styles.summaryGrid}>
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryIcon}>
                            🧾
                        </Text>

                        <Text style={styles.summaryValue}>
                            {totalPurchases}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Purchases
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryIcon}>
                            💰
                        </Text>

                        <Text style={styles.summaryValue}>
                            {formatMoney(totalValue)}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Total
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryIcon}>
                            ✅
                        </Text>

                        <Text style={styles.summaryValue}>
                            {formatMoney(totalPaid)}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Paid
                        </Text>
                    </View>

                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryIcon}>
                            ⏳
                        </Text>

                        <Text style={styles.summaryValue}>
                            {formatMoney(totalPending)}
                        </Text>

                        <Text style={styles.summaryLabel}>
                            Pending
                        </Text>
                    </View>
                </View>

                <View style={styles.formCard}>
                    <View style={styles.formHeader}>
                        <View>
                            <Text style={styles.formTitle}>
                                {editingId
                                    ? "Edit Purchase"
                                    : "Add Purchase"}
                            </Text>

                            <Text style={styles.formSubtitle}>
                                Purchase automatically adds stock to inventory
                            </Text>
                        </View>

                        {editingId && (
                            <Pressable
                                style={styles.cancelButton}
                                onPress={clearForm}
                            >
                                <Text style={styles.cancelButtonText}>
                                    Cancel
                                </Text>
                            </Pressable>
                        )}
                    </View>

                    <Text style={styles.label}>
                        Supplier *
                    </Text>

                    <Pressable
                        style={styles.selector}
                        onPress={() => {
                            setShowSupplierList(
                                !showSupplierList
                            );
                            setShowMaterialList(false);
                            setShowProjectList(false);
                        }}
                    >
                        <Text
                            style={
                                selectedSupplier
                                    ? styles.selectorText
                                    : styles.placeholder
                            }
                        >
                            {selectedSupplier
                                ? `${selectedSupplier.supplier_name}${selectedSupplier.company_name
                                    ? ` - ${selectedSupplier.company_name}`
                                    : ""
                                }`
                                : "Select Supplier"}
                        </Text>

                        <Text style={styles.arrow}>
                            {showSupplierList
                                ? "▲"
                                : "▼"}
                        </Text>
                    </Pressable>

                    {showSupplierList && (
                        <View style={styles.dropdown}>
                            {suppliers.length === 0 ? (
                                <Text style={styles.emptyDropdown}>
                                    No suppliers found
                                </Text>
                            ) : (
                                suppliers.map(
                                    (supplier) => (
                                        <Pressable
                                            key={supplier.id}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setSupplierId(
                                                    String(
                                                        supplier.id
                                                    )
                                                );
                                                setShowSupplierList(
                                                    false
                                                );
                                            }}
                                        >
                                            <Text
                                                style={
                                                    styles.dropdownTitle
                                                }
                                            >
                                                {
                                                    supplier.supplier_name
                                                }
                                            </Text>

                                            {supplier.company_name && (
                                                <Text
                                                    style={
                                                        styles.dropdownSub
                                                    }
                                                >
                                                    {
                                                        supplier.company_name
                                                    }
                                                </Text>
                                            )}
                                        </Pressable>
                                    )
                                )
                            )}
                        </View>
                    )}

                    <Text style={styles.label}>
                        Material *
                    </Text>

                    <Pressable
                        style={styles.selector}
                        onPress={() => {
                            setShowMaterialList(
                                !showMaterialList
                            );
                            setShowSupplierList(false);
                            setShowProjectList(false);
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

                        <Text style={styles.arrow}>
                            {showMaterialList
                                ? "▲"
                                : "▼"}
                        </Text>
                    </Pressable>

                    {showMaterialList && (
                        <View style={styles.dropdown}>
                            {materials.length === 0 ? (
                                <Text style={styles.emptyDropdown}>
                                    No materials found
                                </Text>
                            ) : (
                                materials.map(
                                    (material) => (
                                        <Pressable
                                            key={material.id}
                                            style={styles.dropdownItem}
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

                    <Text style={styles.label}>
                        Project
                    </Text>

                    <Pressable
                        style={styles.selector}
                        onPress={() => {
                            setShowProjectList(
                                !showProjectList
                            );
                            setShowSupplierList(false);
                            setShowMaterialList(false);
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

                        <Text style={styles.arrow}>
                            {showProjectList
                                ? "▲"
                                : "▼"}
                        </Text>
                    </Pressable>

                    {showProjectList && (
                        <View style={styles.dropdown}>
                            <Pressable
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setProjectId("");
                                    setShowProjectList(false);
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
                                    General purchase
                                </Text>
                            </Pressable>

                            {projects.map(
                                (project) => (
                                    <Pressable
                                        key={project.id}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setProjectId(
                                                String(
                                                    project.id
                                                )
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
                                            {
                                                project.project_name
                                            }
                                        </Text>
                                    </Pressable>
                                )
                            )}
                        </View>
                    )}

                    <Text style={styles.label}>
                        Invoice Number
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={invoiceNumber}
                        onChangeText={setInvoiceNumber}
                        placeholder="Example: INV-1001"
                        placeholderTextColor="#9A8E88"
                    />

                    <Text style={styles.label}>
                        Purchase Date
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={purchaseDate}
                        onChangeText={setPurchaseDate}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#9A8E88"
                    />

                    <View style={styles.row}>
                        <View style={styles.half}>
                            <Text style={styles.label}>
                                Quantity *
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={quantity}
                                onChangeText={setQuantity}
                                keyboardType="decimal-pad"
                                placeholder="100"
                                placeholderTextColor="#9A8E88"
                            />
                        </View>

                        <View style={styles.half}>
                            <Text style={styles.label}>
                                Unit *
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={unit}
                                onChangeText={setUnit}
                                placeholder="bags"
                                placeholderTextColor="#9A8E88"
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.half}>
                            <Text style={styles.label}>
                                Rate *
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={rate}
                                onChangeText={setRate}
                                keyboardType="decimal-pad"
                                placeholder="420"
                                placeholderTextColor="#9A8E88"
                            />
                        </View>

                        <View style={styles.half}>
                            <Text style={styles.label}>
                                Paid Amount
                            </Text>

                            <TextInput
                                style={styles.input}
                                value={paidAmount}
                                onChangeText={setPaidAmount}
                                keyboardType="decimal-pad"
                                placeholder="0"
                                placeholderTextColor="#9A8E88"
                            />
                        </View>
                    </View>

                    <View style={styles.calculationCard}>
                        <View style={styles.calculationRow}>
                            <Text style={styles.calculationLabel}>
                                Total Amount
                            </Text>

                            <Text style={styles.totalAmount}>
                                {formatMoney(totalAmount)}
                            </Text>
                        </View>

                        <View style={styles.calculationRow}>
                            <Text style={styles.calculationLabel}>
                                Paid
                            </Text>

                            <Text style={styles.paidAmount}>
                                {formatMoney(paid)}
                            </Text>
                        </View>

                        <View style={styles.calculationRow}>
                            <Text style={styles.calculationLabel}>
                                Pending
                            </Text>

                            <Text style={styles.pendingAmount}>
                                {formatMoney(pendingAmount)}
                            </Text>
                        </View>

                        <View style={styles.statusRow}>
                            <Text style={styles.calculationLabel}>
                                Status
                            </Text>

                            <View
                                style={[
                                    styles.statusBadge,
                                    paymentStatus ===
                                        "PAID"
                                        ? styles.paidBadge
                                        : paymentStatus ===
                                            "PARTIAL"
                                            ? styles.partialBadge
                                            : styles.pendingBadge,
                                ]}
                            >
                                <Text
                                    style={
                                        styles.statusText
                                    }
                                >
                                    {paymentStatus}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.label}>
                        Notes
                    </Text>

                    <TextInput
                        style={[
                            styles.input,
                            styles.notesInput,
                        ]}
                        value={notes}
                        onChangeText={setNotes}
                        placeholder="Purchase notes..."
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
                        onPress={savePurchase}
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
                                {editingId
                                    ? "Update Purchase"
                                    : "Save Purchase"}
                            </Text>
                        )}
                    </Pressable>
                </View>

                <View style={styles.historyHeader}>
                    <View>
                        <Text style={styles.historyTitle}>
                            Purchase History
                        </Text>

                        <Text style={styles.historySubtitle}>
                            All purchase records
                        </Text>
                    </View>

                    <Pressable
                        style={styles.refreshButton}
                        onPress={loadData}
                    >
                        <Text
                            style={
                                styles.refreshButtonText
                            }
                        >
                            ↻ Refresh
                        </Text>
                    </Pressable>
                </View>

                {purchases.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyIcon}>
                            🧾
                        </Text>

                        <Text style={styles.emptyTitle}>
                            No purchases yet
                        </Text>

                        <Text style={styles.emptyText}>
                            Add your first purchase above.
                        </Text>
                    </View>
                ) : (
                    purchases.map((purchase) => (
                        <View
                            key={purchase.id}
                            style={styles.purchaseCard}
                        >
                            <View style={styles.purchaseTop}>
                                <View
                                    style={
                                        styles.purchaseTitleArea
                                    }
                                >
                                    <Text
                                        style={
                                            styles.purchaseMaterial
                                        }
                                    >
                                        {purchase.material_name ||
                                            "Material"}
                                    </Text>

                                    <Text
                                        style={
                                            styles.purchaseSupplier
                                        }
                                    >
                                        {purchase.supplier_name ||
                                            "Supplier"}
                                        {purchase.company_name
                                            ? ` • ${purchase.company_name}`
                                            : ""}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.statusBadge,
                                        purchase.payment_status ===
                                            "PAID"
                                            ? styles.paidBadge
                                            : purchase.payment_status ===
                                                "PARTIAL"
                                                ? styles.partialBadge
                                                : styles.pendingBadge,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.statusText
                                        }
                                    >
                                        {
                                            purchase.payment_status
                                        }
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.purchaseInfo}>
                                <View style={styles.infoItem}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        Quantity
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {purchase.quantity}{" "}
                                        {purchase.unit}
                                    </Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        Rate
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {formatMoney(
                                            Number(
                                                purchase.rate
                                            )
                                        )}
                                    </Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        Total
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {formatMoney(
                                            Number(
                                                purchase.total_amount
                                            )
                                        )}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.purchaseInfo}>
                                <View style={styles.infoItem}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        Paid
                                    </Text>

                                    <Text
                                        style={
                                            styles.paidText
                                        }
                                    >
                                        {formatMoney(
                                            Number(
                                                purchase.paid_amount
                                            )
                                        )}
                                    </Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        Pending
                                    </Text>

                                    <Text
                                        style={
                                            styles.pendingText
                                        }
                                    >
                                        {formatMoney(
                                            Number(
                                                purchase.pending_amount
                                            )
                                        )}
                                    </Text>
                                </View>

                                <View style={styles.infoItem}>
                                    <Text
                                        style={
                                            styles.infoLabel
                                        }
                                    >
                                        Date
                                    </Text>

                                    <Text
                                        style={
                                            styles.infoValue
                                        }
                                    >
                                        {purchase.purchase_date
                                            ? purchase.purchase_date.split(
                                                "T"
                                            )[0]
                                            : "-"}
                                    </Text>
                                </View>
                            </View>

                            {purchase.project_name && (
                                <View
                                    style={
                                        styles.projectRow
                                    }
                                >
                                    <Text
                                        style={
                                            styles.projectLabel
                                        }
                                    >
                                        Project:
                                    </Text>

                                    <Text
                                        style={
                                            styles.projectValue
                                        }
                                    >
                                        {
                                            purchase.project_name
                                        }
                                    </Text>
                                </View>
                            )}

                            {purchase.invoice_number && (
                                <View
                                    style={
                                        styles.projectRow
                                    }
                                >
                                    <Text
                                        style={
                                            styles.projectLabel
                                        }
                                    >
                                        Invoice:
                                    </Text>

                                    <Text
                                        style={
                                            styles.projectValue
                                        }
                                    >
                                        {
                                            purchase.invoice_number
                                        }
                                    </Text>
                                </View>
                            )}

                            <View
                                style={
                                    styles.purchaseActions
                                }
                            >
                                <Pressable
                                    style={
                                        styles.editButton
                                    }
                                    onPress={() =>
                                        editPurchase(
                                            purchase
                                        )
                                    }
                                >
                                    <Text
                                        style={
                                            styles.editButtonText
                                        }
                                    >
                                        ✏️ Edit
                                    </Text>
                                </Pressable>

                                <Pressable
                                    style={
                                        styles.deleteButton
                                    }
                                    onPress={() =>
                                        deletePurchase(
                                            purchase.id
                                        )
                                    }
                                >
                                    <Text
                                        style={
                                            styles.deleteButtonText
                                        }
                                    >
                                        🗑 Delete
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <BottomNavigation active="finance" />
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
        color: "#6F625D",
        fontSize: 14,
        marginBottom: 18,
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
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        padding: 16,
        marginBottom: 24,
    },

    formHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 14,
    },

    formTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#2B2522",
    },

    formSubtitle: {
        marginTop: 4,
        color: "#6F625D",
        fontSize: 12,
        maxWidth: 250,
    },

    cancelButton: {
        backgroundColor: "#FDE8E5",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },

    cancelButtonText: {
        color: "#C92A1D",
        fontWeight: "700",
        fontSize: 12,
    },

    label: {
        marginTop: 12,
        marginBottom: 6,
        fontSize: 13,
        fontWeight: "700",
        color: "#2B2522",
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
        height: 90,
        paddingTop: 12,
        textAlignVertical: "top",
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
        marginLeft: 8,
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
        fontWeight: "700",
        fontSize: 14,
    },

    dropdownSub: {
        color: "#6F625D",
        fontSize: 12,
        marginTop: 3,
    },

    emptyDropdown: {
        padding: 14,
        color: "#9A8E88",
        textAlign: "center",
    },

    row: {
        flexDirection: "row",
        gap: 10,
    },

    half: {
        flex: 1,
    },

    calculationCard: {
        marginTop: 16,
        backgroundColor: "#FDE8E5",
        borderRadius: 14,
        padding: 14,
    },

    calculationRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 9,
    },

    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 3,
    },

    calculationLabel: {
        color: "#6F625D",
        fontSize: 13,
        fontWeight: "600",
    },

    totalAmount: {
        color: "#C92A1D",
        fontWeight: "800",
        fontSize: 16,
    },

    paidAmount: {
        color: "#2E7D32",
        fontWeight: "800",
        fontSize: 15,
    },

    pendingAmount: {
        color: "#EF8C00",
        fontWeight: "800",
        fontSize: 15,
    },

    statusBadge: {
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 20,
        alignSelf: "flex-start",
    },

    paidBadge: {
        backgroundColor: "#E8F5E9",
    },

    partialBadge: {
        backgroundColor: "#FFF3E0",
    },

    pendingBadge: {
        backgroundColor: "#FFEBEE",
    },

    statusText: {
        fontSize: 10,
        fontWeight: "800",
        color: "#2B2522",
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
        fontWeight: "800",
        fontSize: 15,
    },

    historyHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    historyTitle: {
        color: "#2B2522",
        fontSize: 20,
        fontWeight: "800",
    },

    historySubtitle: {
        marginTop: 3,
        color: "#6F625D",
        fontSize: 12,
    },

    refreshButton: {
        backgroundColor: "#FDE8E5",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },

    refreshButtonText: {
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

    purchaseCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
    },

    purchaseTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    purchaseTitleArea: {
        flex: 1,
        paddingRight: 10,
    },

    purchaseMaterial: {
        color: "#2B2522",
        fontSize: 16,
        fontWeight: "800",
    },

    purchaseSupplier: {
        color: "#6F625D",
        fontSize: 12,
        marginTop: 4,
    },

    purchaseInfo: {
        flexDirection: "row",
        marginTop: 15,
        gap: 8,
    },

    infoItem: {
        flex: 1,
    },

    infoLabel: {
        color: "#9A8E88",
        fontSize: 10,
        fontWeight: "600",
    },

    infoValue: {
        color: "#2B2522",
        fontSize: 12,
        fontWeight: "700",
        marginTop: 3,
    },

    paidText: {
        color: "#2E7D32",
        fontSize: 12,
        fontWeight: "800",
        marginTop: 3,
    },

    pendingText: {
        color: "#EF8C00",
        fontSize: 12,
        fontWeight: "800",
        marginTop: 3,
    },

    projectRow: {
        flexDirection: "row",
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#F5E6E2",
    },

    projectLabel: {
        color: "#9A8E88",
        fontSize: 11,
        marginRight: 5,
    },

    projectValue: {
        flex: 1,
        color: "#2B2522",
        fontSize: 11,
        fontWeight: "700",
    },

    purchaseActions: {
        flexDirection: "row",
        gap: 9,
        marginTop: 14,
    },

    editButton: {
        flex: 1,
        backgroundColor: "#E3F2FD",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
    },

    editButtonText: {
        color: "#1565C0",
        fontSize: 12,
        fontWeight: "800",
    },

    deleteButton: {
        flex: 1,
        backgroundColor: "#FFEBEE",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
    },

    deleteButtonText: {
        color: "#C62828",
        fontSize: 12,
        fontWeight: "800",
    },
});