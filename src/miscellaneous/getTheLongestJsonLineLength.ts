/** Next line is determined by ","!
 * @returns character count
 */
export default function getTheLongestJsonLineLength(str: string) {
  const linesArr = JSON.stringify(str, null, 2)
  .split(",")
  .map(line => line.replace(/\\n|[\\{}]/g, "")); // get rid of "\n", "\" and curly braces
  
  return linesArr.reduce((longest, { length }) => longest < length ? length : longest, 0);
}
