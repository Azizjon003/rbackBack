export const transformIsDate = (arg: unknown): Date => {
  const d = new Date(arg as string);
  if (isNaN(d.getTime())) {
    throw new Error('Invalid date: ' + String(arg));
  }
  return d;
};
