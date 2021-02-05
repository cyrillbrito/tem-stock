import axios from "axios";
import { GetEnvString } from "../environment";
import { Chat, Product } from "../persistent/models";
import { firestore, getChat, getProduct } from "../persistent/persistent";
import { productInfoByUrl } from "../shops/shops";
import { Message, SendMessage, Update } from "./models";


export async function processUpdate(update: Update): Promise<void> {
  if (!update.message?.text) {
    return;
  }
  if (update.message.text.startsWith('/products')) {
    await products(update);
  } else if (update.message.text.startsWith('/addproduct')) {
    await addProduct(update);
  } else if (update.message.text.startsWith('/removeproduct')) {
    await removeProduct(update);
  } else if (update.message.text.startsWith('/shops')) {
    await shops(update);
  } else if (update.message.text.startsWith('/help')) {
    await help(update);
  }
}

async function products(update: Update): Promise<void> {

  const chatId = update.message.chat.id.toString();
  const chat = (await firestore.collection('chats').doc(chatId)?.get())?.data() as Chat;

  if (!chat?.products?.length) {
    reply(update.message, 'No products yet.');
    return;
  }

  const docs = await firestore.getAll(...chat.products)

  const groupedByShop: { [shop: string]: Product[] } = {};
  for (const doc of docs) {

    const shopName = doc.ref.parent.parent.id;
    const product = doc.data() as Product;

    if (groupedByShop[shopName]) {
      groupedByShop[shopName].push(product);
    } else {
      groupedByShop[shopName] = [product];
    }
  }

  let message = '';
  for (const shopName in groupedByShop) {
    if (shopName in groupedByShop) {
      message += `*\\-\\- ${shopName.replace('.', '\\.')}*\n`;
      for (const product of groupedByShop[shopName]) {
        message += `\\- [${product.name.replace(/-/g, '\\-')}](${product.url.replace(/-/g, '\\-').replace(/\./g, '\\.')}) `;
        message += `${product.inStock ? '\\.\\:\\.IN STOCK\\.\\:\\.' : 'no stock'}\n`;
      }
      message += '\n';
    }
  }

  await reply(update.message, message, true);
}

async function addProduct(update: Update): Promise<void> {

  console.log('Replaying to /addproduct');

  const productUrl = update.message.text.replace('/addproduct ', '');
  const { shop: shopName, product: productName, url: cleanUrl } = productInfoByUrl(productUrl) || {};

  if (!shopName) {
    reply(update.message, 'The product shop is not supported');
    return;
  }

  const [productRef, product] = await getProduct(shopName, productName, cleanUrl);
  const chatId = update.message.chat.id.toString();

  if (product.chats.some(ref => ref.id === chatId)) {
    reply(update.message, 'The products is already included');
    return;
  }

  const [chatRef, chat] = await getChat(update.message.chat.id);

  product.chats.push(chatRef);
  productRef.set(product);

  chat.products.push(productRef);
  chatRef.set(chat);

  reply(update.message, 'Product added successfully');
}

async function removeProduct(update: Update): Promise<void> {

  console.log('Replaying to /removeproduct');

  const chatId = update.message.chat.id.toString();
  const productUrl = update.message.text.replace('/removeproduct ', '');

  const { shop: shopName, product: productName } = productInfoByUrl(productUrl) || {};
  if (!shopName) {
    reply(update.message, 'The product shop is not supported');
    return;
  }

  const [productRef, product] = await getProduct(shopName, productName);
  if (!product.chats.some(ref => ref.id === chatId)) {
    reply(update.message, 'Product not found');
    return;
  }

  const [chatRef, chat] = await getChat(update.message.chat.id);

  if (product.chats.length === 1) {
    await productRef.delete();
  } else {
    const index = product.chats.findIndex(d => d.id === chatRef.id);
    product.chats.splice(index, 1);
    productRef.set(product);
  }

  const productIndex = chat.products.findIndex(ref => ref.id === productName && ref.parent.parent.id === shopName);
  chat.products.splice(productIndex, 1);
  chatRef.set(chat);

  reply(update.message, 'Product removed successfully');

}

async function shops(update: Update): Promise<void> {
  console.log('Replaying to /shops');
  let text = '*PCDIGA* product url example:\nhttps://www\\.pcdiga\\.com/placa\\-grafica\\-asus\\-tuf\\-gaming\\-rtx\\-3060\\-ti\\-8gb\\-gddr6\\-90yv0g11\\-m0na00';
  // text += '\n\n*Globaldata* product url example:\nhttps://www\\.globaldata\\.pt/grafica\\-msi\\-geforce\\-rtx\\-3060\\-ti\\-gaming\\-x\\-trio\\-8g\\-912\\-v390\\-053';
  // text += '\n\n*Novo Atalho* product url example:\nhttps://www\\.novoatalho\\.pt/pt\\-PT/produto/46052/Placa\\-Grafica\\-Asus\\-GeForce\\-RTX\\-3060\\-Ti\\-DUAL\\-OC\\-8GB/90YV0G12\\-M0NA00\\.html';
  text += '\n\n*PcComponentes* product url example:\nhttps://www\\.pccomponentes\\.pt/evga\\-geforce\\-rtx\\-3060\\-ti\\-xc\\-8gb\\-gddr6';
  reply(update.message, text, true);
}

async function help(update: Update): Promise<void> {
  console.log('Replaying to /help');
  let text = '*What does the bot do\\?*';
  text += '\n\nThis bot allows you to set a products watch lists and every time any of those products has stock you will be notified\\.';
  text += '\n\n*How to make it work\\?*';
  text += '\n\nFor the bot to work you need to add products to the watch list\\.';
  text += '\n\nTo do this you can use the command \\/addproduct product\\-url\\.';
  text += '\n\nBe careful because not all shop websites work\\, use \\/shops to see the supported shops\\.';
  text += '\n\nTo remove a product from the watch list use \\/removeproduct product\\-url\\.';
  text += '\n\nTo see the current watch list use \\/products\\.';
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

export async function sendMessage(body: SendMessage): Promise<void> {
  return await httpPostTelegram('sendMessage', body);
}

export async function httpGetTelegram<T>(command: string): Promise<T> {
  const url = `api.telegram.org/bot${await GetEnvString('telegramToken')}/${command}`;
  const res = await axios.get<T>(url);
  return res.data;
}

export async function httpPostTelegram<T>(command: string, body: any): Promise<T> {
  const url = `api.telegram.org/bot${await GetEnvString('telegramToken')}/${command}`;
  const res = await axios.post<T>(url, body);
  return res.data;
}
