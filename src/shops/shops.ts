import { firestore, Product } from "../persistent/telegram-update";
import { sendMessage } from "../telegram/telegram";
import { isPcComponentes, pcComponentesProductHasStock, pcComponentesProductName as pcComponentesProductInfo } from "./pc-componentes";
import { isPcdiga, pcdigaProductHasStock, pcdigaProductInfo } from "./pcdiga";

export async function checkStock(): Promise<void> {

  const shopsRefs = await firestore.collection('shops').listDocuments();

  for (const shopRef of shopsRefs) {
    const a = await shopRef.collection('products').get();

    switch (shopRef.id) {
      case 'pcdiga.com':
        for (const d of a.docs) {
          const product = d.data() as Product;
          const hasStock = await pcdigaProductHasStock(product.url);
          if (hasStock !== product.inStock) {
            if (hasStock) {
              for (const chat of product.chats) {
                await sendMessage({
                  chat_id: Number(chat.id),
                  text: product.url,
                });
              }
            }
            product.inStock = hasStock;
            await d.ref.set(product);
          }
        }
        break;

      case 'pccomponentes.pt':
        for (const d of a.docs) {
          const product = d.data() as Product;
          const hasStock = await pcComponentesProductHasStock(product.url);
          if (hasStock !== product.inStock) {
            if (hasStock) {
              for (const chat of product.chats) {
                await sendMessage({
                  chat_id: Number(chat.id),
                  text: product.url,
                });
              }
            }
            product.inStock = hasStock;
            await d.ref.set(product);
          }
        }
        break;
    }


  }
}

export function productInfoByUrl(url: string): { shop: string, product: string, url: string } | undefined {

  if (isPcdiga(url)) {
    return pcdigaProductInfo(url);
  }

  if (isPcComponentes(url)) {
    return pcComponentesProductInfo(url);
  }
}


// setConfigEnvironment('local');
// checkStock();
