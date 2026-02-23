import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";

type ConfirmPasswordModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (password: string) => Promise<void>;
  title?: string;
  message?: string;
  confirmLabel?: string;
};

export default function ConfirmPasswordModal({
  visible,
  onClose,
  onConfirm,
  title = "Confirm Password",
  message = "Enter your password to continue.",
  confirmLabel = "Confirm",
}: ConfirmPasswordModalProps) {
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setPassword("");
    setShowPassword(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (!password.trim()) {
      Alert.alert("Required", "Please enter your password.");
      return;
    }
    try {
      setLoading(true);
      await onConfirm(password);
      setPassword("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        className="flex-1 bg-background-light dark:bg-background-dark"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5"
          style={{ paddingTop: insets.top + 8 }}
        >
          <TouchableOpacity onPress={handleClose} disabled={loading}>
            <Text className="text-gray-500 text-base font-semibold">
              Cancel
            </Text>
          </TouchableOpacity>
          <Text className="text-gray-900 dark:text-white text-lg font-bold">
            {title}
          </Text>
          <View className="w-16" />
        </View>

        <View className="flex-1 px-6 pt-8 gap-6">
          <View className="items-center gap-4">
            <View className="size-16 rounded-full bg-red-500/10 items-center justify-center">
              <Ionicons name="warning-outline" size={32} color="#ef4444" />
            </View>
            <Text className="text-gray-500 dark:text-slate-400 text-sm text-center leading-relaxed">
              {message}
            </Text>
          </View>

          <View className="gap-2">
            <Text className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
              Password
            </Text>
            <View className="flex-row items-center bg-slate-100 dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/5 rounded-xl h-14 px-4">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                autoFocus
                className="flex-1 text-base text-gray-900 dark:text-white"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleConfirm}
            disabled={loading}
            activeOpacity={0.85}
            className="h-14 w-full rounded-xl items-center justify-center flex-row gap-2 mt-2"
            style={{
              backgroundColor: loading ? "#d1d5db" : "#ef4444",
              shadowColor: "#ef4444",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="trash-outline" size={18} color="white" />
                <Text className="text-white font-bold text-base">
                  {confirmLabel}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
