export const secondsToISODate = (seconds: number): string => {
  return new Date(seconds * 1000).toISOString();
};
