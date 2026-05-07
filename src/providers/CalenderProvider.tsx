import {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { Alert } from "react-native";
import { Calendar, EventWithAssignees } from "../types/supabase-types";
import { supabase } from "../utils/supabase";
import { useStorageState } from "../utils/useStorageState";
import { useAuth } from "./AuthProvider";

interface CalendarContextType {
  calendars: Calendar[];
  isLoadingCalendars: boolean;
  activeCalendar: Calendar | null;
  setActiveCalendar: (calendar: Calendar) => void;
  events: EventWithAssignees[];
  isLoadingEvents: boolean;
  focusedMonth: Date;
  setFocusedMonth: (date: Date) => void;
  refetchCalendars: () => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [[, activeCalendarId], setActiveCalendarId] =
    useStorageState("activeCalendarId");
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isLoadingCalendars, setIsLoadingCalendars] = useState(true);
  const [activeCalendar, setActiveCalendar] = useState<Calendar | null>(null);
  const [events, setEvents] = useState<EventWithAssignees[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [focusedMonth, setFocusedMonth] = useState(new Date());

  // Fetch all calendars
  const fetchCalendars = useCallback(async () => {
    if (!user) {
      Alert.alert("Cant fetch calendars when no user");
      return;
    }
    const { data, error } = await supabase
      .from("calendar_members")
      .select("calendar:calendars(*)")
      .eq("user_id", user!.id);

    if (error) {
      Alert.alert("Error fetching calendars", error.message);
    } else {
      const calendars = data.map((row) => row.calendar as unknown as Calendar);
      setCalendars(calendars);
    }
    setIsLoadingCalendars(false);
  }, [user]);

  useEffect(() => {
    fetchCalendars();

    const subscription = supabase
      .channel("calendars")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "calendars" },
        fetchCalendars,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "calendar_members" },
        fetchCalendars,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchCalendars]);

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

  return (
    <CalendarContext.Provider
      value={{
        calendars,
        isLoadingCalendars,
        activeCalendar,
        setActiveCalendar,
        events,
        isLoadingEvents,
        focusedMonth,
        setFocusedMonth,
        refetchCalendars: fetchCalendars,
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
