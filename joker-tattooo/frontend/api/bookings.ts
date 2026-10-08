import type { IncomingMessage, ServerResponse } from 'node:http';
import nodemailer from 'nodemailer';
import { isValidPhoneNumber } from 'libphonenumber-js';
import seo from '../src/config/seo.json';

// Preserve the multipart stream for reference-image attachments.
export const config = { helpers: false, api: { bodyParser: false } };

const BODY_LIMIT = 4.25 * 1024 * 1024;
class RequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function parseBooking(request: IncomingMessage) {
  const contentType = request.headers['content-type'] ?? '';
  if (!contentType.startsWith('multipart/form-data;')) throw new RequestError(415, 'Multipart form data is required.');
  if (Number(request.headers['content-length']) > BODY_LIMIT) throw new RequestError(413, 'Reference upload is too large.');
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > BODY_LIMIT) throw new RequestError(413, 'Reference upload is too large.');
    chunks.push(buffer);
  }
  let form: FormData;
  try {
    form = await new Response(new Uint8Array(Buffer.concat(chunks)), { headers: { 'content-type': contentType } }).formData();
  } catch {
    throw new RequestError(400, 'Invalid multipart form data.');
  }
  const field = (key: string) => {
    const value = form.get(key);
    if (value !== null && typeof value !== 'string') throw new RequestError(400, 'Invalid booking details.');
    return value?.trim() ?? '';
  };
  const booking = {
    name: field('name'), email: field('email'), whatsapp: field('whatsapp'),
    preferredDate: field('preferredDate'), preferredTime: field('preferredTime'),
    tattooStyle: field('tattooStyle'), estimatedSize: field('estimatedSize'), notes: field('notes'),
  };
  const [hour, minute] = booking.preferredTime.split(':').map(Number);
  const opening = seo.openingHours[0];
  const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
  if (!booking.name || !/^\S+@\S+\.\S+$/.test(booking.email) || !isValidPhoneNumber(booking.whatsapp) || !booking.whatsapp.startsWith('+') ||
      !/^\d{4}-\d{2}-\d{2}$/.test(booking.preferredDate) || !/^\d{2}:\d{2}$/.test(booking.preferredTime) ||
      ![0, 30].includes(minute) || hour * 60 + minute < minutes(opening.opens) || hour * 60 + minute > minutes(opening.closes) ||
      Object.values(booking).some(value => value.length > 2000)) throw new RequestError(400, 'Invalid booking details.');
  const references = form.getAll('references');
  if (references.length > 5 || references.some(file => typeof file === 'string' || !file.type.startsWith('image/') || file.size > 3 * 1024 * 1024)) {
    throw new RequestError(400, 'Invalid reference images.');
  }
  const images = references.filter((file): file is File => typeof file !== 'string');
  if (images.reduce((sum, file) => sum + file.size, 0) > 4 * 1024 * 1024) throw new RequestError(413, 'Reference upload is too large.');
  return { booking, images };
}

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  response.setHeader('Cache-Control', 'no-store');
  const respond = (status: number, body: object) => {
    response.statusCode = status;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(body));
  };
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    respond(405, { success: false, message: 'Use POST for booking requests.' });
    return;
  }
  try {
    const { booking, images } = await parseBooking(request);
    const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'].filter(key => !process.env[key]?.trim());
    if (missing.length) {
      console.error('[booking-api] Missing configuration:', missing.join(', '));
      throw new RequestError(503, 'Email delivery is unavailable.');
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 3000, greetingTimeout: 3000, socketTimeout: 5000,
    });
    const rows = [
      ['Name', booking.name], ['Email', booking.email], ['WhatsApp', booking.whatsapp],
      ['Preferred Date', booking.preferredDate], ['Preferred Time', booking.preferredTime],
      ['Tattoo Style', booking.tattooStyle || 'Not provided'], ['Estimated Size', booking.estimatedSize || 'Not provided'],
      ['Additional Notes', booking.notes || 'Not provided'], ['Reference Images', `${images.length} attached`],
    ];
    const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
    let deadline: ReturnType<typeof setTimeout> | undefined;
    try {
      const attachments = await Promise.all(images.map(async file => ({ filename: file.name, content: Buffer.from(await file.arrayBuffer()), contentType: file.type })));
      const info = await Promise.race([
        transporter.sendMail({
          from: process.env.EMAIL_FROM || `Joker Tattoo Website <${process.env.SMTP_USER}>`,
          to: process.env.BOOKING_TO_EMAIL || 'jokertattoopatongth@gmail.com', replyTo: booking.email,
          subject: `New Tattoo Booking Request – ${booking.name}`,
          text: ['New Tattoo Booking Request', '', ...rows.map(([label, value]) => `${label}: ${value}`)].join('\n'),
          html: `<h1>New Tattoo Booking Request</h1><table>${rows.map(([label, value]) => `<tr><th>${escape(label)}</th><td style="white-space:pre-wrap">${escape(value)}</td></tr>`).join('')}</table>`,
          attachments,
        }),
        new Promise<never>((_, reject) => {
          deadline = setTimeout(() => { transporter.close(); reject(new Error('SMTP deadline exceeded')); }, 10000);
        }),
      ]);
      if (!info.accepted?.length || !info.messageId) throw new Error('SMTP did not accept the booking');
      respond(201, { success: true, id: info.messageId, confirmationSent: false });
    } finally {
      clearTimeout(deadline);
      transporter.close();
    }
  } catch (error) {
    if (!(error instanceof RequestError)) console.error('[booking-api] delivery failed', error instanceof Error ? error.name : 'Unknown error');
    respond(error instanceof RequestError ? error.status : 503, { success: false, message: 'We could not send your request. Please try again or contact the studio on WhatsApp.' });
  }
}
