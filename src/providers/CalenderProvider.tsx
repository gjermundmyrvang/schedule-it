import { createContext, use, useState, type PropsWithChildren } from "react";
import { Calendar } from "../types/supabase-types";

interface CalendarContextType {
  activeCalendar: Calendar | null;
  setActiveCalendar: (calendar: Calendar) => void;
}

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: PropsWithChildren) {
  const [activeCalendar, setActiveCalendar] = useState<Calendar | null>(null);

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
