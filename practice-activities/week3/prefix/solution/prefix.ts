interface Dictionary {
  [key: string]: number
}

export function prefixSearch(dictionary: Dictionary, keyPrefix: string) {
  return Object.fromEntries(
    Object.entries(dictionary).filter(([key, _]) => key.startsWith(keyPrefix)));
}
