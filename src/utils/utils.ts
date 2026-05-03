const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function isToday(d: Date) {
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

export function generateMonths(startDate: Date): Date[] {
  const months: Date[] = [];
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date();
  end.setMonth(end.getMonth() + 24); // 2 years into the future

  let current = start;
  while (current <= end) {
    months.push(new Date(current));
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  }

  return months;
}

export function getMonthString(d: Date) {
  return d.toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });
}
