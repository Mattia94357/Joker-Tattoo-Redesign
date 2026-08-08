import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  }),
);
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    success: true,
    message: 'Joker Tattoo API is running',
  });
});

export default app;

