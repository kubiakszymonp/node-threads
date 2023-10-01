export const logTime = (...message: any[]) => {
  const date = new Date();
  const formatted = `${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
  console.log(`[${formatted}]`, ...message);
};
export const ar = ["siemaszko"];
