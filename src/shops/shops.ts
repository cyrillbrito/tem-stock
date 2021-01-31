import { firestore } from "../persistent/telegram-update";
import { isPcComponentes, pcComponentesProductName as pcComponentesProductInfo } from "./pc-componentes";
import { isPcdiga, pcdigaProductInfo } from "./pcdiga";

export async function checkStock(): Promise<void> {
  const shopsRefs = await firestore.collection('shops').listDocuments();



  // for (const shop of shops) {

  // }

}

export function productInfoByUrl(url: string): { shop: string, product: string, url: string } | undefined {

  if (isPcdiga(url)) {
    return pcdigaProductInfo(url);
  }

  if (isPcComponentes(url)) {
    return pcComponentesProductInfo(url);
  }
}
