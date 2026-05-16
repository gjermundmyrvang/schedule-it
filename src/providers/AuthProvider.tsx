import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  use,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { Alert } from "react-native";
import { supabase } from "../utils/supabase";
import {
  clearSession,
  loadSession,
  saveSession,
} from "../utils/useStorageState";

const AuthContext = createContext<{
  signIn: (email: string) => Promise<boolean>;
  verifyOtp: (email: string, token: string) => Promise<boolean>;
  signOut: () => void;
  session: Session | null;
  user: User | null;
  isLoading: boolean;
} | null>(null);

export function useAuth() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useAuth must be wrapped in a <AuthProvider />");
  }
  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession().then((stored) => {
      if (stored) {
        supabase.auth.setSession(stored).catch(console.error);
      }
      setIsLoading(false);
    });

    // Letting Supabase handle auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        saveSession(newSession.access_token, newSession.refresh_token).catch(
          console.error,
        );
      } else {
        clearSession().catch(console.error);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
    return !!data.session;
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        verifyOtp,
        signOut,
        session,
        user: session?.user ?? null,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
