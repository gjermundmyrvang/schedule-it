import {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { Calendar, EventWithAssignees } from "../types/supabase-types";
import { supabase } from "../utils/supabase";
import { useStorageState } from "../utils/useStorageState";
import { useAuth } from "./AuthProvider";

interface CalendarContextType {
  activeCalendar: Calendar | null;
  setActiveCalendar: (calendar: Calendar) => void;
  events: EventWithAssignees[];
  isLoadingEvents: boolean;
  createEvent: (
    title: string,
    starts_at: Date,
    ends_at: Date,
    additionalAssignees?: string[],
  ) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  focusedMonth: Date;
  setFocusedMonth: (date: Date) => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();

  const [[, activeCalendarId], setActiveCalendarId] =
    useStorageState("activeCalendarId");
  const [activeCalendar, setActiveCalendar] = useState<Calendar | null>(null);
  const [events, setEvents] = useState<EventWithAssignees[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [focusedMonth, setFocusedMonth] = useState(new Date());

  useEffect(() => {
    if (activeCalendarId) {
      supabase
        .from("calendars")
        .select("*")
        .eq("id", activeCalendarId)
        .single()
        .then(({ data }) => {
          if (data) setActiveCalendar(data);
        });
    } else {
      supabase
        .from("calendars")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .single()
        .then(({ data }) => {
          if (data) {
            setActiveCalendar(data);
            setActiveCalendarId(data.id);
          }
        });
    }
  }, [activeCalendarId, setActiveCalendarId]);

  // Fetch events for focused month
  const fetchEvents = useCallback(async () => {
    if (!activeCalendar) {
      setEvents([]);
      setIsLoadingEvents(false);
      return;
    }

    const start = new Date(
      focusedMonth.getFullYear(),
      focusedMonth.getMonth(),
      1,
    ).toISOString();
    const end = new Date(
      focusedMonth.getFullYear(),
      focusedMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
    ).toISOString();

    const { data, error } = await supabase
      .from("events")
      .select("*, assignees:event_assignees(*)")
      .eq("calendar_id", activeCalendar.id)
      .gte("starts_at", start)
      .lte("starts_at", end)
      .order("starts_at", { ascending: true });

    if (error) console.error(error);
    else setEvents(data ?? []);
    setIsLoadingEvents(false);
  }, [activeCalendar, focusedMonth]);

  useEffect(() => {
    fetchEvents();

    if (!activeCalendar) return;

    const subscription = supabase
      .channel(`events:${activeCalendar.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events",
          filter: `calendar_id=eq.${activeCalendar.id}`,
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
  }, [fetchEvents, activeCalendar]);

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

  return (
    <CalendarContext.Provider
      value={{
        activeCalendar,
        setActiveCalendar,
        events,
        isLoadingEvents,
        createEvent,
        deleteEvent,
        focusedMonth,
        setFocusedMonth,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext() {
  const value = use(CalendarContext);
  if (!value)
    throw new Error(
      "useCalendarContext must be wrapped in a <CalendarProvider />",
    );
  return value;
}
