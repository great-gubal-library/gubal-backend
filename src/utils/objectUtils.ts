export const pickFields = (...keys: string[]) => (t: any): any =>
  keys.reduce((acc, key) => ({...acc, [key]: t[key]}), {});
