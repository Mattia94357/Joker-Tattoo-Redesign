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
export const MAX_REFERENCE_BYTES = 4 * 1024 * 1024;

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

  if (request.references.reduce((sum, file) => sum + file.size, 0) > MAX_REFERENCE_BYTES) throw new Error('Reference upload is too large.');
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  const loopback = configuredUrl && /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?=[:/]|$)/i.test(configuredUrl);
  const apiUrl = ((configuredUrl && (import.meta.env.DEV || !loopback) ? configuredUrl : undefined) ||
    (import.meta.env.DEV ? 'http://localhost:4001/api' : '/api')).replace(/\/$/, '');
  const endpoint = `${apiUrl}/bookings`;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);
  try {
    if (import.meta.env.DEV) console.debug('[booking] endpoint', endpoint);
    const response = await fetch(endpoint, { method: 'POST', body: payload, signal: controller.signal });
    if (import.meta.env.DEV) console.debug('[booking] HTTP status', response.status);
    const body = await response.text();
    if (import.meta.env.DEV) console.debug('[booking] response body', body);
    const result: unknown = JSON.parse(body);
    if (!response.ok || !result || typeof result !== 'object' ||
        !('success' in result) || result.success !== true ||
        !('id' in result) || typeof result.id !== 'string' || !result.id) {
      throw new Error(`Booking request failed (HTTP ${response.status}).`);
    }
    return { id: result.id };
  } catch (error) {
    if (import.meta.env.DEV) console.error('[booking]', controller.signal.aborted ? 'request aborted' : 'request failed', error);
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
