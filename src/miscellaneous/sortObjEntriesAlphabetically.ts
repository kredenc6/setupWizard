const sortObjEntriesAlphabetically = <V>(entries: [string, V][]) => {
  return entries.sort(([keyA, _A], [keyB, _B]) => {
    if (keyA.toLocaleLowerCase() < keyB.toLocaleLowerCase()) return -1;
    if (keyA.toLocaleLowerCase() > keyB.toLocaleLowerCase()) return 1;
    return 0;
  });
};

export default sortObjEntriesAlphabetically;