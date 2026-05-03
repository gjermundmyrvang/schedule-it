import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { Event } from "../types/supabase-types";
import { supabase } from "../utils/supabase";

export function useEvents(calendarId: string | null, month: Date) {
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const start = new Date(
    month.getFullYear(),
    month.getMonth(),
    1,
  ).toISOString();
  const end = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0,
    23,
    59,
    59,
  ).toISOString();

  useEffect(() => {
    if (!calendarId) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    fetchEvents();

    const subscription = supabase
      .channel(`events:${calendarId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `calendar_id=eq.${calendarId}`,
        },
        fetchEvents,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarId, month.getFullYear(), month.getMonth()]);

  async function fetchEvents() {
    if (!calendarId) return;

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("calendar_id", calendarId)
      .gte("starts_at", start)
      .lte("starts_at", end)
      .order("starts_at", { ascending: true });

    if (error) console.error(error);
    else setEvents(data ?? []);

    setIsLoading(false);
  }

  async function createEvent(title: string, starts_at: Date, ends_at: Date) {
    if (!calendarId || !user) return;

    const { error } = await supabase.from("events").insert({
      calendar_id: calendarId,
      title,
      starts_at: starts_at.toISOString(),
      ends_at: ends_at.toISOString(),
      created_by: user.id,
    });

    if (error) console.error(error);
  }

  async function deleteEvent(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) console.error(error);
  }

  return { events, isLoading, createEvent, deleteEvent };
}
