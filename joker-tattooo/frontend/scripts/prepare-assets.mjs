import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile } from 'node:fs/promises';

const root = process.cwd();
const sourceDir = path.join(root, 'src', 'assets', 'images');
const sourceAssets = path.join(root, 'assets');
const outputDir = path.join(sourceDir, 'optimized');
const publicIcons = path.join(root, 'public', 'icons');
const publicOg = path.join(root, 'public', 'images', 'og');
const publicHero = path.join(root, 'public', 'images', 'hero');

await Promise.all([mkdir(outputDir, { recursive: true }), mkdir(publicIcons, { recursive: true }), mkdir(publicOg, { recursive: true }), mkdir(publicHero, { recursive: true })]);

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

const portfolioImages = [
  'chestsakyant.jpg',
  'japanese-hannya-mask-tattoo.jpg',
  'japanese-oni-mask-tattoo.jpg',
  'pinkhannyajapanese.jpg',
  'redonijapanese.jpg',
  'religionrealism.jpg',
  'sakyantback.jpg',
  'black-grey-religious-sleeve-tattoo.jpg',
  'thaiwarriorleg.jpg',
  'tigersleevejapanese.jpg',
  'womanrealism.jpg',
  'custom-black-grey-tattoo.avif',
  'japanesebackjokertattoo.avif',
  'sakyantjokerchest.avif',
  'dragonbluejoker.webp',
  'fullbackjokersakyant.webp',
  'woman2realismjoker.webp',
  'thaitraditionalsleevejoker.webp',
  'woman-smile-realism.png',
  'tribal-chest.png',
  'tribal-leg.png',
  'traditional-thai.png',
  'realistic-woman-gun.png',
  'japanese-sleeve.png',
];

await Promise.all(portfolioImages.flatMap(source => {
  const input = path.join(sourceAssets, source);
  const filename = path.parse(source).name;
  const responsive = sharp(input).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 79, effort: 5, smartSubsample: true }).toFile(path.join(outputDir, `${filename}-480.webp`));
  const medium = sharp(input).rotate().resize({ width: 768, withoutEnlargement: true }).webp({ quality: 79, effort: 5, smartSubsample: true }).toFile(path.join(outputDir, `${filename}-768.webp`));
  const responsiveAvif = sharp(input).rotate().resize({ width: 480, withoutEnlargement: true }).avif({ quality: 58, effort: 6 }).toFile(path.join(outputDir, `${filename}-480.avif`));
  const mediumAvif = sharp(input).rotate().resize({ width: 768, withoutEnlargement: true }).avif({ quality: 58, effort: 6 }).toFile(path.join(outputDir, `${filename}-768.avif`));
  return /\.(avif|webp)$/i.test(source)
    ? [responsive, medium, responsiveAvif, mediumAvif]
    : [responsive, medium, responsiveAvif, mediumAvif, sharp(input).rotate().avif({ quality: 68, effort: 6 }).toFile(path.join(outputDir, `${filename}.avif`))];
}));

const heroSource = path.join(sourceAssets, 'traditional-tiger-sak-yant-tattoo.jpg');
await Promise.all([
  sharp(heroSource).rotate().avif({ quality: 58, effort: 6 }).toFile(path.join(publicHero, 'traditional-tiger-sak-yant-tattoo.avif')),
  sharp(heroSource).rotate().resize({ width: 768, withoutEnlargement: true }).avif({ quality: 52, effort: 6 }).toFile(path.join(publicHero, 'traditional-tiger-sak-yant-tattoo-768.avif')),
  sharp(heroSource).rotate().resize({ width: 480, withoutEnlargement: true }).avif({ quality: 55, effort: 6 }).toFile(path.join(publicHero, 'traditional-tiger-sak-yant-tattoo-480.avif')),
  sharp(heroSource).rotate().webp({ quality: 82, effort: 5, smartSubsample: true }).toFile(path.join(publicHero, 'traditional-tiger-sak-yant-tattoo.webp')),
  sharp(heroSource).rotate().resize({ width: 768, withoutEnlargement: true }).webp({ quality: 79, effort: 5, smartSubsample: true }).toFile(path.join(publicHero, 'traditional-tiger-sak-yant-tattoo-768.webp')),
  sharp(heroSource).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 79, effort: 5, smartSubsample: true }).toFile(path.join(publicHero, 'traditional-tiger-sak-yant-tattoo-480.webp')),
]);

await Promise.all([
  sharp(path.join(sourceAssets, 'joker-tattoo-patong-studio-emblem.jpg')).resize({ width: 96, withoutEnlargement: true }).webp({ quality: 90, effort: 5 }).toFile(path.join(outputDir, 'joker-tattoo-patong-studio-emblem-96.webp')),
  sharp(path.join(sourceAssets, 'joker-tattoo-patong-logo.png')).webp({ quality: 90, effort: 5 }).toFile(path.join(outputDir, 'joker-tattoo-patong-logo.webp')),
  sharp(path.join(sourceAssets, 'joker-tattoo-patong-logo.png')).resize({ width: 344, withoutEnlargement: true }).webp({ quality: 88, effort: 5 }).toFile(path.join(outputDir, 'joker-tattoo-patong-logo-344.webp')),
]);

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
