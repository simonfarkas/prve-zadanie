export const formatDate = (unix: string) => {
  const date = new Date(Number(unix) * 1000)
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${date.toLocaleDateString()} ${hours}:${minutes}`; 
};
