// import { Page } from 'playwright-chromium';
// import { logProduct, logProductInStock, logProductNoStock, logProductNotFound } from '../../logger';

// // TODO: maybe the categorization of the product should be done before
// export async function singleCheckPcComponentes(product: string, page: Page): Promise<boolean> {

//   if (!product.includes('https://www.pccomponentes.pt/')) {
//     return false;
//   }

//   const name = product.replace('https://www.pccomponentes.pt/', 'PcComponentes > ').replace(/-/g, ' ');
//   logProduct(name);

//   await page.goto(product);
//   const element = (await page.$$('#articleOutOfStock > div'))[1];
//   const text = await element?.innerText();

//   console.log(`^${text}^`);

//   if (!text) {
//     logProductNotFound();
//     return false;
//   } else if (text.trim() === 'Sem data exata de entrega') {
//     logProductNoStock();
//     return false;
//   } else {
//     logProductInStock();
//     return true;
//   }
// }

export function isPcComponentes(url: string): boolean {
  return url.startsWith('https://www.pccomponentes.pt');
}

export function pcComponentesProductName(url: string): [string, string] {
  const ss = url.split('/');
  const name = ss[ss.length - 1].split('?')[0];
  return ['pccomponentes.pt', name];
}
