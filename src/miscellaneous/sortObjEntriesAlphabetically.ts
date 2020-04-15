const sortObjEntriesAlphabetically = <K extends keyof V, V>(entries: [K, V][]): [K, V][] => {
  return entries.sort(([keyA, _A], [keyB, _B]) => {
    if (String(keyA).toLocaleLowerCase() < String(keyB).toLocaleLowerCase()) return -1;
    if (String(keyA).toLocaleLowerCase() > String(keyB).toLocaleLowerCase()) return 1;
    return 0;
  });
};

export default sortObjEntriesAlphabetically;