import { SetEnv } from "../environment";
import { SetMyCommands } from "../telegram/models";
import { httpGetTelegram, httpPostTelegram } from "../telegram/telegram";


export async function getCommands(): Promise<void> {
  const resp = await httpGetTelegram('getMyCommands');
  console.log(resp);
}

export async function setCommands(): Promise<void> {

  const req: SetMyCommands = {
    commands: [
      {
        command: 'help',
        description: 'Instructions on how to use the bot and how it works',
      },
      {
        command: 'shops',
        description: 'List all the supported shops',
      },
      {
        command: 'products',
        description: 'List all the products the bot is watching and if it has stock or not',
      },
      {
        command: 'addproduct',
        description: 'Add a product to the watch list. ex: /addproduct product-url',
      },
      {
        command: 'removeproduct',
        description: 'Remove a product from watch list. ex: /removeproduct product-url',
      },
    ]
  };

  const resp = await httpPostTelegram('setMyCommands', req);
  console.log(resp);
}

SetEnv('local');
setCommands();
