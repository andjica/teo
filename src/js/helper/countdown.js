export const leftTime = (t) => {
  const diffInSeconds = Math.floor((new Date(t).getTime() - Date.now()) / 1000);
  if (diffInSeconds <= 0) return "Expired";

  const days = Math.floor(diffInSeconds / (3600 * 24));
  const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  return `${days}days ${hours}:${minutes}:${seconds}`;
};
