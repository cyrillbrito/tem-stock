import axios from 'axios';
import { GetEnvString, SetEnv } from "../environment";
import { SetWebhook } from "../telegram/models";
import { httpGetTelegram, httpPostTelegram } from '../telegram/telegram';

export async function getWebhook(): Promise<void> {
  const resp = await httpGetTelegram('getWebhookInfo');
  console.log(resp);
}

export async function setWebhook(): Promise<void> {

  const req: SetWebhook = {
    url: 'https://europe-west2-tem-stock.cloudfunctions.net/webhook',
    drop_pending_updates: true,
  };

  const resp = await httpPostTelegram('setWebhook', req);
  console.log(resp);
}

SetEnv('local');
getWebhook();
