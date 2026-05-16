import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { useAuth } from "./AuthProvider";

const ACTIVE_CALENDAR_KEY = "activeCalendarId";

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
  refetchEvents: () => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isLoadingCalendars, setIsLoadingCalendars] = useState(true);
  const [activeCalendarId, setActiveCalendarId] = useState<string | null>(null);
  const [events, setEvents] = useState<EventWithAssignees[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [focusedMonth, setFocusedMonth] = useState(new Date());

  const activeCalendar =
    calendars.find((c) => c.id === activeCalendarId) ?? null;

  useEffect(() => {
    AsyncStorage.getItem(ACTIVE_CALENDAR_KEY)
      .then((id) => {
        if (id) setActiveCalendarId(id);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (activeCalendarId || calendars.length === 0) return;
    persistActiveCalendar(calendars[0].id);
  }, [calendars, activeCalendarId]);

  function persistActiveCalendar(id: string) {
    setActiveCalendarId(id);
    AsyncStorage.setItem(ACTIVE_CALENDAR_KEY, id).catch(console.error);
  }

  const setActiveCalendar = useCallback((calendar: Calendar) => {
    persistActiveCalendar(calendar.id);
  }, []);

  const refetchCalendars = useCallback(async () => {
    if (!user) return;
    setIsLoadingCalendars(true);

    const { data, error } = await supabase
      .from("calendar_members")
      .select("calendar:calendars(*)")
      .eq("user_id", user.id);

    if (error) Alert.alert("Error fetching calendars", error.message);
    else setCalendars(data.map((row) => row.calendar as unknown as Calendar));

    setIsLoadingCalendars(false);
  }, [user]);

  const refetchEvents = useCallback(async () => {
    if (!activeCalendar) {
      setEvents([]);
      setIsLoadingEvents(false);
      return;
    }
    setIsLoadingEvents(true);

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
    refetchCalendars();
  }, [refetchCalendars]);
  useEffect(() => {
    refetchEvents();
  }, [refetchEvents]);

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
        refetchCalendars,
        refetchEvents,
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
