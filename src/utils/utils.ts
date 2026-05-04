const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function isToday(d: Date) {
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

export function generateMonths(startDate: Date): Date[] {
  const months: Date[] = [];
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date();
  end.setMonth(end.getMonth() + 24);

  let current = start;
  while (current <= end) {
    months.push(new Date(current));
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }

  return months;
}

export function getDaysInMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Monday-based offset (0 = Mon, 6 = Sun)
  const startOffset = (firstDay.getDay() + 6) % 7;

  const days: (Date | null)[] = Array(startOffset).fill(null);

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  // Pad end to complete the last row
  while (days.length % 7 !== 0) days.push(null);

  return days;
}

export function getMonthString(d: Date) {
  return d.toLocaleDateString("default", {
    month: "long",
  });
}

export function getMonthYearString(d: Date) {
  return d.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });
}

export function formatDateParam(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}-${m}-${d}`;
}

export function parseDateParam(param: string): Date {
  const [y, m, d] = param.split("-").map(Number);
  return new Date(y, m - 1, d);
}
