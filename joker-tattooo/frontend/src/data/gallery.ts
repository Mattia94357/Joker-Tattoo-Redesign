import chestSakYant from '../../assets/chestsakyant.jpg';
import japaneseHannya from '../../assets/japanese-hannya-mask-tattoo.jpg';
import japaneseOni from '../../assets/japanese-oni-mask-tattoo.jpg';
import pinkHannya from '../../assets/pinkhannyajapanese.jpg';
import redOni from '../../assets/redonijapanese.jpg';
import sacredGeometry from '../../assets/religionrealism.jpg';
import sakYantBack from '../../assets/sakyantback.jpg';
import tigerSakYant from '../../assets/traditional-tiger-sak-yant-tattoo.jpg';
import religiousSleeve from '../../assets/black-grey-religious-sleeve-tattoo.jpg';
import thaiWarrior from '../../assets/thaiwarriorleg.jpg';
import tigerSleeve from '../../assets/tigersleevejapanese.jpg';
import womanRealism from '../../assets/womanrealism.jpg';
import customPortfolio from '../../assets/custom-black-grey-tattoo.avif';
import japaneseBackpiece from '../../assets/japanesebackjokertattoo.avif';
import sakYantChest from '../../assets/sakyantjokerchest.avif';
import blueDragon from '../../assets/dragonbluejoker.webp';
import fullBackSakYant from '../../assets/fullbackjokersakyant.webp';
import womanRealismTwo from '../../assets/woman2realismjoker.webp';
import thaiTraditionalSleeve from '../../assets/thaitraditionalsleevejoker.webp';
import womanSmileRealism from '../../assets/woman-smile-realism.png';
import tribalChest from '../../assets/tribal-chest.png';
import tribalLeg from '../../assets/tribal-leg.png';
import traditionalThai from '../../assets/traditional-thai.png';
import realisticWomanGun from '../../assets/realistic-woman-gun.png';
import japaneseSleeve from '../../assets/japanese-sleeve.png';

export type GalleryItem = { id: number; title: string; category: string; image: string; imageSmall: string; width: number; height: number; alt: string };

export const galleryCategories = ['All', 'Japanese', 'Sak Yant', 'Realism', 'Black & Grey', 'Tribal', 'Colour', 'Thai Traditional'];

const item = (id: number, title: string, category: string, image: string, width: number, height: number, alt: string): GalleryItem => ({
  id, title, category, image, imageSmall: image, width, height, alt,
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
