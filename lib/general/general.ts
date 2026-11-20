export const delayBy = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
