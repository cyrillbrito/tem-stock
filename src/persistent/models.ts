import { DocumentReference } from "@google-cloud/firestore";

export interface Chat {
  products: DocumentReference<Product>[];
}

export interface Product {
  inStock: boolean;
  name: string;
  url: string;
  chats: DocumentReference<Chat>[];
}
