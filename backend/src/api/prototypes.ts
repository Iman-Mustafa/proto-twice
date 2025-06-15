import { NextApiRequest, NextApiResponse } from 'next';
import { savePrototype, getUserPrototypes } from '../../database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const prototype = await savePrototype(req.body);
      res.status(201).json(prototype);
    } catch (error) {
      res.status(500).json({ error: 'Failed to save prototype' });
    }
  } 
  else if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      const prototypes = await getUserPrototypes(userId as string);
      res.status(200).json(prototypes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch prototypes' });
    }
  }
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end('Method Not Allowed');
  }
}