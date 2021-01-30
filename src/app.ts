import { Request, Response } from 'express';
import { Update } from './telegram/models';
import { processUpdate } from './telegram/telegram';
import { setConfigEnvironment } from './utils/configuration';

setConfigEnvironment('local');

export async function webhook(req: Request<null, null, Update>, res: Response) {
  await processUpdate(req.body);
  res.status(200).send('ok');
}
