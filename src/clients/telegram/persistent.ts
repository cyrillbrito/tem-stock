import { Firestore } from '@google-cloud/firestore';

export interface PersistentData {
  lastUpdateId: number
  chats: { [id: number]: Product[] };
}

export interface Product {
  url: string;
  inStock?: boolean;
}


const docRef = new Firestore().collection('main').doc('main');

export async function loadPersistent(): Promise<PersistentData> {
  const doc = await docRef.get();
  const data: PersistentData = (await doc.data()) as PersistentData ?? { lastUpdateId: 999999999999999999999999, chats: {} };
  return data;
}

export async function savePersistent(data: PersistentData): Promise<void> {
  docRef.set(data);
}
