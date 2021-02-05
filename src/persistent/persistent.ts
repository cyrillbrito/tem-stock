import { DocumentReference, Firestore } from '@google-cloud/firestore';
import { Chat, Product } from './models';

export const firestore = new Firestore();

export async function getChat(chatId: number): Promise<[DocumentReference<Chat>, Chat]> {
  const docRef = firestore.collection('chats').doc(chatId.toString()) as DocumentReference<Chat>;
  const doc = await docRef.get();
  const chat = doc.data() ?? { products: [] };
  return [docRef, chat];
}

export async function setChat(chatId: string, value: Chat): Promise<void> {
  await firestore.collection('chats').doc(chatId).set(value);
}

export async function getProduct(shopDomain: string, productId: string, url?: string): Promise<[DocumentReference<Product>, Product] | undefined> {
  console.log('shopDomain', shopDomain, 'product', productId);
  const docRef = firestore.collection('shops').doc(shopDomain).collection('products').doc(productId) as DocumentReference<Product>;
  const doc = await docRef.get();
  const product = doc.data() ?? { inStock: false, chats: [], name: productId, url };
  return [docRef, product];
}
