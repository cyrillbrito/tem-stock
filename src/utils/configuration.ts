let cache: { [key: string]: string } = {};

export function setConfigEnvironment(environment: string): void {
  cache = require(`../../../environment/${environment}`);
}

export async function getStringConfig(key: string): Promise<string> {
  return cache[key];
}

export async function getBooleanConfig(key: string): Promise<boolean> {
  return await getStringConfig(key) === 'true';
}

export async function getNumberConfig(key: string): Promise<number> {
  return Number(await getStringConfig(key));
}
