import AuthContainer from "@/components/auth/AuthContainer";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthFooter from "@/components/auth/AuthFooter";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { SocialButton } from "@/components/ui/SocialButton";
import { useLoader } from "@/hooks/useLoader";
import { registerUser } from "@/services/authService";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

/**
 * SignUpScreen handles new user registration.
 * Includes input fields for user info, password, and social sign-up options.
 */
export default function SignUpScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { isLoading, showLoader, hideLoader } = useLoader();

  // Sign up with email/password
  const handleSignUp = async () => {
    console.log("Sign uasync p:", firstName, lastName, email, password);

    if (isLoading) {
      return;
    }

    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Please fill all fields...!");
    }

    if (password != confirmPassword) {
      Alert.alert("Password not match...!");
    }

    try {
      showLoader();
      await registerUser(firstName, lastName, email, password);
      Alert.alert("Account created...!");
      router.replace("/(tabs)"); // Navigate to main app after successful registration
    } catch (err) {
      Alert.alert("Registration failed");
    } finally {
      hideLoader();
    }
  };

  // Sign up with Google (placeholder)
  const handleGoogleSignUp = () => {
    console.log("Google sign up");
    // TODO: integrate Google authentication
  };

  return (
    <AuthContainer subtitle="Start tracking your habits">
      <View className="gap-4">
        <InputField
          label="First Name"
          placeholder="First name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <InputField
          label="Last Name"
          placeholder="Last name"
          value={lastName}
          onChangeText={setLastName}
        />
        <InputField
          label="Email Address"
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <InputField
          label="Password"
          placeholder="Password"
          isPassword
          value={password}
          onChangeText={setPassword}
        />

        <InputField
          label="Confirm Password"
          placeholder="Confirm password"
          isPassword
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Button title="Create Account" onPress={handleSignUp} />
      </View>

      <AuthDivider />

      <SocialButton title="Continue with Google" onPress={handleGoogleSignUp} />

      <View className="flex-row justify-center items-center mt-8 gap-2">
        <Text className="text-gray-500 dark:text-gray-400 text-sm">
          Already have an account?
        </Text>
        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity>
            <Text className="text-primary font-semibold text-sm">Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <AuthFooter type="signup" />
    </AuthContainer>
  );
}
