import { EventWithAssignees } from "../types/supabase-types";

export function getEventsForDay(
  day: Date,
  events: EventWithAssignees[],
): EventWithAssignees[] {
  return events.filter((e) => {
    const start = new Date(e.starts_at);
    const end = new Date(e.ends_at);

    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const eventStart = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
    );
    const eventEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    return dayStart >= eventStart && dayStart <= eventEnd;
  });
}

export function getDotColor(
  event: EventWithAssignees,
  user_id: string,
): string {
  const assigneeIds = event.assignees.map((a) => a.user_id);
  const isMe = assigneeIds.includes(user_id);
  const othersOnly = !isMe && assigneeIds.length > 0;

  if (assigneeIds.length > 1) return "#a855f7"; // both/all → purple
  if (isMe) return "#ff4800"; // just me → orange
  if (othersOnly) return "#3b82f6"; // just others → blue
  return "#888";
}
