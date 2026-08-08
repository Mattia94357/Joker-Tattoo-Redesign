import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile } from 'node:fs/promises';

const root = process.cwd();
const sourceDir = path.join(root, 'src', 'assets', 'images');
const outputDir = path.join(sourceDir, 'optimized');
const publicIcons = path.join(root, 'public', 'icons');
const publicOg = path.join(root, 'public', 'images', 'og');

await Promise.all([mkdir(outputDir, { recursive: true }), mkdir(publicIcons, { recursive: true }), mkdir(publicOg, { recursive: true })]);

const images = [
  ['studio-hero.png', 'tattoo-studio-interior-patong', 1600],
  ['artist-process.png', 'custom-tattoo-artist-phuket', 1000],
  ['botanical-blackwork.png', 'black-and-grey-tattoo-patong-phuket', 1000],
  ['japanese-backpiece.png', 'japanese-tattoo-phuket', 1400],
];

for (const [source, filename, width] of images) {
  const input = path.join(sourceDir, source);
  await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(outputDir, `${filename}.webp`));
  await sharp(input).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(outputDir, `${filename}-640.webp`));
}

const safetySource = path.join(root, 'assets', 'joker-tattoo-health-and-safety.png');
await sharp(safetySource).resize({ width: 1280, withoutEnlargement: true }).webp({ quality: 84 }).toFile(path.join(outputDir, 'joker-tattoo-health-and-safety.webp'));
await sharp(safetySource).resize({ width: 768, withoutEnlargement: true }).webp({ quality: 80 }).toFile(path.join(outputDir, 'joker-tattoo-health-and-safety-768.webp'));

await sharp(path.join(sourceDir, 'studio-hero.png'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 84, progressive: true })
  .toFile(path.join(publicOg, 'joker-tattoo-og.jpg'));

const faviconSvg = await readFile(path.join(root, 'public', 'favicon.svg'));
for (const size of [180, 192, 512]) {
  await sharp(faviconSvg).resize(size, size).png().toFile(path.join(publicIcons, `icon-${size}.png`));
}
const faviconPng = await sharp(faviconSvg).resize(64, 64).png().toBuffer();
await writeFile(path.join(root, 'public', 'favicon.ico'), await pngToIco(faviconPng));
