import ColorPicker, { HABIT_COLORS } from "@/components/habit/ColorPicker";
import FrequencyPicker from "@/components/habit/FrequencyPicker";
import GoalStepper from "@/components/habit/GoalStepper";
import IconPicker from "@/components/habit/IconPicker";
import { useHabits } from "@/context/HabitContext";
import { useLoader } from "@/hooks/useLoader";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * AddHabitScreen handles habit creation with validation.
 * Rendered as a modal from the FAB.
 */
export default function AddHabitScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { createHabit } = useHabits();
  const { isLoading, showLoader, hideLoader } = useLoader();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("water");
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">(
    "daily",
  );
  const [goal, setGoal] = useState(1);
  const [titleError, setTitleError] = useState("");

  // runs before submit, sets inline error if invalid
  const validate = (): boolean => {
    if (!title.trim()) {
      setTitleError("Habit name is required");
      return false;
    }
    if (title.trim().length < 3) {
      setTitleError("Must be at least 3 characters");
      return false;
    }
    setTitleError("");
    return true;
  };

  const handleCreate = async () => {
    if (isLoading) return;
    if (!validate()) return;
    try {
      showLoader();
      await createHabit({
        title: title.trim(),
        description: description.trim() || undefined,
        icon: selectedIcon,
        color: selectedColor,
        frequency,
        goal,
        isActive: true,
      });
      router.dismiss();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create habit");
    } finally {
      hideLoader();
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-light dark:bg-background-dark"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* top bar */}
      <View className="flex-row items-center px-4 py-3 justify-between border-b border-slate-200 dark:border-white/5">
        <TouchableOpacity
          onPress={() => router.dismiss()}
          className="size-10 items-center justify-center rounded-full"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={24} color="#9ca3af" />
        </TouchableOpacity>
        <Text className="text-gray-900 dark:text-white text-lg font-bold">
          Create Habit
        </Text>
        <TouchableOpacity
          onPress={handleCreate}
          disabled={isLoading}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text
            className="font-bold text-base"
            style={{ color: isLoading ? "#9ca3af" : "#f48c25" }}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        <View className="px-4 pt-6 pb-4 gap-2">
          <Text className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
            Habit Name
          </Text>
          <TextInput
            value={title}
            onChangeText={(v) => {
              setTitle(v);
              if (titleError) setTitleError("");
            }}
            placeholder="e.g. Morning Meditation"
            placeholderTextColor="#9ca3af"
            maxLength={50}
            className="bg-slate-100 dark:bg-[#1c1c1e] rounded-xl p-4 text-xl font-semibold text-gray-900 dark:text-white"
          />
          {titleError ? (
            <Text className="text-red-500 text-xs px-1">{titleError}</Text>
          ) : null}
        </View>

        <View className="px-4 pb-6 gap-2">
          <Text className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
            Description{" "}
            <Text className="opacity-50 normal-case tracking-normal text-[10px]">
              (optional)
            </Text>
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Why is this important to you?"
            placeholderTextColor="#9ca3af"
            multiline
            className="bg-slate-100 dark:bg-[#1c1c1e] rounded-xl p-4 text-base text-gray-900 dark:text-white"
            style={{ minHeight: 90, textAlignVertical: "top" }}
          />
        </View>

        <View className="px-4 py-2">
          <IconPicker
            selectedKey={selectedIcon}
            selectedColor={selectedColor}
            onSelect={setSelectedIcon}
          />
        </View>

        <View className="px-4 py-6">
          <ColorPicker
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
          />
        </View>

        <View className="px-4 pb-6 gap-3">
          <Text className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest px-1">
            Frequency
          </Text>
          <FrequencyPicker
            selected={frequency.charAt(0).toUpperCase() + frequency.slice(1)}
            onSelect={(v) => setFrequency(v.toLowerCase() as any)}
          />
        </View>

        <View className="px-4 pb-8">
          <GoalStepper value={goal} frequency={frequency} onChange={setGoal} />
        </View>
      </ScrollView>

      {/* bottom CTA  */}
      <View
        className=" bottom-0 left-0 right-0 px-4 bg-background-light/95 dark:bg-background-dark/95 border-t border-slate-200 dark:border-white/5"
        style={{ paddingBottom: insets.bottom + 12, paddingTop: 12 }}
      >
        <TouchableOpacity
          onPress={handleCreate}
          activeOpacity={0.85}
          disabled={isLoading}
          className="w-full h-14 rounded-xl items-center justify-center flex-row gap-2"
          style={{
            backgroundColor: isLoading ? "#d1d5db" : selectedColor,
            shadowColor: selectedColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Ionicons name="checkmark" size={20} color="white" />
          <Text className="text-white font-bold text-lg">
            {isLoading ? "Creating..." : "Create Habit"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
