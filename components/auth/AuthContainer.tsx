// import { LinearGradient } from "expo-linear-gradient";
// import { ReactNode } from "react";
// import { Image, Platform, Text, View } from "react-native";

// interface AuthContainerProps {
//   children: ReactNode;
//   title?: string;
//   subtitle?: string;
// }

// export default function AuthContainer({
//   children,
//   title = "Mosaic",
//   subtitle = "Build consistency. Track what matters.",
// }: AuthContainerProps) {
//   return (
//     <View className="flex-1 bg-background-light dark:bg-background-dark">
//       <View className="absolute inset-0">
//         <LinearGradient
//           colors={[
//             "rgba(99,102,241,0.12)",
//             "rgba(99,102,241,0.05)",
//             "transparent",
//           ]}
//           start={{ x: 0.5, y: 0 }}
//           end={{ x: 0.5, y: 0.5 }}
//           className="absolute top-0 left-0 right-0 h-[50%]"
//         />
//       </View>

//       <View className="flex-1 justify-center px-6">
//         <View className="w-full max-w-[400px] self-center">
//           {/* Header */}
//           <View className="items-center mb-12">
//             <Image
//               source={require("../../assets/images/icon.png")}
//               className="w-14 h-14 mb-6"
//               resizeMode="contain"
//             />
//             <Text className="text-background-dark dark:text-white text-4xl font-bold">
//               {title}
//             </Text>
//             <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2">
//               {subtitle}
//             </Text>
//           </View>

//           {children}
//         </View>
//       </View>

//       {Platform.OS === "ios" && (
//         <View className="absolute bottom-2 self-center w-32 h-1.5 bg-gray-300 dark:bg-gray-800 rounded-full opacity-40" />
//       )}
//     </View>
//   );
// }

import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

interface AuthContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthContainer({
  children,
  title = "Mosaic",
  subtitle = "Build consistency. Track what matters.",
}: AuthContainerProps) {
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="absolute inset-0">
        <LinearGradient
          colors={[
            "rgba(99,102,241,0.12)",
            "rgba(99,102,241,0.05)",
            "transparent",
          ]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
          className="absolute top-0 left-0 right-0 h-[50%]"
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingVertical: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-[400px] self-center">
            <View className="items-center mb-12">
              <Image
                source={require("../../assets/images/icon.png")}
                className="w-14 h-14 mb-6"
                resizeMode="contain"
              />
              <Text className="text-background-dark dark:text-white text-4xl font-bold">
                {title}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2">
                {subtitle}
              </Text>
            </View>

            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {Platform.OS === "ios" && (
        <View className="absolute bottom-2 self-center w-32 h-1.5 bg-gray-300 dark:bg-gray-800 rounded-full opacity-40" />
      )}
    </View>
  );
}
