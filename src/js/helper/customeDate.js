export const isToday = (dateStr) => {
  const today = new Date();
  const date = new Date(dateStr);

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};
