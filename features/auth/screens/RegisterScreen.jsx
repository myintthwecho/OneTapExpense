import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Spacer from "@/components/ui/Spacer";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import Colors from "@/constants/Colors";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    useColorScheme,
} from "react-native";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;

  const getRegisterErrorMessage = (code) => {
    if (code === "auth/email-already-in-use") {
      return "This email is already in use.";
    }

    if (code === "auth/invalid-email") {
      return "Please enter a valid email address.";
    }

    if (code === "auth/weak-password") {
      return "Password should be at least 6 characters.";
    }

    return "Unable to create account right now. Please try again.";
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert(
        "Missing fields",
        "Please complete name, email, password, and confirm password.",
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please make sure both password fields are the same.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await register({ name, email, password });
    } catch (error) {
      Alert.alert("Registration failed", getRegisterErrorMessage(error?.code));
    } finally {
      setIsSubmitting(false);
    }
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
            Create your account to start tracking.
          </ThemedText>

          <Spacer height={50} />

          {/* Name Input */}
          <TextInput
            style={[
              styles.input,
              {
                borderColor: themeColors.border,
                color: themeColors.text,
                backgroundColor: themeColors.inputBackground,
              },
            ]}
            placeholder="Full Name"
            placeholderTextColor={themeColors.iconColour}
            value={name}
            onChangeText={setName}
          />

          <Spacer height={16} />

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

          <Spacer height={16} />

          {/* Confirm Password Input */}
          <TextInput
            style={[
              styles.input,
              {
                borderColor: themeColors.border,
                color: themeColors.text,
                backgroundColor: themeColors.inputBackground,
              },
            ]}
            placeholder="Confirm Password"
            placeholderTextColor={themeColors.iconColour}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Spacer height={50} />

          {/* Register Button */}
          <PrimaryButton
            title={isSubmitting ? "Creating account..." : "Register"}
            onPress={handleRegister}
          />

          <Spacer height={24} />

          {/* Login Link */}
          <SecondaryButton
            title="Already have an account? Login"
            route="/login"
          />
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
