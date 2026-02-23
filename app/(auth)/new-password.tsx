import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/services/firebaseConfig";

function getStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
  if (score === 2) return { score, label: "Fair", color: "#f59e0b" };
  if (score === 3) return { score, label: "Good", color: "#3b82f6" };
  return { score, label: "Strong", color: "#22c55e" };
}

export default function NewPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(newPassword);
  const passwordsMatch =
    newPassword.length > 0 && newPassword === confirmPassword;

  const handleReset = async () => {
    if (!currentPassword.trim()) {
      Alert.alert("Required", "Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Too Short", "Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("Not authenticated");

      // Re-authenticate first
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      Alert.alert("Success", "Password updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const msg =
        err.code === "auth/wrong-password"
          ? "Current password is incorrect."
          : err.message || "Failed to update password.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-light dark:bg-background-dark"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View
        className="flex-row items-center px-4 pb-2"
        style={{ paddingTop: insets.top + 8 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="size-10 items-center justify-center"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#9ca3af" />
        </TouchableOpacity>
        <Text className="text-gray-900 dark:text-white text-lg font-bold flex-1 text-center pr-10">
          New Password
        </Text>
      </View>

      <View className="flex-1 px-6 max-w-md w-full mx-auto">
        <View className="pt-8 pb-4 items-center">
          <Text className="text-gray-900 dark:text-white text-[28px] font-extrabold tracking-tight text-center mb-3">
            Create New Password
          </Text>
          <Text className="text-gray-500 dark:text-slate-400 text-base text-center max-w-[280px] leading-relaxed">
            Create a strong password to secure your account.
          </Text>
        </View>

        <View className="flex-row justify-center gap-1.5 py-4">
          {[1, 0.4, 0.2, 0.1].map((opacity, i) => (
            <View
              key={i}
              className="w-3 h-3 rounded-sm bg-primary"
              style={{ opacity }}
            />
          ))}
        </View>

        {/* Form */}
        <View className="gap-4 mt-2">
          <View className="gap-2">
            <Text className="text-gray-700 dark:text-slate-200 text-sm font-semibold px-1">
              Current Password
            </Text>
            <View className="flex-row items-center bg-slate-100 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-xl h-14 px-4">
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showCurrent}
                className="flex-1 text-base text-gray-900 dark:text-white"
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                <Ionicons
                  name={showCurrent ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-gray-700 dark:text-slate-200 text-sm font-semibold px-1">
              New Password
            </Text>
            <View className="flex-row items-center bg-slate-100 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-xl h-14 px-4">
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showNew}
                className="flex-1 text-base text-gray-900 dark:text-white"
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Ionicons
                  name={showNew ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>
            {newPassword.length > 0 && (
              <View className="flex-row items-center gap-1.5 px-1">
                {[0, 1, 2, 3].map((i) => (
                  <View
                    key={i}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      backgroundColor:
                        i < strength.score ? strength.color : "#e2e8f0",
                    }}
                  />
                ))}
                <Text
                  className="text-[10px] uppercase tracking-wider font-bold ml-1"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </Text>
              </View>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-gray-700 dark:text-slate-200 text-sm font-semibold px-1">
              Confirm Password
            </Text>
            <View className="flex-row items-center bg-slate-100 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-xl h-14 px-4">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter new password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showConfirm}
                className="flex-1 text-base text-gray-900 dark:text-white"
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons
                  name={showConfirm ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>
          </View>

          {confirmPassword.length > 0 && (
            <View className="flex-row items-center gap-2 px-1">
              <Ionicons
                name={
                  passwordsMatch ? "checkmark-circle" : "close-circle-outline"
                }
                size={18}
                color={passwordsMatch ? "#22c55e" : "#ef4444"}
              />
              <Text
                className="text-xs"
                style={{ color: passwordsMatch ? "#22c55e" : "#ef4444" }}
              >
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View
        className="px-6 bg-background-light/95 dark:bg-background-dark/95"
        style={{ paddingBottom: insets.bottom + 12, paddingTop: 12 }}
      >
        <TouchableOpacity
          onPress={handleReset}
          disabled={loading}
          activeOpacity={0.85}
          className="h-14 w-full rounded-xl items-center justify-center flex-row gap-2"
          style={{
            backgroundColor: loading ? "#d1d5db" : "#f48c25",
            shadowColor: "#f48c25",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <Text className="text-white font-bold text-base">
            {loading ? "Updating..." : "Reset Password"}
          </Text>
          {!loading && (
            <Ionicons name="arrow-forward" size={18} color="white" />
          )}
        </TouchableOpacity>
        <Text className="text-center text-xs text-gray-400 dark:text-slate-600 mt-4 font-medium">
          Mosaic Secure Protocol
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
