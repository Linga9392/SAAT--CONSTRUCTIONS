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

type DocumentItem = {
    id: number;
    project_id: number;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    document_type: string;
    description: string;
};

export default function DocumentsScreen() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);

    const loadDocuments = async () => {
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
                `${API_BASE_URL}/documents`,
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
                        "Failed to load documents"
                );
            }

            setDocuments(
                Array.isArray(data.data)
                    ? data.data
                    : []
            );
        } catch (error) {
            Alert.alert(
                "Documents Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load documents"
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadDocuments();
        }, [])
    );

    const formatFileSize = (size: number) => {
        if (!size) {
            return "-";
        }

        if (size < 1024) {
            return `${size} B`;
        }

        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(1)} KB`;
        }

        return `${(
            size /
            (1024 * 1024)
        ).toFixed(1)} MB`;
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
                    Loading Documents
                </Text>

                <Text style={styles.loadingText}>
                    Getting your project files...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader
                title="Documents"
                showMenu
                showNotification
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.pageHeader}>
                    <View style={styles.pageHeaderInfo}>
                        <Text style={styles.title}>
                            Documents
                        </Text>

                        <Text style={styles.subtitle}>
                            Manage your project documents
                        </Text>
                    </View>

                    <View style={styles.headerIconCircle}>
                        <Text style={styles.headerIcon}>
                            📄
                        </Text>
                    </View>
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryIconCircle}>
                        <Text style={styles.summaryIcon}>
                            📁
                        </Text>
                    </View>

                    <View style={styles.summaryInfo}>
                        <Text style={styles.summaryLabel}>
                            Project Documents
                        </Text>

                        <Text style={styles.summaryValue}>
                            {documents.length}{" "}
                            {documents.length === 1
                                ? "Document"
                                : "Documents"}
                        </Text>
                    </View>

                    <View style={styles.countCircle}>
                        <Text style={styles.countNumber}>
                            {documents.length}
                        </Text>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <View style={styles.sectionInfo}>
                        <Text style={styles.sectionTitle}>
                            Uploaded Documents
                        </Text>

                        <Text style={styles.sectionSubtitle}>
                            Project files and document details
                        </Text>
                    </View>

                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>
                            {documents.length}
                        </Text>
                    </View>
                </View>

                {documents.length === 0 ? (
                    <EmptyState
                        icon="📄"
                        title="No Documents Found"
                        message="Project documents will appear here once they are uploaded."
                    />
                ) : (
                    documents.map((document) => (
                        <View
                            key={document.id}
                            style={styles.documentCard}
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.fileIconCircle}>
                                    <Text style={styles.fileIcon}>
                                        📄
                                    </Text>
                                </View>

                                <View style={styles.fileInfo}>
                                    <Text
                                        style={styles.fileName}
                                        numberOfLines={2}
                                    >
                                        {document.file_name}
                                    </Text>

                                    <View style={styles.typeBadge}>
                                        <Text
                                            style={
                                                styles.typeBadgeText
                                            }
                                        >
                                            {document.document_type ||
                                                "OTHER"}
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={
                                        styles.fileStatusCircle
                                    }
                                >
                                    <Text
                                        style={
                                            styles.fileStatusIcon
                                        }
                                    >
                                        ✓
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.infoGrid}>
                                <View style={styles.gridItem}>
                                    <Text style={styles.gridLabel}>
                                        Project
                                    </Text>

                                    <Text style={styles.gridValue}>
                                        #{document.project_id}
                                    </Text>
                                </View>

                                <View style={styles.gridItem}>
                                    <Text style={styles.gridLabel}>
                                        File Type
                                    </Text>

                                    <Text
                                        style={styles.gridValue}
                                        numberOfLines={1}
                                    >
                                        {document.file_type || "-"}
                                    </Text>
                                </View>

                                <View style={styles.gridItem}>
                                    <Text style={styles.gridLabel}>
                                        File Size
                                    </Text>

                                    <Text style={styles.gridValue}>
                                        {formatFileSize(
                                            document.file_size
                                        )}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.descriptionBox}>
                                <Text
                                    style={
                                        styles.descriptionLabel
                                    }
                                >
                                    Description
                                </Text>

                                <Text
                                    style={styles.description}
                                >
                                    {document.description ||
                                        "No description available"}
                                </Text>
                            </View>

                            <View style={styles.filePathRow}>
                                <Text style={styles.filePathLabel}>
                                    FILE
                                </Text>

                                <Text
                                    style={styles.filePath}
                                    numberOfLines={1}
                                >
                                    {document.file_path || "-"}
                                </Text>
                            </View>
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
        paddingRight: 12,
    },

    title: {
        fontSize: 29,
        fontWeight: "900",
        color: "#2B2522",
    },

    subtitle: {
        marginTop: 5,
        fontSize: 14,
        lineHeight: 20,
        color: "#6F625D",
    },

    headerIconCircle: {
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    headerIcon: {
        fontSize: 25,
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
        width: 54,
        height: 54,
        borderRadius: 17,
        backgroundColor: "#C92A1D",
        alignItems: "center",
        justifyContent: "center",
    },

    summaryIcon: {
        fontSize: 24,
    },

    summaryInfo: {
        flex: 1,
        marginLeft: 13,
    },

    summaryLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#6F625D",
    },

    summaryValue: {
        marginTop: 4,
        fontSize: 18,
        fontWeight: "900",
        color: "#2B2522",
    },

    countCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    countNumber: {
        fontSize: 17,
        fontWeight: "900",
        color: "#C92A1D",
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
        paddingRight: 10,
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

    countBadge: {
        minWidth: 36,
        height: 36,
        paddingHorizontal: 9,
        borderRadius: 18,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
    },

    countBadgeText: {
        fontSize: 13,
        fontWeight: "900",
        color: "#C92A1D",
    },

    documentCard: {
        marginHorizontal: 18,
        marginBottom: 14,
        padding: 18,
        borderRadius: 20,
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

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    fileIconCircle: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    fileIcon: {
        fontSize: 24,
    },

    fileInfo: {
        flex: 1,
    },

    fileName: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "900",
        color: "#2B2522",
    },

    typeBadge: {
        alignSelf: "flex-start",
        marginTop: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "#FDE8E5",
    },

    typeBadgeText: {
        fontSize: 9,
        fontWeight: "900",
        color: "#C92A1D",
    },

    fileStatusCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#E8F5E9",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 8,
    },

    fileStatusIcon: {
        fontSize: 15,
        fontWeight: "900",
        color: "#2E7D32",
    },

    divider: {
        height: 1,
        backgroundColor: "#F1ECE8",
        marginVertical: 15,
    },

    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    gridItem: {
        width: "33.33%",
        paddingVertical: 8,
        paddingRight: 5,
    },

    gridLabel: {
        fontSize: 10,
        fontWeight: "600",
        color: "#9A8E88",
        marginBottom: 4,
    },

    gridValue: {
        fontSize: 13,
        fontWeight: "900",
        color: "#2B2522",
    },

    descriptionBox: {
        marginTop: 8,
        padding: 13,
        borderRadius: 12,
        backgroundColor: "#FAF7F3",
        borderLeftWidth: 3,
        borderLeftColor: "#C92A1D",
    },

    descriptionLabel: {
        fontSize: 11,
        fontWeight: "800",
        color: "#C92A1D",
        marginBottom: 5,
    },

    description: {
        fontSize: 13,
        lineHeight: 19,
        color: "#4F4540",
    },

    filePathRow: {
        marginTop: 12,
        paddingTop: 11,
        borderTopWidth: 1,
        borderTopColor: "#F1ECE8",
        flexDirection: "row",
        alignItems: "center",
    },

    filePathLabel: {
        width: 38,
        fontSize: 9,
        fontWeight: "900",
        color: "#9A8E88",
    },

    filePath: {
        flex: 1,
        fontSize: 10,
        fontWeight: "600",
        color: "#6F625D",
    },

    footer: {
        marginTop: 18,
        marginHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 10,
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