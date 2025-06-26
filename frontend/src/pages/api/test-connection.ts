import type { NextApiRequest, NextApiResponse } from 'next';
import { fetch } from 'undici';

const SD_API_URL = process.env.STABLE_DIFFUSION_API_URL || 'http://localhost:7860';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${SD_API_URL}/sdapi/v1/progress`);
    if (!response.ok) throw new Error(`SD API returned ${response.status}`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('🔌 Test connection failed:', err);
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown connection error',
    });
  }
}