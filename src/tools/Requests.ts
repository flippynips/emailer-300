
/** Options related to making a http request. */
export interface HttpOptions {
  method: string;
  data?: any;
  headers?: { [Key: string]: string };
  serializer?: 'urlencoded'|'json'|'utf8';
  timeout: number;
}

/** Structure of an xml response. */
export interface XMLResponse {
  status: number;
  data: string | Blob | ArrayBuffer | Document | any;
  error: string | null;
  url: string;
  headers: { [Key: string]: string };
}

/** Make an xml http request. */
export function MakeXMLRequest(
  url: string,
  options: HttpOptions,
  responseType: XMLHttpRequestResponseType,
  onProgress?: (loaded: number, total: number) => void
): Promise<XMLResponse> {
  
  return new Promise<XMLResponse>((resolve, reject) => {
    
    let requestComplete: boolean = false;
    
    // create the request
    let oReq = new XMLHttpRequest();
    oReq.responseType = responseType;
    
    // if set, subscribe to progress
    if (onProgress) {
      if (options.data) {
        oReq.upload.onprogress = (ev: ProgressEvent) => {
          onProgress(ev.loaded, ev.total);
        };
      } else {
        oReq.onprogress = (ev: ProgressEvent) => {
          onProgress(ev.loaded, ev.total);
        };
      }
    }
    
    // subscribe to timeout
    oReq.timeout = options.timeout;
    oReq.ontimeout = () => {
      
      if (requestComplete) return;
      requestComplete = true;
      
      reject(new Error(`Request timed out.`));
      
    };
    
    // subscribe to errors
    oReq.onerror = (ev: ProgressEvent) => {
      
      if (requestComplete) return;
      requestComplete = true;
      
      resolve({
        status: oReq.status,
        data: responseType === 'text'
          ? oReq.responseText
          : responseType === 'document'
            ? oReq.responseXML
            : oReq.response,
        error: oReq.statusText,
        url: url,
        headers: ParseXMLResponseHeaders(oReq)
      });
      
    };
    
    // subscribe to complete
    oReq.onload = (ev: ProgressEvent) => {
      
      if (requestComplete) return;
      requestComplete = true;
      
      resolve({
        status: oReq.status || 200,
        data: responseType === 'text'
          ? oReq.responseText
          : responseType === 'document'
            ? oReq.responseXML
            : oReq.response,
        error: null,
        url: url,
        headers: ParseXMLResponseHeaders(oReq)
      });
      
    };
    
    // open request
    oReq.open(options.method, url, true);
    
    // iterate and add headers
    if (options.headers) {
      for (let key in options.headers) {
        oReq.setRequestHeader(key, options.headers[key]);
      }
    }
    
    // send request
    oReq.send(options.data);
    
  });
  
}

/** Parse the response headers from an XML request. */
function ParseXMLResponseHeaders(oReq: XMLHttpRequest): { [Key: string]: string } {
  
  let headerMap: { [Key: string]: string } = {};
  for (let kvp of oReq.getAllResponseHeaders().trim().split(/[\r\n]+/)) {
    let parts = kvp.split(': ');
    let header = parts.shift() as string;
    headerMap[header] = parts.join(': ');
  }
  return headerMap;
  
}
