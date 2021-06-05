export const sameDay = (a: Date, b: Date): boolean => {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate()
}

export const withBeginningOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const withEndOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

export const withBeginningOfNextDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export const withinHoursRange = (a: Date, b: Date, hours: number) => {
  return Math.abs(a.getTime() - b.getTime()) <= hours * 60 * 60 * 1000;
}

export const minDateNow = (date: Date) => {
  const now = new Date();
  return date >= now ? date : now;
}

export const nextQuarterHour = (date: Date) => {
  const out = new Date(date);
  const minutes = out.getMinutes()

  if (minutes > 45)
    out.setHours(out.getHours() + 1, 0, 0, 0);
  else if (minutes > 30)
    out.setMinutes(45, 0, 0);
  else if (minutes > 15)
    out.setMinutes(30, 0, 0);
  else if (minutes > 0)
    out.setMinutes(15, 0, 0);

  return out;
}
