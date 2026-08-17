import nodemailer from 'nodemailer';
import type { BookingEmailInput } from '../types/booking';

const SHOP_EMAIL = process.env.BOOKING_TO_EMAIL ?? 'jokertattoopatongth@gmail.com';

function requireEmailConfig() {
  const required = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'] as const;
  const missing = required.filter(key => !process.env[key]);
  if (missing.length) throw new Error(`Email service is not configured: ${missing.join(', ')}`);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

function display(value?: string) {
  return value?.trim() || 'Not provided';
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

function formatTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(2000, 0, 1, hours, minutes));
}

export async function sendBookingEmail(booking: BookingEmailInput) {
  requireEmailConfig();
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const rows: Array<[string, string]> = [
    ['Name', booking.name],
    ['Email', booking.email],
    ['WhatsApp', booking.whatsapp],
    ['Preferred Date', formatDate(booking.preferredDate)],
    ['Preferred Time', formatTime(booking.preferredTime)],
    ['Tattoo Style', display(booking.tattooStyle)],
    ['Estimated Size', display(booking.estimatedSize)],
    ['Additional Notes', display(booking.notes)],
    ['Reference Images', booking.references.length ? `${booking.references.length} attached` : 'None attached'],
  ];

  const text = ['New Tattoo Booking Request', '', ...rows.flatMap(([label, value]) => [`${label}:`, value, ''])].join('\n');
  const htmlRows = rows.map(([label, value]) => `<tr><td style="padding:12px 18px 12px 0;border-bottom:1px solid #e8e8e8;color:#656565;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;vertical-align:top">${escapeHtml(label)}</td><td style="padding:12px 0;border-bottom:1px solid #e8e8e8;color:#171717;font-size:15px;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('');
  const html = `<div style="background:#f4f5f2;padding:32px;font-family:Arial,sans-serif;color:#171717"><div style="max-width:680px;margin:auto;background:#fff;border-top:5px solid #72ef73;padding:36px"><p style="margin:0 0 8px;color:#438e45;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase">Joker Tattoo · Patong, Phuket</p><h1 style="margin:0 0 26px;font-size:30px;line-height:1.15">New Tattoo Booking Request</h1><table role="presentation" style="width:100%;border-collapse:collapse">${htmlRows}</table><p style="margin:28px 0 0;color:#747474;font-size:12px">Reply directly to this email to contact ${escapeHtml(booking.name)}.</p></div></div>`;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? `Joker Tattoo Website <${process.env.SMTP_USER}>`,
    to: SHOP_EMAIL,
    replyTo: booking.email,
    subject: `New Tattoo Booking Request – ${booking.name}`,
    text,
    html,
    attachments: booking.references.map(file => ({ filename: file.originalname, content: file.buffer, contentType: file.mimetype })),
  });

  return { messageId: info.messageId, confirmationSent: false };
}
