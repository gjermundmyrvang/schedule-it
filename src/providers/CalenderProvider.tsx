import {
  createContext,
  use,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { Calendar } from "../types/supabase-types";
import { supabase } from "../utils/supabase";
import { useStorageState } from "../utils/useStorageState";

interface CalendarContextType {
  activeCalendar: Calendar | null;
  setActiveCalendar: (calendar: Calendar) => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: PropsWithChildren) {
  const [[, activeCalendarId], setActiveCalendarId] =
    useStorageState("activeCalendarId");
  const [activeCalendar, setActiveCalendar] = useState<Calendar | null>(null);

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

  return (
    <CalendarContext.Provider value={{ activeCalendar, setActiveCalendar }}>
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
