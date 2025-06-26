import type { NextApiRequest, NextApiResponse } from 'next';
import { fetch, Agent } from 'undici';

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
    timeoutMs = 24 * 60 * 60 * 1000 // 24 hours default
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

  try {
    const response = await fetch('http://localhost:7860/sdapi/v1/txt2img', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      dispatcher: agent,
      body: JSON.stringify({
        prompt: `<lora:revAnimated_v122:1> <lora:UI:1> ${prompt}`,
        negative_prompt:
          'blurry, bad proportions, deformed, watermark, text artifacts, low quality, noisy background, cropped, overexposed, unrealistic layout',
        steps,
        cfg_scale: cfg,
        width,
        height,
        sampler_name: 'DPM++ 2M Karras',
        seed: 1214352040,
        scheduler: 'Automatic',
        override_settings: {
          sd_model_checkpoint: 'revAnimated_v122.safetensors',
          sd_vae: 'vae-ft-mse-840000-ema-pruned.safetensors',
        },
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const err: any = await response.json().catch(() => ({}));
      throw new Error(err?.error || `Stable Diffusion error ${response.status}`);
    }

    const data = (await response.json()) as { images?: string[] };
    const image = data.images?.[0];

    if (!image) throw new Error('No image returned from Stable Diffusion');

    return res.status(200).json({ image });
  } catch (err: any) {
    clearTimeout(timeout);

    if (err.name === 'AbortError') {
      console.error('🔴 Generation aborted due to timeout.');
      return res.status(504).json({
        error:
          'Image generation timed out. You can try reducing the step count, resolution, or simplifying the prompt.',
      });
    }

    console.error('⚠️ Image generation failed:', err);
    return res.status(500).json({ error: err.message || 'Image generation failed' });
  }
}