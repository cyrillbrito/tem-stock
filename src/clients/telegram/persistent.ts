import { promises as fs } from 'fs';

export interface PersistentData {
  lastUpdateId: number
  chats: { [id: number]: Product[] };
}

export interface Product {
  url: string;
  inStock?: boolean;
}

let persistent: PersistentData;

export async function loadPersistent(): Promise<PersistentData> {
  if (!persistent) {
    try {
      persistent = JSON.parse((await fs.readFile('./persistent/data.json')).toString());
    } catch {
      throw new Error('No persistent data file');
    }
  }
  return persistent;
}

export async function savePersistent(data: PersistentData): Promise<void> {
  persistent = data;
  await fs.writeFile('./persistent/data.json', JSON.stringify(data));
}
