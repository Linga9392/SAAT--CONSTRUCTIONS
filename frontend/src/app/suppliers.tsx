import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";

const API_BASE_URL =
    "http://localhost:5000/api/v1";

type Supplier = {
    id: number;
    supplier_name: string;
    company_name?: string;
    phone?: string;
    email?: string;
    address?: string;
    gst_number?: string;
    material_types?: string;
    status: string;
};

export default function SuppliersScreen() {
    const router = useRouter();

    const [suppliers, setSuppliers] =
        useState<Supplier[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [showForm, setShowForm] =
        useState(false);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [supplierName, setSupplierName] =
        useState("");

    const [companyName, setCompanyName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [address, setAddress] =
        useState("");

    const [gstNumber, setGstNumber] =
        useState("");

    const [materialTypes, setMaterialTypes] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    const getToken = async () => {
        return await AsyncStorage.getItem(
            "auth_token"
        );
    };

    const fetchSuppliers = async () => {
        try {
            const token = await getToken();

            if (!token) {
                router.replace("/");
                return;
            }

            const response = await fetch(
                `${API_BASE_URL}/suppliers`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to load suppliers"
                );
            }

            setSuppliers(
                data.data || []
            );
        } catch (error) {
            Alert.alert(
                "Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load suppliers"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchSuppliers();
        }, [])
    );

    const clearForm = () => {
        setSupplierName("");
        setCompanyName("");
        setPhone("");
        setEmail("");
        setAddress("");
        setGstNumber("");
        setMaterialTypes("");
        setEditingId(null);
    };

    const openAddForm = () => {
        clearForm();
        setShowForm(true);
    };

    const openEditForm = (
        supplier: Supplier
    ) => {
        setEditingId(supplier.id);
        setSupplierName(
            supplier.supplier_name || ""
        );
        setCompanyName(
            supplier.company_name || ""
        );
        setPhone(
            supplier.phone || ""
        );
        setEmail(
            supplier.email || ""
        );
        setAddress(
            supplier.address || ""
        );
        setGstNumber(
            supplier.gst_number || ""
        );
        setMaterialTypes(
            supplier.material_types || ""
        );
        setShowForm(true);
    };

    const submitSupplier = async () => {
        if (!supplierName.trim()) {
            Alert.alert(
                "Validation",
                "Enter supplier name"
            );
            return;
        }

        try {
            setSaving(true);

            const token = await getToken();

            if (!token) {
                router.replace("/");
                return;
            }

            const body = {
                supplier_name:
                    supplierName.trim(),

                company_name:
                    companyName.trim() || null,

                phone:
                    phone.trim() || null,

                email:
                    email.trim()
                        .toLowerCase() || null,

                address:
                    address.trim() || null,

                gst_number:
                    gstNumber.trim() || null,

                material_types:
                    materialTypes.trim() ||
                    null,
            };

            const url = editingId
                ? `${API_BASE_URL}/suppliers/${editingId}`
                : `${API_BASE_URL}/suppliers`;

            const method = editingId
                ? "PATCH"
                : "POST";

            const response = await fetch(
                url,
                {
                    method,
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to save supplier"
                );
            }

            Alert.alert(
                "Success",
                editingId
                    ? "Supplier updated successfully"
                    : "Supplier added successfully"
            );

            clearForm();
            setShowForm(false);

            await fetchSuppliers();
        } catch (error) {
            Alert.alert(
                "Error",
                error instanceof Error
                    ? error.message
                    : "Something went wrong"
            );
        } finally {
            setSaving(false);
        }
    };

    const deleteSupplier = (
        supplier: Supplier
    ) => {
        Alert.alert(
            "Delete Supplier",
            `Delete ${supplier.supplier_name}?`,
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
                            const token =
                                await getToken();

                            if (!token) {
                                router.replace(
                                    "/"
                                );
                                return;
                            }

                            const response =
                                await fetch(
                                    `${API_BASE_URL}/suppliers/${supplier.id}`,
                                    {
                                        method: "DELETE",
                                        headers: {
                                            Authorization:
                                                `Bearer ${token}`,
                                            "Content-Type":
                                                "application/json",
                                        },
                                    }
                                );

                            const data =
                                await response.json();

                            if (!response.ok) {
                                throw new Error(
                                    data.message ||
                                        "Failed to delete supplier"
                                );
                            }

                            Alert.alert(
                                "Success",
                                "Supplier deleted successfully"
                            );

                            await fetchSuppliers();
                        } catch (error) {
                            Alert.alert(
                                "Error",
                                error instanceof Error
                                    ? error.message
                                    : "Failed to delete supplier"
                            );
                        }
                    },
                },
            ]
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
                    Loading suppliers...
                </Text>
            </View>
        );
    }

    return (
        <View
            style={
                styles.container
            }
        >
            <AppHeader
                title="Suppliers"
                showBack
                showNotification
            />

            <ScrollView
                style={
                    styles.scrollView
                }
                contentContainerStyle={
                    styles.content
                }
                refreshControl={
                    <RefreshControl
                        refreshing={
                            refreshing
                        }
                        onRefresh={() => {
                            setRefreshing(
                                true
                            );
                            fetchSuppliers();
                        }}
                        tintColor="#C92A1D"
                    />
                }
            >
                <View
                    style={
                        styles.topRow
                    }
                >
                    <View>
                        <Text
                            style={
                                styles.pageTitle
                            }
                        >
                            Supplier Management
                        </Text>

                        <Text
                            style={
                                styles.pageSubtitle
                            }
                        >
                            Manage construction
                            material suppliers
                        </Text>
                    </View>

                    <Pressable
                        style={
                            styles.addButton
                        }
                        onPress={
                            openAddForm
                        }
                    >
                        <Text
                            style={
                                styles.addButtonText
                            }
                        >
                            + Add
                        </Text>
                    </Pressable>
                </View>

                {showForm && (
                    <View
                        style={
                            styles.formCard
                        }
                    >
                        <View
                            style={
                                styles.formHeader
                            }
                        >
                            <Text
                                style={
                                    styles.formTitle
                                }
                            >
                                {editingId
                                    ? "Edit Supplier"
                                    : "Add Supplier"}
                            </Text>

                            <Pressable
                                onPress={() => {
                                    clearForm();
                                    setShowForm(
                                        false
                                    );
                                }}
                            >
                                <Text
                                    style={
                                        styles.closeText
                                    }
                                >
                                    ✕
                                </Text>
                            </Pressable>
                        </View>

                        <Text
                            style={
                                styles.inputLabel
                            }
                        >
                            Supplier Name *
                        </Text>

                        <TextInput
                            style={
                                styles.input
                            }
                            placeholder="Enter supplier name"
                            placeholderTextColor="#9A8E88"
                            value={
                                supplierName
                            }
                            onChangeText={
                                setSupplierName
                            }
                        />

                        <Text
                            style={
                                styles.inputLabel
                            }
                        >
                            Company Name
                        </Text>

                        <TextInput
                            style={
                                styles.input
                            }
                            placeholder="Enter company name"
                            placeholderTextColor="#9A8E88"
                            value={
                                companyName
                            }
                            onChangeText={
                                setCompanyName
                            }
                        />

                        <Text
                            style={
                                styles.inputLabel
                            }
                        >
                            Phone
                        </Text>

                        <TextInput
                            style={
                                styles.input
                            }
                            placeholder="Enter phone number"
                            placeholderTextColor="#9A8E88"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={
                                setPhone
                            }
                        />

                        <Text
                            style={
                                styles.inputLabel
                            }
                        >
                            Email
                        </Text>

                        <TextInput
                            style={
                                styles.input
                            }
                            placeholder="Enter email"
                            placeholderTextColor="#9A8E88"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={email}
                            onChangeText={
                                setEmail
                            }
                        />

                        <Text
                            style={
                                styles.inputLabel
                            }
                        >
                            Address
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                styles.textArea,
                            ]}
                            placeholder="Enter address"
                            placeholderTextColor="#9A8E88"
                            multiline
                            value={address}
                            onChangeText={
                                setAddress
                            }
                        />

                        <Text
                            style={
                                styles.inputLabel
                            }
                        >
                            GST Number
                        </Text>

                        <TextInput
                            style={
                                styles.input
                            }
                            placeholder="Enter GST number"
                            placeholderTextColor="#9A8E88"
                            autoCapitalize="characters"
                            value={
                                gstNumber
                            }
                            onChangeText={
                                setGstNumber
                            }
                        />

                        <Text
                            style={
                                styles.inputLabel
                            }
                        >
                            Material Types
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                styles.textArea,
                            ]}
                            placeholder="Cement, Steel, Bricks..."
                            placeholderTextColor="#9A8E88"
                            multiline
                            value={
                                materialTypes
                            }
                            onChangeText={
                                setMaterialTypes
                            }
                        />

                        <Pressable
                            style={[
                                styles.saveButton,
                                saving &&
                                    styles.disabledButton,
                            ]}
                            disabled={
                                saving
                            }
                            onPress={
                                submitSupplier
                            }
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
                                        ? "Update Supplier"
                                        : "Save Supplier"}
                                </Text>
                            )}
                        </Pressable>
                    </View>
                )}

                <View
                    style={
                        styles.countCard
                    }
                >
                    <Text
                        style={
                            styles.countIcon
                        }
                    >
                        🏢
                    </Text>

                    <View>
                        <Text
                            style={
                                styles.countValue
                            }
                        >
                            {suppliers.length}
                        </Text>

                        <Text
                            style={
                                styles.countLabel
                            }
                        >
                            Total Suppliers
                        </Text>
                    </View>
                </View>

                <Text
                    style={
                        styles.sectionTitle
                    }
                >
                    Suppliers
                </Text>

                {suppliers.length === 0 ? (
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
                            🏢
                        </Text>

                        <Text
                            style={
                                styles.emptyTitle
                            }
                        >
                            No suppliers yet
                        </Text>

                        <Text
                            style={
                                styles.emptyText
                            }
                        >
                            Add your first
                            construction material
                            supplier.
                        </Text>

                        <Pressable
                            style={
                                styles.emptyButton
                            }
                            onPress={
                                openAddForm
                            }
                        >
                            <Text
                                style={
                                    styles.emptyButtonText
                                }
                            >
                                + Add Supplier
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    suppliers.map(
                        (supplier) => (
                            <View
                                key={
                                    supplier.id
                                }
                                style={
                                    styles.supplierCard
                                }
                            >
                                <View
                                    style={
                                        styles.supplierTop
                                    }
                                >
                                    <View
                                        style={
                                            styles.supplierIcon
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.supplierIconText
                                            }
                                        >
                                            🏢
                                        </Text>
                                    </View>

                                    <View
                                        style={
                                            styles.supplierInfo
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.supplierName
                                            }
                                        >
                                            {
                                                supplier.supplier_name
                                            }
                                        </Text>

                                        {supplier.company_name && (
                                            <Text
                                                style={
                                                    styles.companyName
                                                }
                                            >
                                                {
                                                    supplier.company_name
                                                }
                                            </Text>
                                        )}
                                    </View>

                                    <View
                                        style={[
                                            styles.statusBadge,
                                            supplier.status ===
                                                "ACTIVE"
                                                ? styles.activeBadge
                                                : styles.inactiveBadge,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                supplier.status ===
                                                    "ACTIVE"
                                                    ? styles.activeText
                                                    : styles.inactiveText,
                                            ]}
                                        >
                                            {
                                                supplier.status
                                            }
                                        </Text>
                                    </View>
                                </View>

                                {supplier.phone && (
                                    <Text
                                        style={
                                            styles.detailText
                                        }
                                    >
                                        📞{" "}
                                        {
                                            supplier.phone
                                        }
                                    </Text>
                                )}

                                {supplier.email && (
                                    <Text
                                        style={
                                            styles.detailText
                                        }
                                    >
                                        ✉️{" "}
                                        {
                                            supplier.email
                                        }
                                    </Text>
                                )}

                                {supplier.gst_number && (
                                    <Text
                                        style={
                                            styles.detailText
                                        }
                                    >
                                        GST:{" "}
                                        {
                                            supplier.gst_number
                                        }
                                    </Text>
                                )}

                                {supplier.material_types && (
                                    <Text
                                        style={
                                            styles.materialTypes
                                        }
                                    >
                                        Materials:{" "}
                                        {
                                            supplier.material_types
                                        }
                                    </Text>
                                )}

                                <View
                                    style={
                                        styles.actionRow
                                    }
                                >
                                    <Pressable
                                        style={
                                            styles.editButton
                                        }
                                        onPress={() =>
                                            openEditForm(
                                                supplier
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
                                            deleteSupplier(
                                                supplier
                                            )
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.deleteButtonText
                                            }
                                        >
                                            🗑️ Delete
                                        </Text>
                                    </Pressable>
                                </View>
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

    scrollView: {
        flex: 1,
    },

    content: {
        padding: 16,
        paddingBottom: 110,
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
    },

    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
    },

    pageTitle: {
        fontSize: 21,
        fontWeight: "800",
        color: "#2B2522",
    },

    pageSubtitle: {
        marginTop: 3,
        fontSize: 12,
        color: "#9A8E88",
    },

    addButton: {
        backgroundColor: "#C92A1D",
        paddingHorizontal: 15,
        paddingVertical: 11,
        borderRadius: 10,
    },

    addButtonText: {
        color: "#FFFFFF",
        fontWeight: "800",
    },

    formCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 16,
        padding: 16,
        marginBottom: 15,
    },

    formHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },

    formTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#2B2522",
    },

    closeText: {
        color: "#C92A1D",
        fontSize: 20,
        fontWeight: "800",
    },

    inputLabel: {
        color: "#2B2522",
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 6,
    },

    input: {
        height: 46,
        borderWidth: 1,
        borderColor: "#E6D3CD",
        borderRadius: 10,
        paddingHorizontal: 12,
        color: "#2B2522",
        backgroundColor: "#FFFCFA",
        marginBottom: 13,
    },

    textArea: {
        height: 75,
        paddingTop: 12,
        textAlignVertical: "top",
    },

    saveButton: {
        backgroundColor: "#C92A1D",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 4,
    },

    disabledButton: {
        opacity: 0.6,
    },

    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },

    countCard: {
        backgroundColor: "#FDE8E5",
        borderRadius: 14,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    countIcon: {
        fontSize: 30,
        marginRight: 13,
    },

    countValue: {
        fontSize: 22,
        fontWeight: "800",
        color: "#C92A1D",
    },

    countLabel: {
        fontSize: 12,
        color: "#6F625D",
        marginTop: 2,
    },

    sectionTitle: {
        fontSize: 19,
        fontWeight: "800",
        color: "#2B2522",
        marginBottom: 12,
    },

    supplierCard: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
    },

    supplierTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    supplierIcon: {
        width: 45,
        height: 45,
        borderRadius: 12,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    supplierIconText: {
        fontSize: 22,
    },

    supplierInfo: {
        flex: 1,
        marginLeft: 12,
    },

    supplierName: {
        fontSize: 16,
        fontWeight: "800",
        color: "#2B2522",
    },

    companyName: {
        marginTop: 3,
        fontSize: 12,
        color: "#9A8E88",
    },

    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 8,
    },

    activeBadge: {
        backgroundColor: "#E8F5E9",
    },

    inactiveBadge: {
        backgroundColor: "#FFEBEE",
    },

    statusText: {
        fontSize: 10,
        fontWeight: "800",
    },

    activeText: {
        color: "#2E7D32",
    },

    inactiveText: {
        color: "#C62828",
    },

    detailText: {
        color: "#6F625D",
        fontSize: 13,
        marginTop: 5,
    },

    materialTypes: {
        marginTop: 8,
        color: "#2B2522",
        fontSize: 12,
        fontWeight: "600",
    },

    actionRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#F1D6D0",
    },

    editButton: {
        flex: 1,
        backgroundColor: "#FFF3E0",
        borderRadius: 9,
        paddingVertical: 10,
        alignItems: "center",
    },

    editButtonText: {
        color: "#EF8C00",
        fontWeight: "800",
        fontSize: 13,
    },

    deleteButton: {
        flex: 1,
        backgroundColor: "#FFEBEE",
        borderRadius: 9,
        paddingVertical: 10,
        alignItems: "center",
    },

    deleteButtonText: {
        color: "#C62828",
        fontWeight: "800",
        fontSize: 13,
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
        fontSize: 35,
        marginBottom: 10,
    },

    emptyTitle: {
        fontSize: 17,
        fontWeight: "800",
        color: "#2B2522",
    },

    emptyText: {
        marginTop: 6,
        color: "#9A8E88",
        textAlign: "center",
        fontSize: 13,
    },

    emptyButton: {
        backgroundColor: "#C92A1D",
        borderRadius: 10,
        paddingHorizontal: 18,
        paddingVertical: 11,
        marginTop: 15,
    },

    emptyButtonText: {
        color: "#FFFFFF",
        fontWeight: "800",
    },
});