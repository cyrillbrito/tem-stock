// import { OptionValues } from 'commander';
// import { Page } from 'playwright-chromium';
// import { logProduct, logProductInStock, logProductNoStock, logProductNotFound } from '../../logger';

// export async function check(products: string[], page: Page, options: OptionValues): Promise<void> {
//   for (const product of products) {
//     await singleCheckPcdiga(product, page);
//     await page.waitForTimeout(options.interval * 1000);
//   }
// }

// // TODO: do not use playwright
// // TODO: maybe the categorization of the product should be done before
// export async function singleCheckPcdiga(product: string, page: Page): Promise<boolean> {

//   if (!product.includes('https://www.pcdiga.com/')) {
//     return false;
//   }

//   const name = product.replace('https://www.pcdiga.com/', 'PCDIGA > ').replace(/-/g, ' ');
//   logProduct(name);

//   await page.goto(product);
//   const element = await page.$('#skrey_estimate_date_product_page_wrapper');
//   const text = await element?.innerText();

//   if (!text) {
//     logProductNotFound();
//     return false;
//   } else if (text.trim() === 'Sem stock') {
//     logProductNoStock();
//     return false;
//   } else {
//     logProductInStock();
//     return true;
//   }
// }



export function isPcdiga(url: string): boolean {
  return url.startsWith('https://www.pcdiga.com');
}

export function pcdigaProductInfo(url: string): { shop: string, product: string, url: string } {
  const shop = 'pcdiga.com';
  const ss = url.split('/');
  const product = ss[ss.length - 1].split('?')[0];
  const newUrl = shop + '/' + product;
  return { shop, product, url: newUrl };
}
