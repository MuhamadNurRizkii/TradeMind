export const getCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startWeekDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days: (Date | null)[] = [];

  for (let i = 0; i < startWeekDay; i++) days.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  return days;
};
