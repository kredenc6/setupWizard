export function unprefixValue(prefix: string | undefined, value: string) {
  if(prefix && value.startsWith(prefix)) return value.substring(prefix.length);
  return value;
}

export function prefixValue(prefix: string | undefined, value: string) {
  return value.length > 0 ?
    (prefix || "") + value
    :
    value; // don't prefix an empty value - textField removal logic is based on an empty string
}