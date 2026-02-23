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
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/services/firebaseConfig";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert("Missing Email", "Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-light dark:bg-background-dark"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        className="flex-row items-center justify-between px-4 pb-2"
        style={{ paddingTop: insets.top + 8 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="size-10 items-center justify-center rounded-full"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color="#9ca3af" />
        </TouchableOpacity>
        <Text className="text-gray-900 dark:text-white text-lg font-bold flex-1 text-center pr-10">
          Reset Password
        </Text>
      </View>

      <View className="flex-1 px-6 pt-10 max-w-md w-full mx-auto">
        {!sent ? (
          <>
            <Text className="text-gray-900 dark:text-white text-3xl font-extrabold tracking-tight mb-2">
              Forgot Password?
            </Text>
            <Text className="text-gray-500 dark:text-slate-400 text-base leading-relaxed mb-8">
              Enter your email and we'll send you a link to reset your password.
            </Text>

            <View className="gap-2 mb-8">
              <Text className="text-gray-700 dark:text-slate-300 text-sm font-semibold px-1">
                Email Address
              </Text>
              <View className="flex-row items-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl h-14 px-4">
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="e.g. alex@example.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="flex-1 text-base text-gray-900 dark:text-white"
                />
                <Ionicons name="mail-outline" size={20} color="#9ca3af" />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSend}
              disabled={loading}
              activeOpacity={0.85}
              className="h-14 w-full rounded-xl items-center justify-center mb-4"
              style={{
                backgroundColor: loading ? "#d1d5db" : "#f48c25",
                shadowColor: "#f48c25",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 6,
              }}
            >
              <Text className="text-white font-bold text-base tracking-wide">
                {loading ? "Sending..." : "Send Reset Link"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              className="h-12 w-full items-center justify-center"
            >
              <Text className="text-gray-500 dark:text-slate-400 text-sm font-medium">
                Back to Login
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View className="flex-1 items-center justify-center gap-6 pb-20">
            <View className="size-24 rounded-full bg-primary/10 items-center justify-center">
              <Ionicons name="mail" size={48} color="#f48c25" />
            </View>
            <View className="items-center gap-2">
              <Text className="text-gray-900 dark:text-white text-2xl font-extrabold text-center">
                Check your inbox!
              </Text>
              <Text className="text-gray-500 dark:text-slate-400 text-base text-center leading-relaxed px-4">
                We sent a password reset link to{"\n"}
                <Text className="text-primary font-bold">{email}</Text>
              </Text>
            </View>
            <Text className="text-gray-400 dark:text-slate-500 text-sm text-center px-6">
              Didn't receive it? Check your spam folder or try again.
            </Text>
            <TouchableOpacity onPress={() => setSent(false)} className="mt-2">
              <Text className="text-primary font-bold text-base">
                Try a different email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace("/(auth)")}
              className="h-14 w-full rounded-xl items-center justify-center mt-4"
              style={{ backgroundColor: "#f48c25" }}
            >
              <Text className="text-white font-bold text-base">
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View
          className="pb-12 items-center"
          style={{ marginTop: sent ? 0 : "auto" }}
        >
          <View className="flex-row gap-2">
            {[1, 0.4, 0.2, 0.1].map((opacity, i) => (
              <View
                key={i}
                className="size-2 rounded-full bg-primary"
                style={{ opacity }}
              />
            ))}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
