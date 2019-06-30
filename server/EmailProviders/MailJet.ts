
import { EmailProvider } from './Provider';
import { Email } from '../../shared/Email';
import { MakeJsonRequest } from '../Tools/Requests';
import Config from '../Config';

/** Host domain. */
const Host = 'api.mailjet.com';
/** Path used to send mail. */
const SendPath = '/v3.1/send';

/** Send mail request structure. */
interface Request {
  Messages: Array<{
    From: {
      Email: string;
      Name?: string;
    };
    To: Array<{
      Email: string;
      Name?: string;
    }>;
    Cc?: Array<{
      Email: string;
      Name?: string;
    }>;
    Bcc?: Array<{
      Email: string;
      Name?: string;
    }>;
    Subject: string;
    TextPart?: string;
    HTMLPart?: string;
  }>;
}

interface Response {
  Messages: Array<{
    Status: 'success' | 'error';
    To?: Array<{
      Email: string;
      MessageUUID: string;
      MessageID: string;
      MessageHref: string;
    }>;
    Cc?: Array<{
      Email: string;
      MessageUUID: string;
      MessageID: string;
      MessageHref: string;
    }>;
    Bcc?: Array<{
      Email: string;
      MessageUUID: string;
      MessageID: string;
      MessageHref: string;
    }>;
    Errors?: Array<{
      ErrorIdentifier: string;
      ErrorCode: string;
      StatusCode: number;
      ErrorMessage: string;
      ErrorRelatedTo: string[];
    }>;
  }>;
}

/** MailJet email provider.
 * #ref: https://dev.mailjet.com/guides/index.html */
export class MailJet extends EmailProvider {
  
  // ------------------------------------------------//
  
  // ------------------------------------------------//
  
  // ------------------------------------------------//
  
  constructor() {
    super('MailJet');
  }
  
  public async Initialize(): Promise<void> {
    // nothing to do
  }
  
  // ------------------------------------------------//
  
  protected async Send(email: Email): Promise<void> {
    
    // prepare request
    let request: Request = {
      Messages: [
        {
          From: { Email: email.From },
          To: email.To.map((e) => ({ Email: e })),
          Cc: email.Cc && email.Cc.length && email.Cc.map((e) => ({ Email: e })),
          Bcc: email.Bcc && email.Bcc.length && email.Bcc.map((e) => ({ Email: e })),
          Subject: email.Subject,
          TextPart: email.Text,
          HTMLPart: email.Html
        }
      ]
    };
    
    // send request and get response
    let response: Response = await MakeJsonRequest(
      {
        port: 443,
        method: 'POST',
        host: Host,
        path: SendPath,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${
            Buffer.from(`${Config.MailJetPublicKey}:${Config.MailJetPrivateKey}`).toString('base64')
          }`
        }
      },
      JSON.stringify(request)
    );
    
    // early validation
    if (!response
    || !response.Messages
    || !Array.isArray(response.Messages)
    || response.Messages.length !== 1) throw new Error(`No response`);
    
    let responseMessage = response.Messages[0];
    
    // did the email succeed? yes, early out
    if (responseMessage.Status === 'success') return;
    
    // validate the the erroneous response
    if (!responseMessage.Errors
    || !Array.isArray(responseMessage.Errors)) throw new Error(`Unrecognized response error.`);
    
    // concat error messages
    let errorMsgs: string = '';
    let first: boolean = true;
    for (let error of responseMessage.Errors) {
      if (typeof error.ErrorMessage !== 'string') continue;
      if (first) first = false;
      else errorMsgs += '\n';
      errorMsgs += error.ErrorMessage;
    }
    
    // throw wholistic error
    throw new Error(`Response indicated errors sending the email. ${errorMsgs}`);
    
  }
  
}
