import { rgbToHex } from "@material-ui/core/styles";

/** Ignores alpha values */
const rgbaToHex = (origColor: string) => {
  const rgbRegExp  = origColor.replace(/\s/g, '').match(/^rgba\((\d+),(\d+),(\d+)[\S\s]*/i);
  if(!rgbRegExp) {
    console.warn(`Expected rgba color. Received ${origColor} instead.`);
    return origColor;
  }
  const rgb = `rgb(${rgbRegExp[1]},${rgbRegExp[2]},${rgbRegExp[3]})`;
  return rgbToHex(rgb);
};

export default rgbaToHex;