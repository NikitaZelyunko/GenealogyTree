export function generateIconFontCssFile({
  fontName,
  fontFilePath,
  classPrefix,
  iconsData,
}) {
  const base = `@font-face {
  font-family: '${fontName}';
  src: url('${fontFilePath}');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

.${classPrefix} {
  font-family: '${fontName}';
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  display: inline-block;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;

  const iconsClasses = iconsData.map((iconData) => {
    return `.${classPrefix}-${iconData.name}:before {
  content: '\\${iconData.unicode.charCodeAt(0).toString(16)}';
}`;
  });

  return `${base}
${iconsClasses.join('\n')}`;
}
