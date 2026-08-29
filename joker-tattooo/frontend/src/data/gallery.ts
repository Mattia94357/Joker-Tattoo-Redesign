import chestSakYant from '../assets/images/optimized/chestsakyant.avif';
import chestSakYantSmall from '../assets/images/optimized/chestsakyant-480.webp';
import japaneseHannya from '../assets/images/optimized/japanese-hannya-mask-tattoo.avif';
import japaneseHannyaSmall from '../assets/images/optimized/japanese-hannya-mask-tattoo-480.webp';
import japaneseOni from '../assets/images/optimized/japanese-oni-mask-tattoo.avif';
import japaneseOniSmall from '../assets/images/optimized/japanese-oni-mask-tattoo-480.webp';
import pinkHannya from '../assets/images/optimized/pinkhannyajapanese.avif';
import pinkHannyaSmall from '../assets/images/optimized/pinkhannyajapanese-480.webp';
import redOni from '../assets/images/optimized/redonijapanese.avif';
import redOniSmall from '../assets/images/optimized/redonijapanese-480.webp';
import sacredGeometry from '../assets/images/optimized/religionrealism.avif';
import sacredGeometrySmall from '../assets/images/optimized/religionrealism-480.webp';
import sakYantBack from '../assets/images/optimized/sakyantback.avif';
import sakYantBackSmall from '../assets/images/optimized/sakyantback-480.webp';
import religiousSleeve from '../assets/images/optimized/black-grey-religious-sleeve-tattoo.avif';
import religiousSleeveSmall from '../assets/images/optimized/black-grey-religious-sleeve-tattoo-480.webp';
import thaiWarrior from '../assets/images/optimized/thaiwarriorleg.avif';
import thaiWarriorSmall from '../assets/images/optimized/thaiwarriorleg-480.webp';
import tigerSleeve from '../assets/images/optimized/tigersleevejapanese.avif';
import tigerSleeveSmall from '../assets/images/optimized/tigersleevejapanese-480.webp';
import womanRealism from '../assets/images/optimized/womanrealism.avif';
import womanRealismSmall from '../assets/images/optimized/womanrealism-480.webp';
import customPortfolio from '../../assets/custom-black-grey-tattoo.avif';
import customPortfolioSmall from '../assets/images/optimized/custom-black-grey-tattoo-480.webp';
import japaneseBackpiece from '../../assets/japanesebackjokertattoo.avif';
import japaneseBackpieceSmall from '../assets/images/optimized/japanesebackjokertattoo-480.webp';
import sakYantChest from '../../assets/sakyantjokerchest.avif';
import sakYantChestSmall from '../assets/images/optimized/sakyantjokerchest-480.webp';
import blueDragon from '../../assets/dragonbluejoker.webp';
import blueDragonSmall from '../assets/images/optimized/dragonbluejoker-480.webp';
import fullBackSakYant from '../../assets/fullbackjokersakyant.webp';
import fullBackSakYantSmall from '../assets/images/optimized/fullbackjokersakyant-480.webp';
import womanRealismTwo from '../../assets/woman2realismjoker.webp';
import womanRealismTwoSmall from '../assets/images/optimized/woman2realismjoker-480.webp';
import thaiTraditionalSleeve from '../../assets/thaitraditionalsleevejoker.webp';
import thaiTraditionalSleeveSmall from '../assets/images/optimized/thaitraditionalsleevejoker-480.webp';
import womanSmileRealism from '../assets/images/optimized/woman-smile-realism.avif';
import womanSmileRealismSmall from '../assets/images/optimized/woman-smile-realism-480.webp';
import tribalChest from '../assets/images/optimized/tribal-chest.avif';
import tribalChestSmall from '../assets/images/optimized/tribal-chest-480.webp';
import tribalLeg from '../assets/images/optimized/tribal-leg.avif';
import tribalLegSmall from '../assets/images/optimized/tribal-leg-480.webp';
import traditionalThai from '../assets/images/optimized/traditional-thai.avif';
import traditionalThaiSmall from '../assets/images/optimized/traditional-thai-480.webp';
import realisticWomanGun from '../assets/images/optimized/realistic-woman-gun.avif';
import realisticWomanGunSmall from '../assets/images/optimized/realistic-woman-gun-480.webp';
import japaneseSleeve from '../assets/images/optimized/japanese-sleeve.avif';
import japaneseSleeveSmall from '../assets/images/optimized/japanese-sleeve-480.webp';

export type GalleryItem = { id: number; title: string; category: string; image: string; imageSmall: string; width: number; height: number; alt: string };

export const galleryCategories = ['All', 'Japanese', 'Sak Yant', 'Realism', 'Black & Grey', 'Tribal', 'Colour', 'Thai Traditional'];

const tigerSakYant = '/images/hero/traditional-tiger-sak-yant-tattoo.webp';
const smallImages: Record<number, string> = {
  1: '/images/hero/traditional-tiger-sak-yant-tattoo-480.webp',
  2: tigerSleeveSmall,
  3: chestSakYantSmall,
  4: thaiWarriorSmall,
  5: pinkHannyaSmall,
  6: redOniSmall,
  7: japaneseOniSmall,
  8: sakYantBackSmall,
  9: womanRealismSmall,
  12: japaneseHannyaSmall,
  13: sacredGeometrySmall,
  14: religiousSleeveSmall,
  16: japaneseBackpieceSmall,
  17: sakYantChestSmall,
  18: blueDragonSmall,
  19: fullBackSakYantSmall,
  20: womanRealismTwoSmall,
  21: thaiTraditionalSleeveSmall,
  22: customPortfolioSmall,
  23: womanSmileRealismSmall,
  24: tribalChestSmall,
  25: tribalLegSmall,
  26: traditionalThaiSmall,
  27: realisticWomanGunSmall,
  28: japaneseSleeveSmall,
};

const item = (id: number, title: string, category: string, image: string, width: number, height: number, alt: string): GalleryItem => ({
  id, title, category, image, imageSmall: smallImages[id] ?? image, width, height, alt,
});

export const galleryItems: GalleryItem[] = [
  item(1, 'Tiger Sak Yant', 'Sak Yant', tigerSakYant, 1000, 1260, 'Traditional tiger Sak Yant tattoo across the back'),
  item(2, 'Japanese Tiger Sleeves', 'Japanese', tigerSleeve, 1000, 997, 'Colour Japanese tiger and floral sleeve tattoos'),
  item(3, 'Sacred Geometry', 'Black & Grey', chestSakYant, 1000, 1244, 'Black and grey sacred geometry chest tattoo'),
  item(4, 'Thai Warrior', 'Black & Grey', thaiWarrior, 1000, 1124, 'Detailed black and grey Thai warrior leg tattoo'),
  item(5, 'Hannya & Koi', 'Japanese', pinkHannya, 1000, 1043, 'Colour Japanese Hannya mask and koi sleeve tattoos'),
  item(6, 'Oni Sleeves', 'Japanese', redOni, 1000, 1004, 'Japanese Oni, peony and koi sleeve tattoos'),
  item(7, 'Daruma Sleeve', 'Japanese', japaneseOni, 1000, 1257, 'Japanese guardian and red Daruma full sleeve tattoo'),
  item(8, 'Sacred Backpiece', 'Sak Yant', sakYantBack, 320, 401, 'Traditional Sak Yant full back tattoo'),
  item(9, 'Woman & Rose', 'Realism', womanRealism, 201, 251, 'Black and grey realistic woman and rose arm tattoo'),
  item(12, 'Purple Hannya', 'Colour', japaneseHannya, 791, 976, 'Purple Japanese Hannya mask colour tattoo'),
  item(13, 'Ornamental Mandala', 'Black & Grey', sacredGeometry, 624, 779, 'Ornamental blackwork mandala tattoo across the upper back'),
  item(14, 'Religious Sleeve', 'Realism', religiousSleeve, 216, 233, 'Black and grey religious realism sleeve tattoo'),
  item(16, 'Japanese Backpiece', 'Japanese', japaneseBackpiece, 813, 1024, 'Large-scale Japanese backpiece tattoo by Joker Tattoo Patong'),
  item(17, 'Sak Yant Chest', 'Sak Yant', sakYantChest, 741, 1024, 'Traditional Sak Yant chest tattoo by Joker Tattoo Patong'),
  item(18, 'Blue Dragon', 'Colour', blueDragon, 1016, 1024, 'Vivid blue Japanese dragon sleeve tattoo'),
  item(19, 'Full Back Sak Yant', 'Sak Yant', fullBackSakYant, 803, 1024, 'Full-back traditional Sak Yant composition'),
  item(20, 'Portrait Realism', 'Realism', womanRealismTwo, 757, 1024, 'Black and grey woman portrait realism tattoo'),
  item(21, 'Thai Traditional Sleeve', 'Thai Traditional', thaiTraditionalSleeve, 512, 510, 'Thai traditional Ganesha full sleeve tattoo'),
  item(22, 'Custom Portfolio Piece', 'Black & Grey', customPortfolio, 883, 1024, 'Custom tattoo work by Joker Tattoo Patong'),
  item(23, 'Woman Smile Portrait', 'Realism', womanSmileRealism, 478, 480, 'Black and grey realistic woman portrait tattoo with theatrical face details'),
  item(24, 'Polynesian Chest & Shoulder', 'Tribal', tribalChest, 478, 421, 'Polynesian tribal chest and shoulder tattoo shown from three angles'),
  item(25, 'Geometric Tribal Leg', 'Tribal', tribalLeg, 417, 517, 'Geometric ornamental tribal leg tattoo shown from three angles'),
  item(26, 'Thai Guardian', 'Thai Traditional', traditionalThai, 483, 483, 'Detailed traditional Thai guardian tattoo on the lower leg'),
  item(27, 'Woman & Rifle', 'Realism', realisticWomanGun, 402, 522, 'Black and grey realistic woman portrait with rifle tattoo'),
  item(28, 'Japanese Serpent Sleeve', 'Japanese', japaneseSleeve, 487, 489, 'Black and grey Japanese serpent and floral full sleeve tattoo'),
];
