import { get as httpGet, request, RequestOptions } from 'https';

export async function get<T>(hostname: string, path: string): Promise<T> {

  return new Promise<T>((resolve, reject) => {

    const options: RequestOptions = {
      hostname,
      path,
      method: 'GET'
    };

    httpGet(options, (response) => {

      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => resolve(JSON.parse(data)));

    }).on("error", (error) => reject(error.message));

  });
}

export async function post<T>(hostname: string, path: string, body: any): Promise<T> {

  return new Promise<T>((resolve, reject) => {

    const content = JSON.stringify(body);

    const options: RequestOptions = {
      hostname,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': content.length
      }
    };

    const req = request(options, (response) => {

      let data = '';
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => resolve(JSON.parse(data)));

    }).on("error", (error) => reject(error.message));

    req.write(content);
    req.end();

  });
}
