export default function capitalizeFirstLetter(str: string) {
  return `${str[0].toUpperCase()}${str.substring(1)}`;
}