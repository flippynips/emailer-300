import { EmailProvider } from './Provider';
import { Email } from '../../shared/Email';
import { MakeJsonRequest } from '../Tools/Requests';
import Config from '../Config';

/** Host domain. */
const Host = 'api.sendgrid.com';
/** Path used to send mail. */
const SendPath = '/v3/mail/send';

/** Send mail request structure. */
interface Request {
  from: { email: string; };
  personalizations: Array<{
    to: Array<{ email: string; }>;
    cc?: Array<{ email: string; }>;
    bcc?: Array<{ email: string; }>;
    subject: string;
  }>;
  content: Array<{
    type: string;
    value: string;
  }>;
}

/** SendGrid email provider.
 * #ref: https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/index.html */
export class SendGrid extends EmailProvider {
  
  // ------------------------------------------------//
  
  // ------------------------------------------------//
  
  // ------------------------------------------------//
  
  constructor() {
    super('SendGrid');
  }
  
  public async Initialize(): Promise<void> {
    // nothing to do
  }
  
  // ------------------------------------------------//
  
  protected async Send(email: Email): Promise<void> {
    
    // prepare request
    let request: Request = {
      from: { email: email.From },
      personalizations: [{
        to: email.To.map((e) => ({ email: e })),
        cc: email.Cc && email.Cc.map((e) => ({ email: e })),
        bcc: email.Bcc && email.Bcc.map((e) => ({ email: e })),
        subject: email.Subject
      }],
      content: [
        ...email.Html && [{
          type: 'text/html',
          value: email.Html
        }] || [],
        ...email.Text && [{
          type: 'text/plain',
          value: email.Text
        }] || []
      ]
    };
    
    // send request (empty response)
    await MakeJsonRequest(
      {
        port: 443,
        method: 'POST',
        host: Host,
        path: SendPath,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${Config.SendGridApiKey}`
        }
      },
      JSON.stringify(request)
    );
    
  }
  
}
