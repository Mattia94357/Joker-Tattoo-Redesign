import { Router } from 'express';
import multer from 'multer';
import { sendBookingEmail } from '../services/bookingEmail';
import type { BookingEmailInput } from '../types/booking';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  // Keeps the final MIME message comfortably under common 25 MB provider limits.
  limits: { files: 5, fileSize: 3 * 1024 * 1024, fields: 20 },
  fileFilter: (_request, file, done) => done(null, file.mimetype.startsWith('image/')),
});

router.post('/', upload.array('references', 5), async (request, response) => {
  const required = ['name', 'email', 'whatsapp', 'preferredDate', 'preferredTime'] as const;
  const missing = required.filter(field => !String(request.body[field] ?? '').trim());
  if (missing.length) {
    response.status(400).json({ success: false, message: 'Required booking details are missing.', fields: missing });
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(String(request.body.email))) {
    response.status(400).json({ success: false, message: 'A valid email address is required.' });
    return;
  }

  const booking: BookingEmailInput = {
    name: String(request.body.name).trim(),
    email: String(request.body.email).trim(),
    whatsapp: String(request.body.whatsapp).trim(),
    preferredDate: String(request.body.preferredDate).trim(),
    preferredTime: String(request.body.preferredTime).trim(),
    tattooStyle: String(request.body.tattooStyle ?? '').trim() || undefined,
    estimatedSize: String(request.body.estimatedSize ?? '').trim() || undefined,
    notes: String(request.body.notes ?? '').trim() || undefined,
    references: (request.files as Express.Multer.File[] | undefined) ?? [],
  };

  try {
    const result = await sendBookingEmail(booking);
    response.status(201).json({ success: true, id: result.messageId, confirmationSent: result.confirmationSent });
  } catch (error) {
    console.error('Booking email delivery failed', error instanceof Error ? error.message : error);
    response.status(503).json({ success: false, message: 'We could not send your request right now. Please try again or contact the studio directly.' });
  }
});

export default router;
