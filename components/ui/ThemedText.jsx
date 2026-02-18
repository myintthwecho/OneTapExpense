import Colors from "@/constants/Colors";
import { StyleSheet, Text, useColorScheme } from "react-native";

export function ThemedText({ title = false, style, children, ...props }) {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme] || Colors.light;

  const textColor = title ? themeColors.title : themeColors.text;

  return (
    <Text style={[styles.text, { color: textColor }, style]} {...props}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});
