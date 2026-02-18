import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Spacer from "@/components/ui/Spacer";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;

  const handleLogin = () => {
    // TODO: Implement authentication logic
    console.log("Login pressed", { email, password });
    router.push("/expense-history");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* App Name */}
          <ThemedText title style={styles.appName}>
            OneTapExpense
          </ThemedText>

          <Spacer height={20} />

          {/* Hero Text */}
          <ThemedText style={styles.heroText}>
            Track your expenses in seconds.
          </ThemedText>

          <Spacer height={50} />

          {/* Email Input */}
          <TextInput
            style={[
              styles.input,
              {
                borderColor: themeColors.border,
                color: themeColors.text,
                backgroundColor: themeColors.inputBackground,
              },
            ]}
            placeholder="Email"
            placeholderTextColor={themeColors.iconColour}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable
          />

          <Spacer height={16} />

          {/* Password Input */}
          <TextInput
            style={[
              styles.input,
              {
                borderColor: themeColors.border,
                color: themeColors.text,
                backgroundColor: themeColors.inputBackground,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={themeColors.iconColour}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Spacer height={50} />

          {/* Login Button */}
          <PrimaryButton title="Login" onPress={handleLogin} />

          <Spacer height={24} />

          {/* Register Link */}
          <SecondaryButton title="Don't have an account? Register" />
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: "center",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  heroText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: "500",
  },
});
