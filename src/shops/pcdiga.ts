import axios from 'axios';
import { load } from 'cheerio';

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

export async function pcdigaProductHasStock(url: string): Promise<boolean> {

  const response = await axios.get(url);
  const $ = load(response.data);

  const element = $('#skrey_estimate_date_product_page_wrapper');
  const text = element.text().trim();

  // console.log(text);
  // console.log(text !== 'Sem stock');

  return text !== 'Sem stock';
}

// pcdigaProductHasStock('https://www.pcdiga.com/placa-grafica-gigabyte-geforce-rtx-3060-ti-eagle-8gb-gddr6-gvn306teo-00-g');
