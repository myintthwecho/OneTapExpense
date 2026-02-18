import PrimaryButton from "@/components/ui/PrimaryButton";
import Spacer from "@/components/ui/Spacer";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useRouter } from "expo-router";
import { Image, StyleSheet, useColorScheme, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <ThemedView style={styles.container}>
      <Spacer height={30} />

      <View style={styles.logoBlock}>
        <Image
          source={
            colorScheme === "dark"
              ? require("@/assets/images/darklogo.png")
              : require("@/assets/images/lightlogo.png")
          }
          style={styles.logo}
        />
      </View>

      <View style={styles.heroBlock}>
        <ThemedText title style={styles.appName}>
          OneTapExpense
        </ThemedText>
        <ThemedText style={styles.heroText}>
          Track your expenses in one tap.
        </ThemedText>
      </View>

      <View style={styles.actionsBlock}>
        <PrimaryButton title="Get Started" onPress={handleRegister} />
        <Spacer height={14} />
        <PrimaryButton title="Log In" onPress={handleLogin} />
      </View>

      <Spacer height={16} />
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
  logoBlock: {
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  heroBlock: {
    alignItems: "center",
    marginBottom: 36,
  },
  appName: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  heroText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 260,
  },
  actionsBlock: {
    width: "100%",
    maxWidth: 320,
  },
});
