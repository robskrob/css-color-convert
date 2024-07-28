import fs from 'node:fs';

const UNEVEN_HEX_DISTRIBUTION = 2;
const TRANSPARENCY_VALUE = 3;
const BASE_SIXTEEN = 16;
const RGB_MAX_VALUE = 255;
const COLOR_UNIT= 1;

const calculateOneHexValue = (hex) => {
  return hex2number(hex[0]) * BASE_SIXTEEN + hex2number(hex[0] || '0')
}

const calculateTwoHexValues = (hex) => {
  return hex2number(hex[0]) * BASE_SIXTEEN + hex2number(hex[1] || '0')
}

const calculateTransparency = (hex) => {
  return hex2number(hex[1]) * BASE_SIXTEEN + hex2number(hex[0] || '0')
}

const splitIntoThreePositions = (tuples) => {
  return tuples[0].split('').concat(tuples[1]);
}

(async () => {

  const contents = await fs.readFileSync('./color-convert/simple.css', 'utf8');
    const result = contents.split("\n").reduce((acc, chunk) => {
      const match = chunk.match(/\#(.*?)\;/)
      const hexColor = match && match[0];
      if (hexColor) {
        const hexTuples = hexColor.replace('#', '').replace(';', '').match(/.{0,2}/g).filter((h) => !!h);
        const length = hexTuples.length
        let rgb;
        if (length > UNEVEN_HEX_DISTRIBUTION) {
          rgb = hexTuples.reduce((acc, hexPair, index) => {
            const hexValue = hexPair.split('');
            if (index === TRANSPARENCY_VALUE) {
              const transparency = calculateTwoHexValues(hexValue);
              acc.push(`/ ${transparency / RGB_MAX_VALUE}`);
            } else {
              acc.push(calculateTwoHexValues(hexValue));
            }
            return acc;
          }, []);
        } else {
          const reformatted = splitIntoThreePositions(hexTuples);
          rgb = reformatted.reduce((acc, hex, index) => {
            const hexValue = hex.split('');
            if (hexValue.length > COLOR_UNIT) {
              acc.push(calculateOneHexValue(hexValue));
              const transparency = calculateTransparency(hexValue)
              acc.push(`/ ${transparency / RGB_MAX_VALUE}`);
            } else {
              acc.push(calculateOneHexValue(hexValue));
            }

            return acc;
          }, []);

        }

        const color = rgb.join(' ');
        const rp = match.input.replace(hexColor, `rgb(${color});`)
        acc += rp;
        return acc;
      } else {
        acc += chunk;
        return acc
      }
  }, "");

  console.log(result)

})()

function hex2number(hex){

  hex = hex.replace("0x", "").toLowerCase();
  var out = "";
  for(var c of hex) {
    switch(c) {
      case '0': out += 0; break;
      case '1': out += 1; break;
      case '2': out += 2; break;
      case '3': out += 3; break;
      case '4': out += 4; break;
      case '5': out += 5; break;
      case '6': out += 6; break;
      case '7': out += 7; break;
      case '8': out += 8; break;
      case '9': out += 9; break;
      case 'a': out += 10; break;
      case 'b': out += 11; break;
      case 'c': out += 12; break;
      case 'd': out += 13; break;
      case 'e': out += 14; break;
      case 'f': out += 15; break;
      default: return "";
    }
  }

  return Number(out);
}
