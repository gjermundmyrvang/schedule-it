import { Session, User } from "@supabase/supabase-js";
import { createContext, use, type PropsWithChildren } from "react";
import { Alert } from "react-native";
import { supabase } from "../utils/supabase";
import { useStorageState } from "../utils/useStorageState";

const AuthContext = createContext<{
  signIn: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, token: string) => Promise<boolean>;
  signOut: () => void;
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}>({
  signIn: async () => false,
  verifyOtp: async () => false,
  signOut: () => null,
  session: null,
  user: null,
  isLoading: false,
});

export function useAuth() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useAuth must be wrapped in a <AuthProvider />");
  }
  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [[isLoading, sessionString], setSession] = useStorageState("session");

  const session: Session | null = sessionString
    ? JSON.parse(sessionString)
    : null;
  const user: User | null = session?.user ?? null;

  async function signIn(email: string): Promise<boolean> {
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      Alert.alert("Error", error.message);
      return false;
    }

    return true;
  }

  async function verifyOtp(email: string, token: string): Promise<boolean> {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      Alert.alert("Invalid code", error.message);
      return false;
    }

    if (data.session) {
      setSession(JSON.stringify(data.session));
    }

    return true;
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        verifyOtp,
        signOut: () => setSession(null),
        session,
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
