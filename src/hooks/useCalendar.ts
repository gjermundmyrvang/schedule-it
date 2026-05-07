import { Alert } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { supabase } from "../utils/supabase";

export function useCalendars() {
  const { user } = useAuth();

  async function createCalendar(name: string) {
    if (!user) return;

    const { error } = await supabase
      .from("calendars")
      .insert({ name, created_by: user.id });

    if (error) console.error(error);
  }

  async function deleteCalendar(id: string) {
    const { error } = await supabase.from("calendars").delete().eq("id", id);

    if (error) console.error(error);
  }

  async function leaveCalendar(id: string) {
    console.log("leaving calendar", id, "user", user?.id);
    const { data, error } = await supabase
      .from("calendar_members")
      .delete()
      .eq("calendar_id", id)
      .eq("user_id", user!.id)
      .select();

    console.log("deleted rows:", data, "error:", error);
    if (error) console.error(error);
  }

  async function joinCalendar(code: string) {
    if (!user) {
      Alert.alert("User not logged in");
      return;
    }
    const trimmed = code.trim().toUpperCase();
    console.log("Looking up code:", trimmed, "length:", trimmed.length);

    const { data: calendar } = await supabase
      .from("calendars")
      .select("id")
      .eq("invite_code", code.trim().toUpperCase())
      .maybeSingle();

    if (!calendar) {
      Alert.alert("Invalid code", "No calendar found with that code.");
      return;
    }

    const { error: joinError } = await supabase
      .from("calendar_members")
      .insert({ calendar_id: calendar.id, user_id: user.id });

    if (joinError) {
      if (joinError.code === "23505") {
        Alert.alert(
          "Already a member",
          "You have already joined this calendar.",
        );
      } else {
        Alert.alert("Failed to join", joinError.message);
      }
      return;
    }

    return { error: null };
  }

  return { createCalendar, deleteCalendar, joinCalendar, leaveCalendar };
}
