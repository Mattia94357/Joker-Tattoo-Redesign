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
  const payload = new FormData();
  payload.append('name', request.name);
  payload.append('email', request.email);
  payload.append('whatsapp', request.whatsapp);
  payload.append('preferredDate', request.preferredDate);
  payload.append('preferredTime', request.preferredTime);
  if (request.tattooStyle) payload.append('tattooStyle', request.tattooStyle);
  if (request.estimatedSize) payload.append('estimatedSize', request.estimatedSize);
  if (request.notes) payload.append('notes', request.notes);
  request.references.forEach(file => payload.append('references', file, file.name));

  const apiUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:4001/api').replace(/\/$/, '');
  const response = await fetch(`${apiUrl}/bookings`, { method: 'POST', body: payload });
  const result = await response.json().catch(() => null) as { id?: string; message?: string } | null;
  if (!response.ok) throw new Error(result?.message ?? 'Booking request delivery failed.');
  return { id: result?.id ?? '' };
}
