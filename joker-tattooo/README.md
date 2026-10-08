# Joker Tattoo

Production website for Joker Tattoo Patong, with a Vite/React frontend and an Express API for booking requests.

## Technology

- Frontend: React, TypeScript, Vite, React Router, Framer Motion, CSS, and ESLint
- Backend: Node.js, Express, TypeScript, dotenv, CORS, Helmet, Morgan, nodemon, tsx, and ESLint

## Installation

From the project root, install all dependencies:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

Copy each example environment file before local development if you want to override the provided defaults:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

## Development

Run the frontend and backend together:

```bash
npm run dev
```

Or run either application separately:

```bash
npm run dev:frontend
npm run dev:backend
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4001
- API health check: http://localhost:4001/api/health

## Booking email setup

Booking requests are delivered by the backend over SMTP. Copy `backend/.env.example`
to `backend/.env` and set `SMTP_PASS` to the Gmail app password for the sending
account. Requests are addressed to `jokertattoopatongth@gmail.com`; uploaded image
references are included as attachments. Never commit the completed `.env` file.

## Vercel booking setup

The frontend project includes a same-origin Node function at `frontend/api/bookings.ts`.
Production submissions default to `/api/bookings`; local development still uses the
Express API on port 4001. Do not set a production `VITE_API_URL` to localhost.
Leave it unset for the included function, or set it to a confirmed separate API URL
ending in `/api` and configure that backend's `FRONTEND_URL` for the live website.

In the frontend Vercel project's Production environment, configure `SMTP_HOST`,
`SMTP_USER`, and `SMTP_PASS`. For the existing Gmail account, use
`smtp.gmail.com`, port `587`, `SMTP_SECURE=false`, and a Google app password.
Optional settings are `SMTP_PORT`, `SMTP_SECURE`, `EMAIL_FROM`, and `BOOKING_TO_EMAIL`.
These are server-only variables: never prefix SMTP credentials with `VITE_`.
Redeploy after changing environment variables. An accepted SMTP message returns
HTTP 201; missing configuration or delivery failure returns 503. Customer-facing
errors remain translated and do not expose provider details.

Reference images remain attached to the email. The same-origin Vercel function
allows up to five images, 3 MB per image, with a combined 4 MB limit to stay below
Vercel's request-body limit. Preferred times use the published 13:00–20:00 hours.

After deployment, submit a clearly labelled test request and confirm receipt in
the studio inbox (including spam). SMTP acceptance alone does not prove inbox delivery.

## Checks and production builds

```bash
npm run typecheck
npm run lint
npm run build
```
