import sharp from 'sharp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateFavicons() {
  const sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512,
    'og-image.png': [1200, 630] // Special size for social media
  };

  const inputSvg = await fs.readFile(join(__dirname, '../public/favicon.svg'));
  const ogInputSvg = await fs.readFile(join(__dirname, '../public/og-image.svg'));

  for (const [filename, size] of Object.entries(sizes)) {
    const input = filename === 'og-image.png' ? ogInputSvg : inputSvg;
    const width = Array.isArray(size) ? size[0] : size;
    const height = Array.isArray(size) ? size[1] : size;

    await sharp(input)
      .resize(width, height)
      .png()
      .toFile(join(__dirname, '../public', filename));
    
    console.log(`Generated ${filename}`);
  }
}

generateFavicons().catch(console.error); 