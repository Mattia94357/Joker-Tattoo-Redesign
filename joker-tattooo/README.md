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

## Checks and production builds

```bash
npm run typecheck
npm run lint
npm run build
```
