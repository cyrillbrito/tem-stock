// import { OptionValues } from 'commander';
// import { Page } from 'playwright-chromium';
// import { logProduct, logProductInStock, logProductNoStock, logProductNotFound } from '../../logger';

// export async function globalDataCheck(products: string[], page: Page, options: OptionValues): Promise<void> {

//   for (const product of products) {
//     await singleCheckGlobalData(product, page);
//     await page.waitForTimeout(options.interval * 1000);
//   }

// }

// export async function singleCheckGlobalData(product: string, page: Page): Promise<boolean> {

//   if (!product.includes('https://www.globaldata.pt/')) {
//     return false;
//   }

//   const name = product.replace('https://www.globaldata.pt/', 'Globaldata > ').replace(/-/g, ' ');
//   logProduct(name);

//   await page.goto(product);
//   const element = await page.$('.stock-lifting>.stock-shops>span:first-child');
//   const text = await element?.innerText();

//   if (!text) {
//     logProductNotFound();
//     return false;
//   } else if (text.trim() === 'ESGOTADO') {
//     logProductNoStock();
//     return false;
//   } else {
//     logProductInStock();
//     return true;
//   }
// }
