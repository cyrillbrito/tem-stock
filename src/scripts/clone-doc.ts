import { DocumentReference } from "@google-cloud/firestore";
import { SetEnv } from "../environment";
import { Chat } from "../persistent/models";
import { firestore } from "../persistent/persistent";

async function cloneChat(oldChatId: string, newChatId: string): Promise<void> {

  const oldChat = (await firestore.collection('chats').doc(oldChatId)?.get())?.data() as Chat;

  const newChatRef = firestore.collection('chats').doc(newChatId) as DocumentReference<Chat>;
  const newChat: Chat = { products: [] };

  for (const prodRef of oldChat.products) {
    const prod = (await prodRef.get()).data();
    prod.chats.push(newChatRef);
    newChat.products.push(prodRef);
    await prodRef.set(prod);
  }

  await newChatRef.set(newChat);
}

SetEnv('local');
cloneChat('377253014', '946718307')
