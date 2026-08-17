export type BookingEmailInput = {
  name: string;
  email: string;
  whatsapp: string;
  preferredDate: string;
  preferredTime: string;
  tattooStyle?: string;
  estimatedSize?: string;
  notes?: string;
  references: Express.Multer.File[];
};
