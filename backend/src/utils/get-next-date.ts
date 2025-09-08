export const getNextDate = (date: Date): Date => {
  const next = new Date(date);
  next.setDate(date.getDate() + 1);
  return next;
};
