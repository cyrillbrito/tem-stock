import { setConfigEnvironment } from '../telegram/configuration';
import { processUpdates } from '../telegram/telegram';

setConfigEnvironment('local');

export async function telegramUpdate(req: any, res: any) {
  await processUpdates();
  res.status(200).send('ok');
}