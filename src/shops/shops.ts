// import { chromium, Page } from "playwright-chromium";
import { getBooleanConfig, getNumberConfig } from "../utils/configuration";
import { isPcComponentes, pcComponentesProductName as pcComponentesProductInfo } from "./pc-componentes";
import { isPcdiga, pcdigaProductInfo } from "./pcdiga";
// import { singleCheckGlobalData } from "./shops/globaldata";
// import { singleCheckNovoAtalho } from "./shops/novo-atalho";
// import { singleCheckPcComponentes } from "./shops/pc-componentes";
// import { singleCheckPcdiga } from "./shops/pcdiga";


export async function setStockCheckInterval(getProducts: () => Promise<string[]>, callback: (product: string, inStock: boolean) => Promise<void>): Promise<void> {

  setInterval(async () => {

    console.log("Checking stock for all products");

    // const browser = await chromium.launch(await getBooleanConfig('debug') ? { headless: false, slowMo: 100 } : {});
    // const context = await browser.newContext();
    // const page = await context.newPage();

    // page.setDefaultTimeout(60000);
    // page.setDefaultNavigationTimeout(60000);

    for (const product of await getProducts()) {
      // const inStock = await checkProduct(product, page);
      // await callback(product, inStock);
    }

    // browser.close();

  }, await getNumberConfig('stockCheckInterval') * 1000);
}

// TODO: Find better way to do this
// export async function checkProduct(productUrl: string, page: Page): Promise<boolean> {
//   let result = false;
// result = result || await singleCheckPcdiga(productUrl, page);
// result = result || await singleCheckGlobalData(productUrl, page);
// result = result || await singleCheckNovoAtalho(productUrl, page);
// result = result || await singleCheckPcComponentes(productUrl, page);
//   return result;
// }


export function productInfoByUrl(url: string): { shop: string, product: string, url: string } | undefined {

  if (isPcdiga(url)) {
    return pcdigaProductInfo(url);
  }

  if (isPcComponentes(url)) {
    return pcComponentesProductInfo(url);
  }
}
