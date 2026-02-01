import AuthContainer from "@/components/auth/AuthContainer";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthFooter from "@/components/auth/AuthFooter";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import { SocialButton } from "@/components/ui/SocialButton";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

/**
 * SignInScreen handles user authentication.
 * Contains email/password input, social login, and navigation to Sign Up.
 */
export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign in with email/password
  const handleSignIn = () => {
    console.log("Sign in:", email, password);
    router.replace("/(tabs)");
  };

  // Sign in with Google
  const handleGoogleSignIn = () => {
    console.log("Google sign in");
    // TODO: integrate Google authentication
  };

  return (
    <AuthContainer>
      <View className="gap-4">
        <InputField
          label="Email Address"
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <InputField
          label="Password"
          placeholder="Enter Password"
          isPassword
          value={password}
          onChangeText={setPassword}
        />

        <View className="items-end">
          <TouchableOpacity className="py-1">
            <Text className="text-xs font-semibold text-primary">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <Button title="Sign In" onPress={handleSignIn} />
      </View>

      <AuthDivider />

      <SocialButton title="Continue with Google" onPress={handleGoogleSignIn} />

      <View className="flex-row justify-center items-center mt-8 gap-2">
        <Text className="text-gray-500 dark:text-gray-400 text-sm">
          Don't have an account?
        </Text>
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity>
            <Text className="text-primary font-semibold text-sm">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <AuthFooter type="signin" />
    </AuthContainer>
  );
}
