export const groupBy = <K, V>(values: V[], getKey: (v: V) => K): Map<K, V[]> => {
  const out: Map<K, V[]> = new Map();
  values.forEach((v: V) => {
    const key = getKey(v);
    const item = out.get(key);
    if (item !== undefined)
      item.push(v);
    else
      out.set(key, [v]);
  });
  return out;
}
