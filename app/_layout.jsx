import { AuthProvider, useAuth } from "@/features/auth/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, useColorScheme, View } from "react-native";
import "react-native-reanimated";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
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
  }, [isLoading, segments, user, router]);

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
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts (needed for @expo/vector-icons on web)
        await MaterialCommunityIcons.loadFont();
      } catch (e) {
        console.warn("Font loading error:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
