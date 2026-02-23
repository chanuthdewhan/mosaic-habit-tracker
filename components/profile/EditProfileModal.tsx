import { useAuth } from "@/hooks/useAuth";
import {
  getUserData,
  removeProfilePhoto,
  updateUserData,
  uploadProfilePhoto,
} from "@/services/userService";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
};

/**
 * Modal component for editing user profile details and avatar.
 * Handles its own Firebase storage uploads and Firestore updates.
 */
export default function EditProfileModal({
  visible,
  onClose,
  onSaved,
}: EditProfileModalProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  // Local state ensures the UI updates instantly after an image change,
  // bypassing the delay of waiting for Firebase Auth to sync the new URL.
  const [currentPhotoURL, setCurrentPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    if (visible && user?.uid) {
      getUserData(user.uid).then((data) => {
        if (data) {
          setFirstName(data.firstName ?? "");
          setLastName(data.lastName ?? "");
        }
      });
      setEmail(user.email ?? "");
      setCurrentPhotoURL(user.photoURL ?? null);
    }
  }, [visible, user?.uid]);

  const handleSave = async () => {
    if (!firstName.trim()) {
      Alert.alert("Missing Field", "First name is required.");
      return;
    }
    if (!user?.uid) return;

    try {
      setSaving(true);
      await updateUserData(user.uid, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      onSaved();
      onClose();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    try {
      setSaving(true);
      const uri = result.assets[0].uri;
      const downloadURL = await uploadProfilePhoto(user!.uid, uri);
      setCurrentPhotoURL(downloadURL);
      onSaved();
      Alert.alert("Done", "Profile picture updated!");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to upload photo.");
    } finally {
      setSaving(false);
    }
  };

  const removeProfilePic = () => {
    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove your profile picture?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            if (!user?.uid) return;
            try {
              setSaving(true);
              await removeProfilePhoto(user.uid);
              setCurrentPhotoURL(null);
              onSaved();
            } catch (err: any) {
              Alert.alert("Error", err.message);
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1 bg-background-light dark:bg-background-dark"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5"
          style={{ paddingTop: insets.top + 8 }}
        >
          <TouchableOpacity onPress={onClose}>
            <Text className="text-primary text-base font-semibold">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-gray-900 dark:text-white text-lg font-bold">
            Edit Profile
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color="#f48c25" />
            ) : (
              <Text className="text-primary text-base font-bold">Done</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        >
          {/* Avatar Section */}
          <View className="items-center py-8">
            <View className="relative">
              <View
                className="size-32 rounded-full p-1 items-center justify-center"
                style={{ backgroundColor: "rgba(244,140,37,0.2)" }}
              >
                <View className="size-[120px] rounded-full overflow-hidden bg-slate-200 dark:bg-[#1a1a1a] border-4 border-background-light dark:border-background-dark">
                  {currentPhotoURL ? (
                    <Image
                      source={{ uri: currentPhotoURL }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="flex-1 items-center justify-center">
                      <Ionicons
                        name="person-outline"
                        size={48}
                        color="#9ca3af"
                      />
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity
                onPress={handlePickImage}
                className="absolute bottom-1 right-1 size-10 bg-primary rounded-full items-center justify-center border-4 border-background-light dark:border-background-dark"
              >
                <Ionicons name="camera-outline" size={18} color="white" />
              </TouchableOpacity>
            </View>

            <Text className="mt-3 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
              Change Profile Picture
            </Text>

            {currentPhotoURL && (
              <TouchableOpacity onPress={removeProfilePic} className="mt-2">
                <Text className="text-red-500 text-xs font-bold">
                  Remove Photo
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Form Section */}
          <View className="px-6 gap-5">
            <View className="gap-2">
              <Text className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
                First Name
              </Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor="#9ca3af"
                className="bg-slate-100 dark:bg-[#1a1a1a] rounded-xl px-4 h-14 text-base text-gray-900 dark:text-white border border-slate-200 dark:border-white/5"
              />
            </View>

            <View className="gap-2">
              <Text className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
                Last Name
              </Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor="#9ca3af"
                className="bg-slate-100 dark:bg-[#1a1a1a] rounded-xl px-4 h-14 text-base text-gray-900 dark:text-white border border-slate-200 dark:border-white/5"
              />
            </View>

            <View className="gap-2">
              <Text className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
                Email Address
              </Text>
              <View className="bg-slate-100 dark:bg-[#1a1a1a] rounded-xl px-4 h-14 flex-row items-center border border-slate-200 dark:border-white/5">
                <Text className="flex-1 text-base text-gray-400 dark:text-slate-500">
                  {email}
                </Text>
                <Ionicons name="checkmark-circle" size={20} color="#f48c25" />
              </View>
              <Text className="text-gray-400 dark:text-slate-600 text-xs px-1">
                Email cannot be changed here.
              </Text>
            </View>

            <View className="mt-2 p-4 rounded-2xl bg-primary/10 border border-primary/20 flex-row items-center gap-4">
              <View className="size-12 rounded-xl bg-primary/20 items-center justify-center">
                <Ionicons name="analytics-outline" size={22} color="#f48c25" />
              </View>
              <View className="flex-1">
                <Text className="text-primary text-xs font-bold uppercase tracking-widest">
                  Mosaic Profile
                </Text>
                <Text className="text-gray-500 dark:text-slate-400 text-sm">
                  Your data is encrypted and synced.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View
          className="absolute bottom-0 left-0 right-0 px-6 bg-background-light/95 dark:bg-background-dark/95 border-t border-slate-100 dark:border-white/5"
          style={{ paddingBottom: insets.bottom + 12, paddingTop: 12 }}
        >
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
            className="w-full h-14 rounded-xl items-center justify-center flex-row gap-2"
            style={{
              backgroundColor: saving ? "#d1d5db" : "#f48c25",
              shadowColor: "#f48c25",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text className="text-white font-bold text-base">
                  Save Changes
                </Text>
                <Ionicons name="arrow-forward" size={18} color="white" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
