import { SplashScreen } from "expo-router";
import { useAuth } from "../providers/AuthProvider";

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useAuth();

  if (!isLoading) {
    SplashScreen.hide();
  }

  return null;
}
