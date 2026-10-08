import React, { useCallback, useState } from "react";
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
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AppHeader from "../components/AppHeader";
import BottomNavigation from "../components/BottomNavigation";
import EmptyState from "../components/EmptyState";

const API_BASE_URL = "http://localhost:5000/api/v1";

type Project = {
    id: number;
    project_name: string;
    client_name: string;
    location: string;
    description: string;
    start_date: string;
    end_date: string;
    budget: string;
    status: string;
};

export default function ProjectsScreen() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    const [projectName, setProjectName] = useState("");
    const [clientName, setClientName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [saving, setSaving] = useState(false);

    const loadProjects = async () => {
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
                `${API_BASE_URL}/projects`,
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
                        "Failed to load projects"
                );
            }

            setProjects(
                Array.isArray(data.data)
                    ? data.data
                    : []
            );
        } catch (error) {
            Alert.alert(
                "Projects Error",
                error instanceof Error
                    ? error.message
                    : "Failed to load projects"
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadProjects();
        }, [])
    );

    const addProject = async () => {
        if (!projectName.trim()) {
            Alert.alert(
                "Required",
                "Please enter project name"
            );
            return;
        }

        try {
            setSaving(true);

            const token =
                await AsyncStorage.getItem("auth_token");

            if (!token) {
                throw new Error(
                    "Authorization token not found"
                );
            }

            const response = await fetch(
                `${API_BASE_URL}/projects`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        project_name:
                            projectName.trim(),
                        client_name:
                            clientName.trim(),
                        location:
                            location.trim(),
                        description:
                            description.trim(),
                        budget: budget
                            ? Number(budget)
                            : null,
                        status: "PLANNED",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to add project"
                );
            }

            setProjectName("");
            setClientName("");
            setLocation("");
            setDescription("");
            setBudget("");
            setShowAddForm(false);

            await loadProjects();

            Alert.alert(
                "Success",
                "Project added successfully"
            );
        } catch (error) {
            Alert.alert(
                "Add Project Error",
                error instanceof Error
                    ? error.message
                    : "Failed to add project"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color="#C92A1D"
                />

                <Text style={styles.loadingText}>
                    Loading projects...
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
                            Projects
                        </Text>

                        <Text style={styles.subtitle}>
                            Manage construction projects
                        </Text>
                    </View>

                    <View style={styles.headerCount}>
                        <Text
                            style={
                                styles.headerCountNumber
                            }
                        >
                            {projects.length}
                        </Text>

                        <Text
                            style={styles.headerCountText}
                        >
                            Projects
                        </Text>
                    </View>
                </View>

                <View style={styles.actionRow}>
                    <Text style={styles.sectionTitle}>
                        Project Management
                    </Text>

                    <Text style={styles.sectionSubtitle}>
                        Create and manage your construction
                        projects
                    </Text>
                </View>

                <Pressable
                    style={styles.addProjectButton}
                    onPress={() =>
                        setShowAddForm(
                            !showAddForm
                        )
                    }
                >
                    <Text style={styles.addProjectIcon}>
                        {showAddForm ? "×" : "+"}
                    </Text>

                    <Text style={styles.addProjectText}>
                        {showAddForm
                            ? "Close Form"
                            : "Add New Project"}
                    </Text>
                </Pressable>

                {showAddForm && (
                    <View style={styles.formCard}>
                        <View style={styles.formHeader}>
                            <View
                                style={
                                    styles.formIconContainer
                                }
                            >
                                <Text
                                    style={
                                        styles.formIcon
                                    }
                                >
                                    🏗️
                                </Text>
                            </View>

                            <View>
                                <Text
                                    style={
                                        styles.formTitle
                                    }
                                >
                                    Add New Project
                                </Text>

                                <Text
                                    style={
                                        styles.formSubtitle
                                    }
                                >
                                    Enter project details
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.inputLabel}>
                            Project Name *
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter project name"
                            placeholderTextColor="#9A8E88"
                            value={projectName}
                            onChangeText={
                                setProjectName
                            }
                        />

                        <Text style={styles.inputLabel}>
                            Client Name
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter client name"
                            placeholderTextColor="#9A8E88"
                            value={clientName}
                            onChangeText={
                                setClientName
                            }
                        />

                        <Text style={styles.inputLabel}>
                            Location
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter project location"
                            placeholderTextColor="#9A8E88"
                            value={location}
                            onChangeText={
                                setLocation
                            }
                        />

                        <Text style={styles.inputLabel}>
                            Description
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                styles.textArea,
                            ]}
                            placeholder="Enter project description"
                            placeholderTextColor="#9A8E88"
                            value={description}
                            onChangeText={
                                setDescription
                            }
                            multiline
                        />

                        <Text style={styles.inputLabel}>
                            Budget
                        </Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter project budget"
                            placeholderTextColor="#9A8E88"
                            value={budget}
                            onChangeText={setBudget}
                            keyboardType="numeric"
                        />

                        <Pressable
                            style={[
                                styles.saveButton,
                                saving &&
                                    styles.disabledButton,
                            ]}
                            onPress={addProject}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />
                            ) : (
                                <Text
                                    style={
                                        styles.saveButtonText
                                    }
                                >
                                    Add Project
                                </Text>
                            )}
                        </Pressable>
                    </View>
                )}

                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>
                            All Projects
                        </Text>

                        <Text
                            style={
                                styles.sectionSubtitle
                            }
                        >
                            Your construction projects
                        </Text>
                    </View>

                    <View style={styles.countBadge}>
                        <Text
                            style={
                                styles.countBadgeText
                            }
                        >
                            {projects.length}
                        </Text>
                    </View>
                </View>

                {projects.length === 0 ? (
                    <EmptyState
                        icon="🏗️"
                        title="No Projects Found"
                        message="Add your first construction project to get started."
                    />
                ) : (
                    projects.map((project) => (
                        <View
                            key={project.id}
                            style={styles.projectCard}
                        >
                            <View
                                style={
                                    styles.cardHeader
                                }
                            >
                                <View
                                    style={
                                        styles.projectIconCircle
                                    }
                                >
                                    <Text
                                        style={
                                            styles.projectIcon
                                        }
                                    >
                                        🏗️
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.projectTitleBox
                                    }
                                >
                                    <Text
                                        style={
                                            styles.projectName
                                        }
                                        numberOfLines={2}
                                    >
                                        {
                                            project.project_name
                                        }
                                    </Text>

                                    <Text
                                        style={
                                            styles.clientName
                                        }
                                    >
                                        {project.client_name ||
                                            "No client"}
                                    </Text>
                                </View>

                                <View
                                    style={[
                                        styles.statusBadge,
                                        project.status ===
                                        "PLANNED"
                                            ? styles.plannedBadge
                                            : styles.otherBadge,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.statusText
                                        }
                                    >
                                        {project.status ||
                                            "PLANNED"}
                                    </Text>
                                </View>
                            </View>

                            <View
                                style={
                                    styles.cardLine
                                }
                            />

                            <View
                                style={
                                    styles.infoRow
                                }
                            >
                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    📍 Location
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {project.location ||
                                        "-"}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.infoRow
                                }
                            >
                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    💰 Budget
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {project.budget
                                        ? `₹${Number(
                                              project.budget
                                          ).toLocaleString(
                                              "en-IN"
                                          )}`
                                        : "-"}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.infoRow
                                }
                            >
                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    📅 Start Date
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {project.start_date
                                        ? new Date(
                                              project.start_date
                                          ).toLocaleDateString()
                                        : "-"}
                                </Text>
                            </View>

                            <View
                                style={
                                    styles.infoRow
                                }
                            >
                                <Text
                                    style={
                                        styles.infoLabel
                                    }
                                >
                                    📅 End Date
                                </Text>

                                <Text
                                    style={
                                        styles.infoValue
                                    }
                                >
                                    {project.end_date
                                        ? new Date(
                                              project.end_date
                                          ).toLocaleDateString()
                                        : "-"}
                                </Text>
                            </View>

                            {project.description ? (
                                <View
                                    style={
                                        styles.descriptionBox
                                    }
                                >
                                    <Text
                                        style={
                                            styles.descriptionLabel
                                        }
                                    >
                                        Description
                                    </Text>

                                    <Text
                                        style={
                                            styles.description
                                        }
                                    >
                                        {
                                            project.description
                                        }
                                    </Text>
                                </View>
                            ) : null}
                        </View>
                    ))
                )}

                <View style={styles.bottomSpace} />
            </ScrollView>

            <BottomNavigation active="projects" />
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
        paddingBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    titleBox: {
        flex: 1,
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

    headerCount: {
        minWidth: 62,
        paddingHorizontal: 10,
        paddingVertical: 9,
        borderRadius: 14,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
    },

    headerCountNumber: {
        fontSize: 20,
        fontWeight: "900",
        color: "#C92A1D",
    },

    headerCountText: {
        marginTop: 1,
        fontSize: 9,
        fontWeight: "700",
        color: "#A82016",
    },

    actionRow: {
        marginHorizontal: 18,
        marginBottom: 12,
        padding: 16,
        borderRadius: 16,
        backgroundColor: "#FFF8F5",
        borderWidth: 1,
        borderColor: "#F1D6D0",
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

    addProjectButton: {
        marginHorizontal: 18,
        marginBottom: 18,
        height: 52,
        borderRadius: 14,
        backgroundColor: "#C92A1D",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 3,
    },

    addProjectIcon: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "700",
        marginRight: 8,
    },

    addProjectText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },

    formCard: {
        marginHorizontal: 18,
        marginBottom: 20,
        padding: 18,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 5,
        elevation: 2,
    },

    formHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    formIconContainer: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: "#FDE8E5",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    formIcon: {
        fontSize: 22,
    },

    formTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: "#2B2522",
    },

    formSubtitle: {
        marginTop: 3,
        fontSize: 11,
        color: "#9A8E88",
        fontWeight: "500",
    },

    inputLabel: {
        fontSize: 12,
        fontWeight: "800",
        color: "#6F625D",
        marginBottom: 6,
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 13,
        fontSize: 14,
        color: "#2B2522",
        backgroundColor: "#FFFCFA",
    },

    textArea: {
        height: 88,
        paddingTop: 14,
        textAlignVertical: "top",
    },

    saveButton: {
        height: 50,
        borderRadius: 12,
        backgroundColor: "#C92A1D",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 3,
    },

    disabledButton: {
        opacity: 0.7,
    },

    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800",
    },

    sectionHeader: {
        marginHorizontal: 20,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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

    projectCard: {
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

    projectIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "#FDE8E5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    projectIcon: {
        fontSize: 23,
    },

    projectTitleBox: {
        flex: 1,
    },

    projectName: {
        fontSize: 17,
        fontWeight: "900",
        color: "#2B2522",
    },

    clientName: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "500",
        color: "#9A8E88",
    },

    statusBadge: {
        paddingHorizontal: 9,
        paddingVertical: 6,
        borderRadius: 10,
    },

    plannedBadge: {
        backgroundColor: "#FFF3E0",
    },

    otherBadge: {
        backgroundColor: "#E8F5E9",
    },

    statusText: {
        fontSize: 9,
        fontWeight: "900",
        color: "#8A5A00",
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

    descriptionBox: {
        marginTop: 10,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#FAF7F3",
        borderWidth: 1,
        borderColor: "#F1D6D0",
    },

    descriptionLabel: {
        fontSize: 10,
        fontWeight: "900",
        color: "#9A8E88",
        marginBottom: 4,
        textTransform: "uppercase",
    },

    description: {
        fontSize: 13,
        lineHeight: 19,
        color: "#6F625D",
    },

    bottomSpace: {
        height: 20,
    },
});