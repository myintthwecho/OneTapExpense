import { AuthProvider, useAuth } from "@/features/auth/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, Text, useColorScheme, View } from "react-native";
import "react-native-reanimated";

function RootNavigator() {
  const { user, isLoading, configError } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading || configError) {
      return;
    }

    const currentRoute = segments[0];
    const isAuthRoute = currentRoute === "login" || currentRoute === "register";
    const isLandingRoute = currentRoute === "index";

    if (!user && !isAuthRoute && !isLandingRoute) {
      router.replace("/");
      return;
    }

    if (user && (isLandingRoute || isAuthRoute)) {
      router.replace("/expense-history");
    }
  }, [isLoading, configError, segments, user, router]);

  if (configError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ textAlign: "center" }}>
          App configuration error. Please contact support.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          title: "Login",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: true,
          title: "Register",
        }}
      />
      <Stack.Screen
        name="expense-history"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-expense"
        options={{
          presentation: "transparentModal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    MaterialCommunityIcons.loadFont().catch((e) => {
      console.warn("Font loading error:", e);
    });
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
