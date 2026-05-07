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

  return { createCalendar, deleteCalendar };
}
