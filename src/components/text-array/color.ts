export default function getComplementaryColor(hex: string) {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);

  console.log("red:", red, "green:", green, "blue:", blue);

  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  const hue = h * 360;
  const saturation = s * 100;
  const lightness = l * 100;

  console.log("hue:", hue, "saturation:", saturation, "lightness:", lightness);

  let hueComplementary = hue + 180;
  if (hueComplementary > 360) {
    hueComplementary = hueComplementary - 360;
  }

  const hC = hueComplementary / 360;
  let rC = 0;
  let gC = 0;
  let bC = 0;

  if (s == 0) {
    rC = gC = bC = l;
  } else {
    const hueToRgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    rC = hueToRgb(p, q, hC + 1 / 3);
    gC = hueToRgb(p, q, hC);
    bC = hueToRgb(p, q, hC - 1 / 3);
  }

  const redC = Math.round(rC * 255);
  const greenC = Math.round(gC * 255);
  const blueC = Math.round(bC * 255);

  const complementaryColorString = `Complementary color: {red: ${redC}, green: ${greenC}, blue: ${blueC}}`;

  console.log(complementaryColorString);

  const getHex = (num: number) => {
    const hex = num.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map(getHex).join("");

  const complementaryColor = rgbToHex(redC, greenC, blueC);
  console.log("Complementary color:", complementaryColor);

  return complementaryColor;
}
