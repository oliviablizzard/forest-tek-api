import express from 'express';
import cors from 'cors';
import programRoutes from './routes/programRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/programs', programRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening at PORT ${PORT}`);
});