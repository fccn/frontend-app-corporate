export const dateFormat = (isoDateString: string | null) => {
  if (!isoDateString) {
    return null;
  }
  const date = new Date(isoDateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
        + `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  return formatted;
};
