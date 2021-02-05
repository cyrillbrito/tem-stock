import { Request, Response } from 'express';
import { checkStock } from './shops/shops';
import { Update } from './telegram/models';
import { processUpdate } from './telegram/telegram';


export async function webhook(req: Request<null, null, Update>, res: Response) {
  await processUpdate(req.body);
  res.status(200).send('ok');
}

export async function telegramUpdate(req: Request, res: Response) {
  await checkStock();
  res.status(200).send('ok');
}
