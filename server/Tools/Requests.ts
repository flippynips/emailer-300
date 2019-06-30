import * as http from 'http';
import * as https from 'https';
import Config from '../Config';

export async function MakeJsonRequest(options: http.RequestOptions, data?: any): Promise<any> {
  
  // make a request
  let incoming = await new Promise<http.IncomingMessage>((resolve, reject) => {
    
    let req: http.ClientRequest;
    if (options.port === 443 || options.protocol === 'https:') {
      req = https.request(
        options,
        resolve
      );
    } else {
      req = http.request(
        options,
        resolve
      );
    }
    
    req.setTimeout(2000, () => reject(new Error(`Request timed out.`)));
    req.on('error', reject);
    
    if (data) req.end(data);
    else req.end();
    
  });
  
  // check response code
  switch (incoming.statusCode) {
    case 200:
    case 201:
    case 202:
      break;
    default:
      throw new Error(`Error response from request to '${options.host}${options.path}'; '${incoming.statusCode}'.`);
      break;
  }
  
  // parse response
  let responseBuffer = await new Promise<Buffer>((resolve, reject) => {
    let chunks: Uint8Array[] = [];
    let length: number = 0;
    incoming.on(
      'data',
      (chunk) => {
        if (!chunks) return;
        chunks.push(chunk);
        length += chunk.length;
        if (length > Config.maxResponseSize) {
          chunks = undefined;
          try { incoming.destroy(); } catch { /* Nothing to do. */ }
          reject(new Error(`Max response length '${Config.maxResponseSize
          }' was exceeded by request to '${options.host}/${options.path}'.`));
        }
      }
    ).on(
      'end',
      () => {
        if (!chunks) return;
        resolve(Buffer.concat(chunks));
      }
    ).on(
      'error',
      (err) => {
        try { incoming.destroy(); } catch { /* Nothing to do. */ }
        reject(err);
      }
    );
  });
  
  if (responseBuffer.length === 0) return {};
  return JSON.parse(responseBuffer.toString('utf8'));
  
}
