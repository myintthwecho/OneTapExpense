import { AuthProvider, useAuth } from "@/features/auth/context/AuthContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import "react-native-reanimated";

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      console.log("Route guard: Still loading auth...");
      return;
    }

    const currentRoute = segments[0];
    const isAuthRoute = currentRoute === "login" || currentRoute === "register";
    const isLandingRoute = currentRoute === "index";

    console.log("Route guard:", {
      user: user?.email || "none",
      currentRoute,
      isAuthRoute,
      isLandingRoute,
    });

    if (!user && !isAuthRoute && !isLandingRoute) {
      console.log("Redirecting to welcome (no user, protected route)");
      router.replace("/");
      return;
    }

    if (user && (isLandingRoute || isAuthRoute)) {
      console.log("Redirecting to expense-history (user logged in)");
      router.replace("/expense-history");
    }
  }, [isLoading, segments, user]);

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

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
