import realismImage from '../../assets/woman2realismjoker.webp';
import realismImageSmall from '../assets/images/optimized/woman2realismjoker-480.avif';
import realismImageMedium from '../assets/images/optimized/woman2realismjoker-768.avif';
import blackGreyImage from '../assets/images/optimized/thaiwarriorleg.avif';
import blackGreyImageSmall from '../assets/images/optimized/thaiwarriorleg-480.avif';
import blackGreyImageMedium from '../assets/images/optimized/thaiwarriorleg-768.avif';
import traditionalImage from '../../assets/thaitraditionalsleevejoker.webp';
import traditionalImageSmall from '../assets/images/optimized/thaitraditionalsleevejoker-480.avif';
import traditionalImageMedium from '../assets/images/optimized/thaitraditionalsleevejoker-768.avif';
import japaneseImage from '../../assets/dragonbluejoker.webp';
import japaneseImageSmall from '../assets/images/optimized/dragonbluejoker-480.avif';
import japaneseImageMedium from '../assets/images/optimized/dragonbluejoker-768.avif';
import fineLineImage from '../assets/images/optimized/religionrealism.avif';
import fineLineImageSmall from '../assets/images/optimized/religionrealism-480.avif';
import fineLineImageMedium from '../assets/images/optimized/religionrealism-768.avif';
import customImage from '../assets/images/optimized/chestsakyant.avif';
import customImageSmall from '../assets/images/optimized/chestsakyant-480.avif';
import customImageMedium from '../assets/images/optimized/chestsakyant-768.avif';
import type { GalleryCategorySlug } from './gallery';

type TattooStyle = {
  title: string;
  text: string;
  cta: string;
  galleryCategory: GalleryCategorySlug;
  image: string;
  imageSmall: string;
  imageMedium: string;
  width: number;
  height: number;
};

export const tattooStyles: TattooStyle[] = [
  { title: 'Realism', text: 'Detail, depth and shading for a truly realistic result.', cta: 'Explore Realism Tattoos', galleryCategory: 'realism', image: realismImage, imageSmall: realismImageSmall, imageMedium: realismImageMedium, width: 757, height: 1024 },
  { title: 'Black & Grey', text: 'Bold contrast, deep shading and a timeless style.', cta: 'Explore Black & Grey Tattoos', galleryCategory: 'black-grey', image: blackGreyImage, imageSmall: blackGreyImageSmall, imageMedium: blackGreyImageMedium, width: 1000, height: 1124 },
  { title: 'Traditional', text: 'Bold lines, solid colour and a style made to last.', cta: 'Explore Traditional Tattoos', galleryCategory: 'colour', image: traditionalImage, imageSmall: traditionalImageSmall, imageMedium: traditionalImageMedium, width: 512, height: 510 },
  { title: 'Japanese', text: 'Flowing compositions, bold details and designs that follow the shape of the body.', cta: 'Explore Japanese Tattoos', galleryCategory: 'japanese', image: japaneseImage, imageSmall: japaneseImageSmall, imageMedium: japaneseImageMedium, width: 1016, height: 1024 },
  { title: 'Fine Line', text: 'Fine lines, precise details and light, elegant compositions.', cta: 'Explore Fine Line Tattoos', galleryCategory: 'black-grey', image: fineLineImage, imageSmall: fineLineImageSmall, imageMedium: fineLineImageMedium, width: 624, height: 779 },
  { title: 'Custom Designs', text: 'Unique designs created around your idea, your body and your style.', cta: 'Explore Custom Designs', galleryCategory: 'black-grey', image: customImage, imageSmall: customImageSmall, imageMedium: customImageMedium, width: 1000, height: 1244 },
];

export const services = [
  ['Custom Tattoos', 'Original designs created around your idea, your body and your style.'],
  ['Tattoo Consultations', 'A focused conversation to define the direction before design begins.'],
  ['Cover-Ups', 'Carefully planned solutions to transform and enhance an existing tattoo.'],
  ['Tattoo Restyling', 'Older tattoos reworked to improve detail, balance and composition.'],
  ['Fine Line Tattoos', 'Fine, precise lines with careful attention to proportion, balance and detail.'],
  ['Large-Scale Tattoos', 'Sleeves, backpieces and multi-session work designed as one complete composition.'],
  ['Aftercare Guidance', 'Clear, personalised guidance to help you care for your tattoo throughout the healing process.'],
];
