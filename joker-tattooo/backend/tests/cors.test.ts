import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import app from '../src/app';

test('Express CORS allows migration domains and rejects unrelated origins', async () => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const endpoint = `http://127.0.0.1:${(server.address() as { port: number }).port}/api/bookings`;
  try {
    for (const origin of [
      'https://joker-tattoo-redesign.vercel.app',
      'https://jokertattoophuket.com',
      'https://www.jokertattoophuket.com',
    ]) {
      const response = await fetch(endpoint, { method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'POST' } });
      assert.equal(response.status, 204);
      assert.equal(response.headers.get('access-control-allow-origin'), origin);
      assert.match(response.headers.get('vary') ?? '', /Origin/);
      assert.equal(response.headers.get('access-control-allow-credentials'), null);
    }
    const response = await fetch(endpoint, { method: 'OPTIONS', headers: { Origin: 'https://unrelated.example', 'Access-Control-Request-Method': 'POST' } });
    assert.equal(response.headers.get('access-control-allow-origin'), null);
  } finally {
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
