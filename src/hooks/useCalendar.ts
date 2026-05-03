import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { Calendar } from "../types/supabase-types";
import { supabase } from "../utils/supabase";

export function useCalendars() {
  const { user } = useAuth();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCalendars();

    const subscription = supabase
      .channel("calendars")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "calendars" },
        fetchCalendars,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchCalendars() {
    const { data, error } = await supabase
      .from("calendars")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) Alert.alert("Error", error.message);
    else setCalendars(data ?? []);

    setIsLoading(false);
  }

  async function createCalendar(name: string) {
    console.log(user?.id);
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

  return { calendars, isLoading, createCalendar, deleteCalendar };
}
