// code from:
// https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
// https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color/3943023#3943023
// https://www.w3.org/TR/WCAG20/#relativeluminancedef

/** Accepts hex color formats with and without "#" and rgb(a) color formats. */
export default function invertColorToBlackOrWhite(color: string) {
  let rgbArr: number[];
  
  // normalize color strings to [r, g, b]: [number, number, number]
  if(color.startsWith("#") ||
     color.length === 3 ||
     color.length === 6) {
      rgbArr = normalizeFromHex(color);
  } else
  if(color.startsWith("rgb")) {
    rgbArr = normalizeFromRgb(color);
  }
  else throw Error("Function invertColorToBlackOrWhite recived invalid color string.");
  
  // calculate color luminance
  const rgbLuminanceArr: number[] = [];

  // The W3C formula for conversion from sRGB to linear RGB followed by the ITU-R recommendation BT.709 for luminance:
  for(let i=0; i<rgbArr.length; i++) {
    let conversion = rgbArr[i] / 255.0;
    if (conversion <= 0.03928) conversion = conversion / 12.92;
    else conversion = Math.pow(((conversion + 0.055) / 1.055), 2.4);

    rgbLuminanceArr[i] = conversion;
  }

  const colorLuminance =
    0.2126 * rgbLuminanceArr[0] +
    0.7152 * rgbLuminanceArr[1] +
    0.0722 * rgbLuminanceArr[2];

  // The formula given for contrast in the W3C Recommendations(approximation):
  return colorLuminance > 0.179
      ? '#000000'
      : '#FFFFFF';
}


function normalizeFromHex(hex: string) {
  if(hex.startsWith("#")) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16)
  ];
}

function normalizeFromRgb(rgb: string) {
  const m = rgb.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[01](?:.?\d+)?)?\)$/i);
  if(m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  throw new Error('Invalid RGB(a) color.');
}