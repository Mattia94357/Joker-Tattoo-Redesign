import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createSmtpServer, type Socket } from 'node:net';
import { once } from 'node:events';
import handler from '../api/bookings';

test('actual booking handler, multipart attachments, SMTP delivery, and error responses', async t => {
  const messages: string[] = [];
  const sockets = new Set<Socket>();
  let smtpMode: 'accept' | 'reject' | 'hang' = 'accept';
  const smtp = createSmtpServer(socket => {
    sockets.add(socket);
    socket.on('close', () => sockets.delete(socket));
    socket.on('error', () => undefined);
    if (smtpMode === 'hang') return;
    socket.write('220 localhost booking test SMTP\r\n');
    let buffer = '';
    let receiving = false;
    let message = '';
    socket.on('data', data => {
      buffer += data.toString();
      let newline: number;
      while ((newline = buffer.indexOf('\r\n')) !== -1) {
        const line = buffer.slice(0, newline);
        buffer = buffer.slice(newline + 2);
        if (receiving) {
          if (line === '.') { messages.push(message); receiving = false; socket.write('250 Accepted\r\n'); }
          else message += `${line}\r\n`;
        } else if (line.startsWith('EHLO')) socket.write('250-localhost\r\n250 AUTH PLAIN\r\n');
        else if (line.startsWith('AUTH')) socket.write('235 Authenticated\r\n');
        else if (line.startsWith('RCPT') && smtpMode === 'reject') socket.write('550 Recipient rejected\r\n');
        else if (line === 'DATA') { receiving = true; message = ''; socket.write('354 Send message\r\n'); }
        else if (line === 'QUIT') { socket.end('221 Goodbye\r\n'); }
        else socket.write('250 OK\r\n');
      }
    });
  });
  smtp.listen(0, '127.0.0.1');
  await once(smtp, 'listening');
  const port = (smtp.address() as { port: number }).port;
  const keys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SMTP_USER', 'SMTP_PASS', 'BOOKING_TO_EMAIL', 'EMAIL_FROM'];
  const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  Object.assign(process.env, { SMTP_HOST: '127.0.0.1', SMTP_PORT: String(port), SMTP_SECURE: 'false', SMTP_USER: 'test@example.com', SMTP_PASS: 'test-only', BOOKING_TO_EMAIL: 'shop@example.com', EMAIL_FROM: 'test@example.com' });
  const http = createHttpServer((request, response) => { void handler(request, response); });
  http.listen(0, '127.0.0.1');
  await once(http, 'listening');
  const origin = `http://127.0.0.1:${(http.address() as { port: number }).port}`;
  const payload = () => {
    const form = new FormData();
    for (const [key, value] of Object.entries({ name: 'API Booking Test', email: 'customer@example.com', whatsapp: '+12025550123', preferredDate: '2027-01-20', preferredTime: '14:30' })) form.append(key, value);
    form.append('references', new Blob(['reference-test'], { type: 'image/png' }), 'reference.png');
    return form;
  };
  try {
    await t.test('successful email acceptance returns completed HTTP 201 with attachment', async () => {
      const response = await fetch(origin, { method: 'POST', body: payload() });
      assert.equal(response.status, 201);
      const result = await response.json();
      assert.equal(result.success, true);
      assert.ok(result.id);
      assert.equal(messages.length, 1);
      assert.match(messages[0], /API Booking Test/);
      assert.match(messages[0], /reference\.png/);
      assert.match(messages[0], /customer@example.com/);
    });
    await t.test('missing SMTP credentials returns 503 without sending mail', async () => {
      delete process.env.SMTP_PASS;
      const response = await fetch(origin, { method: 'POST', body: payload() });
      assert.equal(response.status, 503);
      assert.equal((await response.json()).success, false);
      assert.equal(messages.length, 1);
      process.env.SMTP_PASS = 'test-only';
    });
    await t.test('required validation returns 400 before SMTP', async () => {
      const response = await fetch(origin, { method: 'POST', body: new FormData() });
      assert.equal(response.status, 400);
      assert.equal(messages.length, 1);
    });
    await t.test('SMTP recipient rejection returns 503 rather than false success', async () => {
      smtpMode = 'reject';
      const response = await fetch(origin, { method: 'POST', body: payload() });
      assert.equal(response.status, 503);
      assert.equal(messages.length, 1);
    });
    await t.test('non-responsive SMTP times out before the frontend deadline', async () => {
      smtpMode = 'hang';
      const start = Date.now();
      const response = await fetch(origin, { method: 'POST', body: payload() });
      assert.equal(response.status, 503);
      assert.ok(Date.now() - start < 14000);
    });
    await t.test('oversized upload returns 413 and unsupported method returns 405', async () => {
      const form = payload();
      form.append('references', new Blob([new Uint8Array(5 * 1024 * 1024)], { type: 'image/png' }), 'large.png');
      assert.equal((await fetch(origin, { method: 'POST', body: form })).status, 413);
      assert.equal((await fetch(origin)).status, 405);
    });
  } finally {
    for (const key of keys) { if (original[key] === undefined) delete process.env[key]; else process.env[key] = original[key]; }
    sockets.forEach(socket => socket.destroy());
    await Promise.all([new Promise<void>(resolve => http.close(() => resolve())), new Promise<void>(resolve => smtp.close(() => resolve()))]);
  }
});
