import express from 'express';
import cors from 'cors';
import router from './routes';

const app = express();
const port = 5001; // Using 5001 to avoid conflict with your main backend on 5000

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/symptoms', router);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`AI Analysis service running at http://localhost:${port}`);
});
