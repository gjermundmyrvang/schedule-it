import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "session";

export async function loadSession() {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveSession(access_token: string, refresh_token: string) {
  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ access_token, refresh_token }),
  );
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
