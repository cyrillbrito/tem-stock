import { setStockCheckInterval } from '../../core/stock-checker';
import { getStringConfig, setConfigEnvironment } from './configuration';
import { get, post } from './http';
import { loadPersistent, PersistentData, savePersistent } from './persistent';
import { GetUpdates, Message, SendMessage, Update } from './telegram.models';

export async function processUpdates(): Promise<void> {

  console.log('Checking telegram updates');

  const res = await get<GetUpdates>('api.telegram.org', `/bot${await getStringConfig('telegramToken')}/getUpdates`);
  const db = await loadPersistent();

  // console.log(JSON.stringify(res));

  for (const update of res.result) {
    if (db.lastUpdateId < update.update_id && update.message?.text) {
      await processUpdate(update, db);
    }
  }

  db.lastUpdateId = res.result[res.result.length - 1].update_id;
  savePersistent(db);
}

export async function processUpdate(update: Update, db: PersistentData): Promise<void> {
  console.log('processUpdate');

  if (update.message.text.startsWith('/products')) {
    console.log('Replaying to /products');
    reply(update.message, JSON.stringify(db.chats[update.message.chat.id]?.map(p => p.url)));

  } else if (update.message.text.startsWith('/setproducts')) {
    console.log('Replaying to /setproducts');

    const arrStart = update.message.text.indexOf('[')
    const json = update.message.text.substr(arrStart - 1);

    try {
      const arr = JSON.parse(json);
      if (Array.isArray(arr)) {
        db.chats[update.message.chat.id] = arr.map(url => ({ url }));
        reply(update.message, 'Products list has been updated');
      } else {
        reply(update.message, 'The products list must be a valid JSON array of strings');
      }
    } catch (e) {
      reply(update.message, 'The products list must be a valid JSON array of strings. Exception: ' + e);
    }

  } else if (update.message.text.startsWith('/shops')) {
    console.log('Replaying to /shops');
    let text = '*PCDIGA* product url example:\nhttps://www\\.pcdiga\\.com/placa\\-grafica\\-asus\\-tuf\\-gaming\\-rtx\\-3060\\-ti\\-8gb\\-gddr6\\-90yv0g11\\-m0na00';
    text += '\n\n*Globaldata* product url example:\nhttps://www\\.globaldata\\.pt/grafica\\-msi\\-geforce\\-rtx\\-3060\\-ti\\-gaming\\-x\\-trio\\-8g\\-912\\-v390\\-053';
    text += '\n\n*Novo Atalho* product url example:\nhttps://www\\.novoatalho\\.pt/pt\\-PT/produto/46052/Placa\\-Grafica\\-Asus\\-GeForce\\-RTX\\-3060\\-Ti\\-DUAL\\-OC\\-8GB/90YV0G12\\-M0NA00\\.html';
    text += '\n\n*PcComponentes* product url example:\nhttps://www\\.pccomponentes\\.pt/evga\\-geforce\\-rtx\\-3060\\-ti\\-xc\\-8gb\\-gddr6';
    reply(update.message, text, true);
  }
}

export async function reply(message: Message, text: string, markdown?: boolean): Promise<void> {

  const body: SendMessage = {
    chat_id: message.chat.id,
    text,
    reply_to_message_id: message.message_id,
    disable_web_page_preview: true,
    disable_notification: true,
  }

  if (markdown) {
    body.parse_mode = 'MarkdownV2';
  }

  await sendMessage(body);
}

export async function sendMessage(body: SendMessage): Promise<void> {
  const a = await post('api.telegram.org', `/bot${await getStringConfig('telegramToken')}/sendMessage`, body);
  // console.log(a);
}

export async function share(): Promise<void> {

  try {
    const a = await get<any>('api.telegram.org', `/bot${await getStringConfig('telegramToken')}/getMyCommands`);
    console.log(a);
  } catch (e) { console.log('eee', e) }

  // try {
  //   const a = await get<any>('api.telegram.org', `/bot${await getStringConfig('telegramToken')}/getUpdates`);
  //   console.log(JSON.stringify(a));
  // } catch (e) { console.log('eee', e) }
}

setConfigEnvironment('local');
setInterval(() => processUpdates(), 3000);

// TODO: Find better ways of storing or managing this data
// setStockCheckInterval(async () => {

//   const db = await loadPersistent();
//   const productsUrls: string[] = [];

//   for (const chat in db.chats) {
//     if (chat in db.chats) {
//       const products = db.chats[chat];
//       for (const p of products) {
//         if (!productsUrls.includes(p.url)) {
//           productsUrls.push(p.url);
//         }
//       }
//     }
//   }


//   console.log("productsUrls", productsUrls);
//   return productsUrls;

// }, async (productUrl, inStock) => {

//   const db = await loadPersistent();

//   for (const chat in db.chats) {
//     if (chat in db.chats) {
//       const products = db.chats[chat];
//       for (const product of products) {
//         if (product.url === productUrl) {
//           if (product.inStock && !inStock) {
//             product.inStock = false;
//             savePersistent(db);
//           } else if (!product.inStock && inStock) {
//             sendMessage({ chat_id: Number(chat), text: product.url });
//             product.inStock = true;
//             savePersistent(db);
//           }
//         }
//       }
//     }
//   }
// });
