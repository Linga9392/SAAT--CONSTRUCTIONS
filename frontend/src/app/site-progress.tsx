import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
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

const API_BASE_URL =
    "http://localhost:5000/api/v1";

type Project = {
    id: number;
    project_name: string;
};

type SiteProgress = {
    id: number;
    project_id: number;
    project_name?: string;
    progress_date: string;
    progress_percentage: number;
    work_completed: string;
    work_in_progress?: string | null;
    manpower_count?: number | null;
    material_status?: string | null;
    issues?: string | null;
    remarks?: string | null;
};

const showMessage = (
    title: string,
    message: string
) => {
    if (Platform.OS === "web") {
        window.alert(`${title}\n\n${message}`);
    } else {
        Alert.alert(title, message);
    }
};

export default function SiteProgressScreen() {
    const router = useRouter();

    const [projects, setProjects] =
        useState<Project[]>([]);

    const [progressList, setProgressList] =
        useState<SiteProgress[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [projectId, setProjectId] =
        useState("");

    const [progressDate, setProgressDate] =
        useState(
            new Date()
                .toISOString()
                .split("T")[0]
        );

    const [progressPercentage, setProgressPercentage] =
        useState("");

    const [workCompleted, setWorkCompleted] =
        useState("");

    const [workInProgress, setWorkInProgress] =
        useState("");

    const [manpowerCount, setManpowerCount] =
        useState("");

    const [materialStatus, setMaterialStatus] =
        useState("");

    const [issues, setIssues] =
        useState("");

    const [remarks, setRemarks] =
        useState("");

    const getToken = async () => {
        return await AsyncStorage.getItem(
            "auth_token"
        );
    };

    const apiRequest = async (
        endpoint: string,
        options: RequestInit = {}
    ) => {
        const token = await getToken();

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers: {
                    "Content-Type":
                        "application/json",
                    Authorization: `Bearer ${token}`,
                    ...(options.headers || {}),
                },
            }
        );

        const text =
            await response.text();

        let data: any = {};

        try {
            data = text
                ? JSON.parse(text)
                : {};
        } catch {
            throw new Error(
                "Invalid server response"
            );
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                    "Request failed"
            );
        }

        return data;
    };

    const loadData = async () => {
        try {
            setLoading(true);

            const [
                projectsResponse,
                progressResponse,
            ] = await Promise.all([
                apiRequest("/projects"),
                apiRequest(
                    "/site-progress"
                ),
            ]);

            setProjects(
                projectsResponse.data || []
            );

            setProgressList(
                progressResponse.data || []
            );
        } catch (error: any) {
            showMessage(
                "Error",
                error.message ||
                    "Unable to load site progress"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setProjectId("");
        setProgressDate(
            new Date()
                .toISOString()
                .split("T")[0]
        );
        setProgressPercentage("");
        setWorkCompleted("");
        setWorkInProgress("");
        setManpowerCount("");
        setMaterialStatus("");
        setIssues("");
        setRemarks("");
    };

    const saveProgress = async () => {
        if (!projectId) {
            showMessage(
                "Validation",
                "Please enter Project ID."
            );
            return;
        }

        if (!progressPercentage) {
            showMessage(
                "Validation",
                "Please enter progress percentage."
            );
            return;
        }

        if (!workCompleted.trim()) {
            showMessage(
                "Validation",
                "Please enter completed work."
            );
            return;
        }

        const percentage =
            Number(progressPercentage);

        if (
            Number.isNaN(percentage) ||
            percentage < 0 ||
            percentage > 100
        ) {
            showMessage(
                "Validation",
                "Progress must be between 0 and 100."
            );
            return;
        }

        try {
            setSaving(true);

            const body = {
                project_id:
                    Number(projectId),

                progress_date:
                    progressDate,

                progress_percentage:
                    percentage,

                work_completed:
                    workCompleted.trim(),

                work_in_progress:
                    workInProgress.trim() ||
                    null,

                manpower_count:
                    manpowerCount
                        ? Number(manpowerCount)
                        : null,

                material_status:
                    materialStatus.trim() ||
                    null,

                issues:
                    issues.trim() ||
                    null,

                remarks:
                    remarks.trim() ||
                    null,
            };

            if (editingId) {
                await apiRequest(
                    `/site-progress/${editingId}`,
                    {
                        method: "PATCH",
                        body: JSON.stringify(
                            body
                        ),
                    }
                );

                showMessage(
                    "Success",
                    "Site progress updated successfully."
                );
            } else {
                await apiRequest(
                    "/site-progress",
                    {
                        method: "POST",
                        body: JSON.stringify(
                            body
                        ),
                    }
                );

                showMessage(
                    "Success",
                    "Site progress created successfully."
                );
            }

            resetForm();

            await loadData();
        } catch (error: any) {
            showMessage(
                "Error",
                error.message ||
                    "Unable to save site progress"
            );
        } finally {
            setSaving(false);
        }
    };

    const editProgress = (
        item: SiteProgress
    ) => {
        setEditingId(item.id);

        setProjectId(
            String(item.project_id)
        );

        setProgressDate(
            item.progress_date
                ?.split("T")[0] ||
                ""
        );

        setProgressPercentage(
            String(
                item.progress_percentage
            )
        );

        setWorkCompleted(
            item.work_completed || ""
        );

        setWorkInProgress(
            item.work_in_progress || ""
        );

        setManpowerCount(
            item.manpower_count !==
                null &&
                item.manpower_count !==
                    undefined
                ? String(
                      item.manpower_count
                  )
                : ""
        );

        setMaterialStatus(
            item.material_status || ""
        );

        setIssues(
            item.issues || ""
        );

        setRemarks(
            item.remarks || ""
        );

        if (Platform.OS === "web") {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };

    const deleteProgress = async (
        id: number
    ) => {
        const confirmed =
            Platform.OS === "web"
                ? window.confirm(
                      "Delete this site progress record?"
                  )
                : true;

        if (!confirmed) {
            return;
        }

        try {
            await apiRequest(
                `/site-progress/${id}`,
                {
                    method: "DELETE",
                }
            );

            showMessage(
                "Success",
                "Site progress deleted successfully."
            );

            if (editingId === id) {
                resetForm();
            }

            await loadData();
        } catch (error: any) {
            showMessage(
                "Error",
                error.message ||
                    "Unable to delete site progress"
            );
        }
    };

    const getProjectName = (
        projectId: number
    ) => {
        const project =
            projects.find(
                (item) =>
                    Number(item.id) ===
                    Number(projectId)
            );

        return (
            project?.project_name ||
            "Project"
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title="Site Progress"
                showBack
                showNotification
            />

            {loading ? (
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
                        Loading site progress...
                    </Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={
                        styles.content
                    }
                >
                    <View style={styles.headerCard}>
                        <Text
                            style={
                                styles.headerTitle
                            }
                        >
                            Site Progress Tracking
                        </Text>

                        <Text
                            style={
                                styles.headerSubtitle
                            }
                        >
                            Track construction progress,
                            manpower and site status.
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <Text
                            style={styles.cardTitle}
                        >
                            {editingId
                                ? "Edit Progress"
                                : "Add Progress"}
                        </Text>

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Project ID
                        </Text>

                        <TextInput
                            style={
                                styles.input
                            }
                            placeholder="Enter project ID"
                            placeholderTextColor="#9A8E88"
                            value={projectId}
                            onChangeText={
                                setProjectId
                            }
                            keyboardType="numeric"
                        />

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Progress Date
                        </Text>

                        <TextInput
                            style={
                                styles.input
                            }
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor="#9A8E88"
                            value={progressDate}
                            onChangeText={
                                setProgressDate
                            }
                        />

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Progress Percentage
                        </Text>

                        <TextInput
                            style={
                                styles.input
                            }
                            placeholder="Example: 40"
                            placeholderTextColor="#9A8E88"
                            value={
                                progressPercentage
                            }
                            onChangeText={
                                setProgressPercentage
                            }
                            keyboardType="numeric"
                        />

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Work Completed
                        </Text>

                        <TextInput
                            style={
                                styles.textArea
                            }
                            placeholder="Enter completed work"
                            placeholderTextColor="#9A8E88"
                            value={workCompleted}
                            onChangeText={
                                setWorkCompleted
                            }
                            multiline
                        />

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Work In Progress
                        </Text>

                        <TextInput
                            style={
                                styles.textArea
                            }
                            placeholder="Enter current work"
                            placeholderTextColor="#9A8E88"
                            value={
                                workInProgress
                            }
                            onChangeText={
                                setWorkInProgress
                            }
                            multiline
                        />

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Manpower Count
                        </Text>

                        <TextInput
                            style={
                                styles.input
                            }
                            placeholder="Example: 20"
                            placeholderTextColor="#9A8E88"
                            value={
                                manpowerCount
                            }
                            onChangeText={
                                setManpowerCount
                            }
                            keyboardType="numeric"
                        />

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Material Status
                        </Text>

                        <TextInput
                            style={
                                styles.textArea
                            }
                            placeholder="Example: Cement and steel available"
                            placeholderTextColor="#9A8E88"
                            value={
                                materialStatus
                            }
                            onChangeText={
                                setMaterialStatus
                            }
                            multiline
                        />

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Issues
                        </Text>

                        <TextInput
                            style={
                                styles.textArea
                            }
                            placeholder="Enter site issues"
                            placeholderTextColor="#9A8E88"
                            value={issues}
                            onChangeText={
                                setIssues
                            }
                            multiline
                        />

                        <Text
                            style={
                                styles.label
                            }
                        >
                            Remarks
                        </Text>

                        <TextInput
                            style={
                                styles.textArea
                            }
                            placeholder="Enter remarks"
                            placeholderTextColor="#9A8E88"
                            value={remarks}
                            onChangeText={
                                setRemarks
                            }
                            multiline
                        />

                        <Pressable
                            style={[
                                styles.primaryButton,
                                saving &&
                                    styles.disabledButton,
                            ]}
                            onPress={
                                saveProgress
                            }
                            disabled={saving}
                        >
                            <Text
                                style={
                                    styles.primaryButtonText
                                }
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Progress"
                                    : "Add Progress"}
                            </Text>
                        </Pressable>

                        {editingId && (
                            <Pressable
                                style={
                                    styles.cancelButton
                                }
                                onPress={
                                    resetForm
                                }
                            >
                                <Text
                                    style={
                                        styles.cancelButtonText
                                    }
                                >
                                    Cancel Edit
                                </Text>
                            </Pressable>
                        )}
                    </View>

                    <View style={styles.card}>
                        <View
                            style={
                                styles.listHeader
                            }
                        >
                            <Text
                                style={
                                    styles.cardTitle
                                }
                            >
                                Progress History
                            </Text>

                            <Text
                                style={
                                    styles.countText
                                }
                            >
                                {progressList.length} Records
                            </Text>
                        </View>

                        {progressList.length ===
                        0 ? (
                            <Text
                                style={
                                    styles.emptyText
                                }
                            >
                                No site progress
                                records found.
                            </Text>
                        ) : (
                            progressList.map(
                                (item) => (
                                    <View
                                        key={
                                            item.id
                                        }
                                        style={
                                            styles.progressItem
                                        }
                                    >
                                        <View
                                            style={
                                                styles.progressTop
                                            }
                                        >
                                            <View
                                                style={
                                                    styles.progressInfo
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.projectName
                                                    }
                                                >
                                                    {item.project_name ||
                                                        getProjectName(
                                                            item.project_id
                                                        )}
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.dateText
                                                    }
                                                >
                                                    {item.progress_date?.split(
                                                        "T"
                                                    )[0] ||
                                                        "-"}
                                                </Text>
                                            </View>

                                            <View
                                                style={
                                                    styles.percentBadge
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.percentText
                                                    }
                                                >
                                                    {
                                                        item.progress_percentage
                                                    }
                                                    %
                                                </Text>
                                            </View>
                                        </View>

                                        <View
                                            style={
                                                styles.progressBarBackground
                                            }
                                        >
                                            <View
                                                style={[
                                                    styles.progressBar,
                                                    {
                                                        width: `${Math.min(
                                                            100,
                                                            Math.max(
                                                                0,
                                                                Number(
                                                                    item.progress_percentage
                                                                )
                                                            )
                                                        )}%`,
                                                    },
                                                ]}
                                            />
                                        </View>

                                        <Text
                                            style={
                                                styles.sectionLabel
                                            }
                                        >
                                            Completed
                                        </Text>

                                        <Text
                                            style={
                                                styles.valueText
                                            }
                                        >
                                            {
                                                item.work_completed
                                            }
                                        </Text>

                                        {item.work_in_progress && (
                                            <>
                                                <Text
                                                    style={
                                                        styles.sectionLabel
                                                    }
                                                >
                                                    In Progress
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.valueText
                                                    }
                                                >
                                                    {
                                                        item.work_in_progress
                                                    }
                                                </Text>
                                            </>
                                        )}

                                        <View
                                            style={
                                                styles.detailsRow
                                            }
                                        >
                                            <Text
                                                style={
                                                    styles.detailText
                                                }
                                            >
                                                👷{" "}
                                                {item.manpower_count ??
                                                    0}{" "}
                                                Workers
                                            </Text>

                                            <Text
                                                style={
                                                    styles.detailText
                                                }
                                            >
                                                📦{" "}
                                                {item.material_status ||
                                                    "No status"}
                                            </Text>
                                        </View>

                                        {item.issues && (
                                            <View
                                                style={
                                                    styles.issueBox
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.issueTitle
                                                    }
                                                >
                                                    Issues
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.issueText
                                                    }
                                                >
                                                    {
                                                        item.issues
                                                    }
                                                </Text>
                                            </View>
                                        )}

                                        {item.remarks && (
                                            <Text
                                                style={
                                                    styles.remarksText
                                                }
                                            >
                                                Remarks:{" "}
                                                {
                                                    item.remarks
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
                                                    editProgress(
                                                        item
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.editButtonText
                                                    }
                                                >
                                                    Edit
                                                </Text>
                                            </Pressable>

                                            <Pressable
                                                style={
                                                    styles.deleteButton
                                                }
                                                onPress={() =>
                                                    deleteProgress(
                                                        item.id
                                                    )
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.deleteButtonText
                                                    }
                                                >
                                                    Delete
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                )
                            )
                        )}
                    </View>
                </ScrollView>
            )}

            <BottomNavigation
                active="projects"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAF7F3",
    },

    content: {
        padding: 16,
        paddingBottom: 100,
        gap: 16,
    },

    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    loadingText: {
        marginTop: 12,
        color: "#6F625D",
        fontSize: 14,
    },

    headerCard: {
        backgroundColor: "#C92A1D",
        borderRadius: 16,
        padding: 20,
    },

    headerTitle: {
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "800",
    },

    headerSubtitle: {
        color: "#FDE8E5",
        fontSize: 14,
        marginTop: 6,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#F1D6D0",
    },

    cardTitle: {
        color: "#2B2522",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 14,
    },

    label: {
        color: "#6F625D",
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 6,
        marginTop: 10,
    },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 10,
        paddingHorizontal: 12,
        backgroundColor: "#FFF8F5",
        color: "#2B2522",
        fontSize: 14,
    },

    textArea: {
        minHeight: 90,
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: "#FFF8F5",
        color: "#2B2522",
        fontSize: 14,
        textAlignVertical: "top",
    },

    primaryButton: {
        backgroundColor: "#C92A1D",
        borderRadius: 10,
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 18,
    },

    disabledButton: {
        opacity: 0.6,
    },

    primaryButtonText: {
        color: "#FFFFFF",
        fontWeight: "800",
        fontSize: 15,
    },

    cancelButton: {
        borderWidth: 1,
        borderColor: "#C92A1D",
        borderRadius: 10,
        minHeight: 46,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },

    cancelButtonText: {
        color: "#C92A1D",
        fontWeight: "800",
    },

    listHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    countText: {
        color: "#9A8E88",
        fontSize: 12,
        fontWeight: "700",
    },

    emptyText: {
        color: "#9A8E88",
        textAlign: "center",
        paddingVertical: 24,
    },

    progressItem: {
        borderWidth: 1,
        borderColor: "#F1D6D0",
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        backgroundColor: "#FFF8F5",
    },

    progressTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    progressInfo: {
        flex: 1,
    },

    projectName: {
        color: "#2B2522",
        fontSize: 16,
        fontWeight: "800",
    },

    dateText: {
        color: "#9A8E88",
        fontSize: 12,
        marginTop: 4,
    },

    percentBadge: {
        backgroundColor: "#E8F5E9",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 7,
    },

    percentText: {
        color: "#2E7D32",
        fontWeight: "800",
    },

    progressBarBackground: {
        height: 8,
        backgroundColor: "#F1D6D0",
        borderRadius: 8,
        overflow: "hidden",
        marginTop: 14,
    },

    progressBar: {
        height: 8,
        backgroundColor: "#C92A1D",
        borderRadius: 8,
    },

    sectionLabel: {
        color: "#6F625D",
        fontSize: 12,
        fontWeight: "800",
        marginTop: 12,
        marginBottom: 3,
    },

    valueText: {
        color: "#2B2522",
        fontSize: 14,
        lineHeight: 20,
    },

    detailsRow: {
        marginTop: 12,
        gap: 6,
    },

    detailText: {
        color: "#6F625D",
        fontSize: 13,
    },

    issueBox: {
        backgroundColor: "#FFEBEE",
        borderRadius: 10,
        padding: 10,
        marginTop: 12,
    },

    issueTitle: {
        color: "#C62828",
        fontSize: 12,
        fontWeight: "800",
        marginBottom: 3,
    },

    issueText: {
        color: "#6F625D",
        fontSize: 13,
    },

    remarksText: {
        color: "#6F625D",
        fontSize: 13,
        marginTop: 10,
    },

    actionRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 14,
    },

    editButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#C92A1D",
        borderRadius: 9,
        minHeight: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    editButtonText: {
        color: "#C92A1D",
        fontWeight: "800",
    },

    deleteButton: {
        flex: 1,
        backgroundColor: "#FFEBEE",
        borderRadius: 9,
        minHeight: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    deleteButtonText: {
        color: "#C62828",
        fontWeight: "800",
    },
});