export function ucFirst(str: string) {
  return `${str.substring(0, 1).toLocaleUpperCase()}${str
    .substring(1)
    .toLocaleLowerCase()}`;
}
