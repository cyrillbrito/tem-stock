// import { OptionValues } from 'commander';
// import { Page } from 'playwright-chromium';
// import { logProduct, logProductInStock, logProductNoStock, logProductNotFound } from '../../logger';

// export async function novoAtalhoCheck(products: string[], page: Page, options: OptionValues): Promise<void> {
//   for (const product of products) {
//     await singleCheckNovoAtalho(product, page);
//     await page.waitForTimeout(options.interval * 1000);
//   }
// }

// export async function singleCheckNovoAtalho(product: string, page: Page): Promise<boolean> {

//   if (!product.includes('https://www.novoatalho.pt/')) {
//     return false;
//   }

//   const name = 'Novo Atalho > ' + product.split('/')[6].replace(/-/g, ' ');
//   logProduct(name);

//   await page.goto(product);
//   const element = await page.$('.stock>b>a');
//   const text = await element?.innerText();

//   if (!text) {
//     logProductNotFound();
//     return false;
//   } else if (text.trim() === 'INDISPONÍVEL') {
//     logProductNoStock();
//     return false;
//   } else {
//     logProductInStock();
//     return true;
//   }
// }