export const logMessageWithTimestamp = (...message: any[]) => {
  const date = new Date();
  const formatted = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
  console.log(`[${formatted}]`, ...message);
};
