import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import { Prototype } from './types/prototype';

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, fidelity } = req.body as {
      prompt: string;
      fidelity: 'high' | 'medium' | 'low';
    };
    
    // ... AI generation logic
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});