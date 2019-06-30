import * as express from 'express';
import * as joi from 'joi';
import { ValidateRequest } from './Validation';
import { Request, Response } from '../../shared/Requests/SendMail';
import Config from '../Config';
import { MailJet, SendGrid } from '../EmailProviders/Index';
import '../Tools/ExtendArray';

let sendMailSchema = joi.object().keys({
  token: joi.string().required().alphanum().length(32),
  email: joi.object().required().keys({
    To: joi.array().required().min(1).items([ joi.string().email() ]),
    Cc: joi.array().optional().items([ joi.string().email() ]),
    Bcc: joi.array().optional().items([ joi.string().email() ]),
    Subject: joi.string().required().min(1).max(1024),
    Text: joi.string().optional().min(1).max(1024 * 1024 * 20),
    Html: joi.string().optional().min(1).max(1024 * 1024 * 20),
  })
});

const emailProviders = [
  new SendGrid(),
  new MailJet()
];

export async function SendMail(req: express.Request, res: express.Response): Promise<void> {
  
  // validate request
  let request = ValidateRequest<Request>(req, res, sendMailSchema);
  if (!request) return;
  
  // validate token
  let account = Config.accounts.find((a) => a.Token === request.token);
  if (!account) {
    console.log(`Api request with invalid token.`);
    res.sendStatus(401);
    return;
  }
  
  // set the sender address
  request.email.From = account.Sender;
  
  let success: boolean = false;
  let retries: number = 2;
  while (retries > 0) {
    
    // shuffle each iteration - we could remove this
    // when provider email limits aren't enforced
    for (let provider of ShuffleArray(emailProviders)) {
      if (provider.SendEmail(request.email)) {
        success = true;
        break;
      }
    }
    
    if (success) break;
    
  }
  
  if (!success) {
    res.sendStatus(503);
    return;
  }
  
  let response: Response = {};
  
  res.status(200)
  .send(JSON.stringify(response));
  
}

/** Shuffle the specified array in-place. Mutates and returns. */
function ShuffleArray<T>(array: T[]): T[] {
  
  let currentIndex: number = array.length;
  let randomIndex: number;
  
  // while there remain elements to shuffle...
  while (currentIndex !== 0) {
    
    // pick a random index
    randomIndex = Math.floor(Math.random() * currentIndex);
    
    // decrement current index
    --currentIndex;
    
    // skip if current index and random are the same
    if (currentIndex === randomIndex) continue;

    // swap random index with current index
    let temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    
  }
  
  return array;
  
}
