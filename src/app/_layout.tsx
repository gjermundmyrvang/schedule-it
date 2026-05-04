import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "../global.css";
import { AuthProvider, useAuth } from "../providers/AuthProvider";
import { ThemeProvider } from "../providers/ThemeProvider";
import { SplashScreenController } from "../utils/splash";

function RootNavigator() {
  const { session } = useAuth();
  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SplashScreenController />
      <ThemeProvider>
        <KeyboardProvider>
          <RootNavigator />
        </KeyboardProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
