import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes


app.listen(PORT, () => {
  console.log(`Server listening at PORT ${PORT}`);
});