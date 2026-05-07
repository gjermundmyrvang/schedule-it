import {
  addMonths,
  differenceInMinutes,
  eachMonthOfInterval,
  format,
  getDay,
  getDaysInMonth,
  isToday,
  parse,
  startOfMonth,
} from "date-fns";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

export { isToday };

export function generateMonths(startDate: Date): Date[] {
  return eachMonthOfInterval({
    start: startOfMonth(startDate),
    end: addMonths(new Date(), 24),
  });
}

export function getDaysInMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const totalDays = getDaysInMonth(firstDay);
  const startOffset = (getDay(firstDay) + 6) % 7;

  const days: (Date | null)[] = Array(startOffset).fill(null);

  for (let d = 1; d <= totalDays; d++) {
    days.push(new Date(year, month, d));
  }

  // Pad end to complete the last row
  while (days.length % 7 !== 0) days.push(null);

  return days;
}

export function getMonthString(d: Date) {
  return format(d, "MMMM");
}

export function getMonthYearString(d: Date) {
  return format(d, "MMMM yyyy");
}

export function getFullDateString(d: Date) {
  return format(d, "EEEE, d MMMM yyyy");
}

export function formatDateParam(date: Date): string {
  return format(date, "yyyy-M-d");
}

export function parseDateParam(param: string): Date {
  return parse(param, "yyyy-M-d", new Date());
}

export const formatTime = (d: Date) => format(d, "HH:mm");

export function formatDuration(start: Date, end: Date): string {
  const mins = differenceInMinutes(end, start);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
