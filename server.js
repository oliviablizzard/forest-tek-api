import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import organizationsRouter from './routes/organizations.js';
import programsRouter from './routes/programs.js';
import suggestionsRouter from './routes/suggestions.js';
import toolsRouter from './routes/tools.js';


const { PORT } = process.env;
const app = express();

app.use(cors());
app.use(express.json());

// Use the routers
app.use('/organizations', organizationsRouter);
app.use('/programs', programsRouter);
app.use('/suggestions', suggestionsRouter);
app.use('/tools', toolsRouter);

app.listen(PORT, () => {
    console.log(`Server listening at PORT ${PORT}`);
});