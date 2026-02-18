import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export default function SecondaryButton({ title, onPress, route = "/register" }) {
  const router = useRouter();

  const handlePress = () => {
    onPress?.();
    router.push(route);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={handlePress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
