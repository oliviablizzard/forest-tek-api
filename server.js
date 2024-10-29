import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import organizationsRouter from './routes/organizations.js';
import programsRouter from './routes/programs.js';
import suggestionsRouter from './routes/suggestions.js';
import toolsRouter from './routes/tools.js';

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/organizations', organizationsRouter);
app.use('/programs', programsRouter);
app.use('/suggestions', suggestionsRouter);
app.use('/tools', toolsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('An unexpected error occurred:', err);
  res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server listening at PORT ${PORT}`);
});