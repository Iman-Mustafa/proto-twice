import type { NextApiRequest, NextApiResponse } from 'next';
import { fetch } from 'undici';

const SD_API_URL = process.env.STABLE_DIFFUSION_API_URL || 'http://localhost:7860';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${SD_API_URL}/sdapi/v1/progress`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err: any) {
    console.error('📉 Error proxying SD progress:', err);
    res.status(500).json({ error: 'Failed to fetch progress from SD' });
  }
}