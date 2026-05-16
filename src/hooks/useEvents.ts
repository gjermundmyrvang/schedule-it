import { Alert } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { useCalendarContext } from "../providers/CalenderProvider";
import { Event } from "../types/supabase-types";
import { supabase } from "../utils/supabase";

export function useEvents() {
  const { user } = useAuth();
  const { activeCalendar, refetchEvents } = useCalendarContext();

  async function createEvent(
    title: string,
    starts_at: Date,
    ends_at: Date,
    additionalAssignees: string[] = [],
  ) {
    if (!activeCalendar || !user) return;

    const { data, error } = await supabase
      .from("events")
      .insert({
        calendar_id: activeCalendar.id,
        title,
        starts_at: starts_at.toISOString(),
        ends_at: ends_at.toISOString(),
        created_by: user.id,
      })
      .select()
      .single();

    if (error) console.error(error);

    if (additionalAssignees.length > 0) {
      addAdditionalAssignees(additionalAssignees, data);
    }
    await refetchEvents();
  }

  async function addAdditionalAssignees(additional: string[], data: Event) {
    const { error: assigneeError } = await supabase
      .from("event_assignees")
      .insert(
        additional.map((user_id) => ({
          event_id: data.id,
          user_id,
        })),
      );

    if (assigneeError)
      Alert.alert("Error adding extra assignees", assigneeError.message);
  }

  async function deleteEvent(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) Alert.alert("Error deleting event", error.message);
    await refetchEvents();
  }

  return { createEvent, deleteEvent };
}
