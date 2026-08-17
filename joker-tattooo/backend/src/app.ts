import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import bookingRoutes from './routes/bookings';

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

app.use('/api/bookings', bookingRoutes);

app.use((error: unknown, _request: express.Request, response: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    response.status(400).json({ success: false, message: error.code === 'LIMIT_FILE_SIZE' ? 'Each reference image must be 3 MB or smaller.' : 'A maximum of 5 reference images can be attached.' });
    return;
  }
  next(error);
});

export default app;
