import { productInfoByUrl } from '../shops/shops';
import { getChat, getProduct } from '../persistent/telegram-update';
import { getStringConfig } from '../utils/configuration';
import { get, post } from '../utils/http';
import { Message, SendMessage, Update } from './models';


export async function processUpdate(update: Update): Promise<void> {
  if (update.message.text.startsWith('/products')) {
    await products(update);
  } else if (update.message.text.startsWith('/addproduct')) {
    await addProduct(update);
  } else if (update.message.text.startsWith('/removeproduct')) {
    await removeProduct(update);
  } else if (update.message.text.startsWith('/shops')) {
    await shops(update);
  }
}

async function products(update: Update): Promise<void> {
  console.log('Replaying to /products');
  // reply(update.message, JSON.stringify(db.chats[update.message.chat.id]?.map(p => p.url)));
}

async function addProduct(update: Update): Promise<void> {

  console.log('Replaying to /addproduct');

  const productUrl = update.message.text.replace('/addproduct ', '');
  const [chatRef, chat] = await getChat(update.message.chat.id);

  if (chat.products.some(docRef => docRef.id === productUrl)) {
    reply(update.message, 'The products is already included');
    return;
  }

  const [domain, productId] = productInfoByUrl(productUrl);
  if (!domain) {
    reply(update.message, 'The product shop is not supported');
    return;
  }

  const [productRef, product] = await getProduct(domain, productId);

  chat.products.push(productRef);
  chatRef.set(chat);

  product.chats.push(chatRef);
  productRef.set(product);

  reply(update.message, 'Product added successfully');

}

async function removeProduct(update: Update): Promise<void> {
  console.log('Replaying to /removeproduct');

  const chatId = update.message.chat.id.toString();
  const productUrl = update.message.text.replace('/removeproduct ', '');

  const [domain, productId] = productInfoByUrl(productUrl);
  if (!domain) {
    reply(update.message, 'The product shop is not supported');
    return;
  }

  const [productRef, product] = await getProduct(domain, productId);
  if (product.chats.find(ref => ref.id === chatId)) {
    reply(update.message, 'Product not found');
    return;
  }

  if (product.chats.length === 1) {
    await productRef.delete();
  } else {
    const index = product.chats.findIndex(d => d.id === chatRef.id);
    product.chats.splice(index, 1);
    productRef.set(product);
  }

  const [chatRef, chat] = await getChat(update.message.chat.id);

  chat.products.splice(chat.products.findIndex(ref => ref.path === `/shops/${domain}/products/${productId}`), 1);
  chatRef.set(chat);

  reply(update.message, 'Product removed successfully');

}

async function shops(update: Update): Promise<void> {
  console.log('Replaying to /shops');
  let text = '*PCDIGA* product url example:\nhttps://www\\.pcdiga\\.com/placa\\-grafica\\-asus\\-tuf\\-gaming\\-rtx\\-3060\\-ti\\-8gb\\-gddr6\\-90yv0g11\\-m0na00';
  text += '\n\n*Globaldata* product url example:\nhttps://www\\.globaldata\\.pt/grafica\\-msi\\-geforce\\-rtx\\-3060\\-ti\\-gaming\\-x\\-trio\\-8g\\-912\\-v390\\-053';
  text += '\n\n*Novo Atalho* product url example:\nhttps://www\\.novoatalho\\.pt/pt\\-PT/produto/46052/Placa\\-Grafica\\-Asus\\-GeForce\\-RTX\\-3060\\-Ti\\-DUAL\\-OC\\-8GB/90YV0G12\\-M0NA00\\.html';
  text += '\n\n*PcComponentes* product url example:\nhttps://www\\.pccomponentes\\.pt/evga\\-geforce\\-rtx\\-3060\\-ti\\-xc\\-8gb\\-gddr6';
  reply(update.message, text, true);
}

async function reply(message: Message, text: string, markdown?: boolean): Promise<void> {

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

async function sendMessage(body: SendMessage): Promise<void> {
  return await httpPostTelegram('sendMessage', body);
}

async function httpGetTelegram<T>(command: string): Promise<T> {
  return await get('api.telegram.org', `/bot${await getStringConfig('telegramToken')}/${command}`);
}

async function httpPostTelegram<T>(command: string, body: any): Promise<T> {
  return await post('api.telegram.org', `/bot${await getStringConfig('telegramToken')}/${command}`, body);
}