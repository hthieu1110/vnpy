export const mergeByKey = (oldList: any[], newList: any[], key: string) => {
  const map = new Map(oldList.map((item) => [item[key], { ...item }]));

  for (const obj of newList) {
    const existing = map.get(obj[key]);
    map.set(obj[key], existing ? { ...existing, ...obj } : obj);
  }

  return Array.from(map.values());
};
