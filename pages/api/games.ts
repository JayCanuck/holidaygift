// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendError } from 'next/dist/server/api-utils';

interface GiftDetails {
  name?: string;
  message?: string;
  games: {
    name: string;
    code: string;
  }[];
}

interface MysteryGiftData {
  [key: string]: GiftDetails;
}

let mystery: MysteryGiftData;

try {
  mystery = JSON.parse(process.env.MYSTERY || '');
} catch (e) {
  console.warn('Warning: Invalid MYSTERY environment variable value');
  mystery = {};
}

export default function handler(req: NextApiRequest, res: NextApiResponse<GiftDetails>) {
  const id = req.query['id'] as string | undefined;

  if (id && mystery[id]) {
    res.status(200).json(mystery[id]);
  } else {
    sendError(res, 404, 'Gift details not found');
  }
}
