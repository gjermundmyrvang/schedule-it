import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { EventWithAssignees } from "../types/supabase-types";
import { supabase } from "../utils/supabase";

export function useEvents(calendarId: string | null, month: Date) {
  const { user } = useAuth();

  const [events, setEvents] = useState<EventWithAssignees[]>([]);
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

  const fetchEvents = useCallback(async () => {
    if (!calendarId) {
      setEvents([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .select("*, assignees:event_assignees(*)")
      .eq("calendar_id", calendarId)
      .gte("starts_at", start)
      .lte("starts_at", end)
      .order("starts_at", { ascending: true });

    if (error) console.error(error);
    else setEvents(data ?? []);
    setIsLoading(false);
  }, [calendarId, start, end]);

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
        () => fetchEvents(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event_assignees" },
        () => fetchEvents(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchEvents, calendarId]);

  async function createEvent(
    title: string,
    starts_at: Date,
    ends_at: Date,
    additionalAssignees: string[] = [],
  ) {
    if (!calendarId || !user) {
      console.log("early return - calendarId:", calendarId, "session:", !!user);
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .insert({
        calendar_id: calendarId,
        title,
        starts_at: starts_at.toISOString(),
        ends_at: ends_at.toISOString(),
        created_by: user.id,
      })
      .select()
      .single();

    if (error) console.error(error);

    if (additionalAssignees.length > 0) {
      const { error: assigneeError } = await supabase
        .from("event_assignees")
        .insert(
          additionalAssignees.map((user_id) => ({
            event_id: data.id,
            user_id,
          })),
        );

      if (assigneeError) console.error(assigneeError);
    }
  }

  async function deleteEvent(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) console.error(error);
  }

  return { events, isLoading, createEvent, deleteEvent };
}
