import fs from 'node:fs';


(async () => {

  const contents = await fs.readFileSync('./color-convert/advanced.css', 'utf8');
    // console.log(contents.split("\n"))
    const result = contents.split("\n").reduce((acc, chunk) => {
      const match = chunk.match(/\#(.*?)\;/)
      const hexColor = match && match[0];
      if (hexColor) {
        const rgb = hexColor.replace('#', '').replace(';', '').match(/.{0,2}/g).reduce((acc, hexPair) => {
          const hexValue = hexPair.split('');
          if (hexValue.length) {
            acc.push(hex2number(hexValue[0]) * 16 + hex2number(hexValue[1]));
          }

          return acc;
        }, []);
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
