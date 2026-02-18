import Colors from "@/constants/Colors";
import { useColorScheme, View } from "react-native";

export function ThemedView({ children, style }) {
  const colorScheme = useColorScheme();
  const bgColor = Colors[colorScheme].background;

  return <View style={[style, { backgroundColor: bgColor }]}>{children}</View>;
}
