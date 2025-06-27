import type { NextApiRequest, NextApiResponse } from 'next';
import { fetch, Agent } from 'undici';

const SD_API_URL = process.env.STABLE_DIFFUSION_API_URL || 'http://localhost:7860';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    prompt = '',
    steps = 20,
    cfg = 7,
    width = 512,
    height = 512,
    count = 1,
    timeoutMs = 24 * 60 * 60 * 1000,
  } = req.body;

  if (!prompt.trim()) {
    return res.status(400).json({ error: 'Prompt must be a non-empty string' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const agent = new Agent({
    connect: { timeout: 0 },
    headersTimeout: timeoutMs,
    bodyTimeout: timeoutMs,
  });

  const safeCount = Math.max(1, Math.min(count, 10)); // limit batch size to 10

  const payload = {
    prompt: `<lora:revAnimated_v122:1> <lora:UI:1> ${prompt}`,
    negative_prompt:
      'blurry, bad proportions, deformed, watermark, text artifacts, low quality, noisy background, cropped, overexposed, unrealistic layout',
    steps,
    cfg_scale: cfg,
    width,
    height,
    batch_size: safeCount,
    sampler_name: 'DPM++ 2M Karras',
    seed: 1214352040,
    scheduler: 'Automatic',
    override_settings: {
      sd_model_checkpoint: 'revAnimated_v122.safetensors',
      sd_vae: 'vae-ft-mse-840000-ema-pruned.safetensors',
    },
  };

  try {
    console.log('🔁 Generating', safeCount, 'screens from prompt:', prompt);

    const response = await fetch(`${SD_API_URL}/sdapi/v1/txt2img`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      dispatcher: agent,
      body: JSON.stringify(payload),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      console.error('🟥 SD API error:', errText);
      return res.status(502).json({ error: `Stable Diffusion returned ${response.status}` });
    }

    const data = await response.json() as { images?: string[] };
    const images = data.images ?? [];

    if (!images.length) {
      return res.status(500).json({ error: 'Stable Diffusion returned no images' });
    }

    return res.status(200).json({ images });
  } catch (err: any) {
    clearTimeout(timeout);

    if (err.name === 'AbortError') {
      console.error('🛑 Image generation timeout');
      return res.status(504).json({ error: 'Image generation timed out' });
    }

    console.error('⚠️ Generation failed:', err);
    return res.status(500).json({ error: err?.message || 'Unknown error during generation' });
  }
}