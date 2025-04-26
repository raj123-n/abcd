import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import symptomsRouter from './routes/symptoms';
import appointmentsRouter from './routes/appointments';

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/symptoms', symptomsRouter);
app.use('/api/appointments', appointmentsRouter);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
