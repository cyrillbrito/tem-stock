import axios from 'axios';
import { load } from 'cheerio';

interface PriceAvailabilityResponse {
  availability: {
    status: string;
  };
}

export function isPcComponentes(url: string): boolean {
  return url.startsWith('https://www.pccomponentes.pt');
}

export function pcComponentesProductName(url: string): { shop: string, product: string, url: string } {
  const shop = 'pccomponentes.pt';
  const ss = url.split('/');
  const product = ss[ss.length - 1].split('?')[0];
  const newUrl = shop + '/' + product;
  return { shop, product, url: newUrl };
}

export async function pcComponentesProductHasStock(url: string): Promise<boolean> {

  const htmlRes = await axios.get(url);
  const $ = load(htmlRes.data);

  const element = $('#contenedor-principal');
  const articleId = element.attr('data-id');

  const apiUrl = 'https://www.pccomponentes.pt/ajax_nc/articles/price_and_availability?idArticle=' + articleId;
  const apiRes = await axios.get<PriceAvailabilityResponse>(apiUrl);

  return apiRes.data.availability.status !== 'outOfStock';
}

// pcComponentesProductHasStock('https://www.pccomponentes.pt/cooler-master-elite-v3-600w-pfc-activo');
