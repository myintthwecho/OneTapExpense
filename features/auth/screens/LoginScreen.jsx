import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { StyleSheet } from "react-native";

export default function LoginScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText title style={styles.text}>
        Login Screen
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
