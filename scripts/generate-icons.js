const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, '../public/bardasci-logo.svg');
const outputDir = path.join(__dirname, '../public/icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

sizes.forEach(s => {
  sharp(inputFile)
    .resize(s, s, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toFile(path.join(outputDir, `icon-${s}x${s}.png`))
    .then(() => console.log(`Generated icon-${s}x${s}.png`))
    .catch(err => console.error(`Error generating icon-${s}x${s}.png:`, err));
});

// Generiamo anche la favicon standard
sharp(inputFile)
  .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .toFile(path.join(__dirname, '../public/favicon.png'))
  .then(() => console.log('Generated favicon.png'))
  .catch(err => console.error('Error generating favicon.png:', err));
