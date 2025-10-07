import { SVGIcons2SVGFontStream } from 'svgicons2svgfont';
import { createReadStream, createWriteStream } from 'node:fs';
import { writeFile, readdir } from 'node:fs/promises';
import svg2ttf from 'svg2ttf';
import ttf2woff2 from 'ttf2woff2';
import { text } from 'stream/consumers';
import { cwd } from 'node:process';
import { generateIconFontCssFile } from './generate-icon-font-css-file.js';

const fontName = 'app-icon-font';
const fontStream = new SVGIcons2SVGFontStream({
  fontName,
  fontHeight: 1024, // Видимо этот показатель влияет на разрешение итогового шрифта, на размере файла разницы не увидел.
  centerVertically: true, // Мне показалось это удачным решением с учетом используемого ui-kit
});

const baseIconsPath = `${cwd()}/app/assets/icons/`;
const iconsDestination = `${cwd()}/public/fonts/${fontName}.svg`;
const iconsFontDestination = `${cwd()}/public/fonts/${fontName}.woff2`;

// Setting the font destination
fontStream
  .pipe(createWriteStream(iconsDestination))
  .on('finish', function () {
    console.log('Font successfully created!');
  })
  .on('error', function (err) {
    console.log(err);
  });

/* Нужно понять чем отличается начало символов с /u001 и с /u900 */
let startCharCode = 57345; // /u001
const iconsFilesNames = await readdir(baseIconsPath);

const iconsData = [];

iconsFilesNames.forEach((fileName) => {
  const [iconName] = fileName.split('.');
  const glyph = createReadStream(`${baseIconsPath}/${fileName}`);
  const unicode = String.fromCodePoint(startCharCode);
  glyph.metadata = {
    unicode: [unicode],
    name: iconName,
  };
  iconsData.push({ name: iconName, unicode });
  startCharCode++;
  fontStream.write(glyph);
});

// Do not forget to end the stream
fontStream.end();

const svgFont = await text(fontStream);
const ttf = svg2ttf(svgFont, {});

await writeFile(iconsFontDestination, ttf2woff2(ttf.buffer));

const appIconsCssFile = `${cwd()}/app/assets/css/${fontName}.css`;

const iconFontCssFileText = generateIconFontCssFile({
  fontName,
  classPrefix: 'app-i',
  fontFilePath: `/fonts/${fontName}.woff2`,
  iconsData,
});

await writeFile(appIconsCssFile, iconFontCssFileText);
