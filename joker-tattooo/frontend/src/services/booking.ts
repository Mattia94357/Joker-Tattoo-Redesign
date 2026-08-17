export type BookingRequest = {
  name: string;
  email: string;
  whatsapp: string;
  preferredDate: string;
  preferredTime: string;
  tattooStyle?: string;
  estimatedSize?: string;
  notes?: string;
  references: File[];
};

export type BookingSubmission = { id: string };

/**
 * Integration boundary for the booking request. Replace this function with a
 * multipart API call when Resend, Nodemailer, EmailJS, or another service is ready.
 * Keeping files in the request model also makes calendar/admin integrations additive.
 */
export async function submitBookingRequest(request: BookingRequest): Promise<BookingSubmission> {
  void request;
  await new Promise(resolve => window.setTimeout(resolve, 650));
  return { id: `JTR-${Date.now()}` };
}
