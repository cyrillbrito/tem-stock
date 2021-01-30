import { getStringConfig, setConfigEnvironment } from "../utils/configuration";
import { get, post } from "../utils/http";
import { SetWebhook } from "./models";

setConfigEnvironment('local');

export async function getWebhook(): Promise<void> {
  const resp = await get('api.telegram.org', `/bot${await getStringConfig('telegramToken')}/getWebhookInfo`);
  console.log(resp);
}

export async function setWebhook(): Promise<void> {

  const req: SetWebhook = {
    url: 'https://europe-west2-tem-stock.cloudfunctions.net/webhook',
    drop_pending_updates: true,
  };

  const resp = await post('api.telegram.org', `/bot${await getStringConfig('telegramToken')}/setWebhook`, req);
  console.log(resp);
}

getWebhook();
