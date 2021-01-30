import { DocumentData, DocumentReference, Firestore } from '@google-cloud/firestore';

const firestore = new Firestore();
let lastUpdateId: number;

export async function getLastUpdateId(): Promise<number> {

  if (!lastUpdateId) {
    const doc = await firestore.collection('main').doc('main');
    lastUpdateId = (await doc.get()).data()?.lastUpdateId ?? 999999999999999999999999;
  }

  return lastUpdateId;
}

export async function setLastUpdateId(value: number): Promise<void> {
  await firestore.collection('main').doc('main').set({ lastUpdateId: value });
}

export interface Chat {
  products: DocumentReference<Product>[];
}

export async function getChat(chatId: number): Promise<[DocumentReference<Chat>, Chat]> {
  const docRef = firestore.collection('chats').doc(chatId.toString()) as DocumentReference<Chat>;
  const doc = await docRef.get();
  const chat = doc.data() ?? { products: [] };
  return [docRef, chat];
}

export async function setChat(chatId: string, value: Chat): Promise<void> {
  await firestore.collection('chats').doc(chatId).set(value);
}

export interface Product {
  inStock: boolean;
  name: string;
  chats: DocumentReference<Chat>[];
}

export async function getProduct(shopDomain: string, productId: string): Promise<[DocumentReference<Product>, Product]> {
  console.log('shopDomain', shopDomain, 'product', productId);
  const docRef = firestore.collection('shops').doc(shopDomain).collection('products').doc(productId) as DocumentReference<Product>;
  const doc = await docRef.get();
  const product = doc.data() ?? { inStock: false, chats: [], name: productId };
  return [docRef, product];
}

// export async function setProduct(productUrl: string, value: Product): Promise<void> {
//   await firestore.collection('chats').doc(chatId).set(value);
// }


// export async function getShop(shopDomain: string): Promise<Product> {
//   const doc = await firestore.collection('shops').doc(shopDomain).collection('products').;
//   return (await doc.get()).data() as Product;
// }
