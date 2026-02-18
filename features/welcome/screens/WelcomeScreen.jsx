import PrimaryButton from "@/components/ui/PrimaryButton";
import Spacer from "@/components/ui/Spacer";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useRouter } from "expo-router";
import { Image, StyleSheet } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <ThemedView style={styles.container}>
      {/* Logo */}
      <Image source={require("@/assets/images/icon.png")} style={styles.logo} />

      <Spacer height={40} />

      {/* App Name */}
      <ThemedText title style={styles.appName}>
        OneTapExpense
      </ThemedText>

      <Spacer height={20} />

      {/* Hero Text */}
      <ThemedText style={styles.heroText}>
        Track your expenses in seconds with one tap.
      </ThemedText>

      <Spacer height={50} />

      {/* Login Button */}
      <PrimaryButton title="Login" onPress={handleLogin} />

      <Spacer height={16} />

      {/* Register Button */}
      <PrimaryButton title="Register" onPress={handleRegister} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  heroText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24,
  },
});
