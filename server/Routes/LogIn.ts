import * as express from 'express';
import * as joi from 'joi';
import * as uuid from 'uuid';
import { ValidateRequest } from './Validation';
import { Request, Response } from '../../shared/Requests/LogIn';
import Config from '../Config';

let logInSchema = joi.object().keys({
  u: joi.string().required().regex(/^[a-zA-Z0-9 !@#$%^&*()_\-+=[\]{}'";:\/\\<>.<>\?\|]{1,30}$/),
  p: joi.string().required().regex(/^[a-zA-Z0-9 !@#$%^&*()_\-+=[\]{}'";:\/\\<>.<>\?\|]{1,30}$/)
});

export async function LogIn(req: express.Request, res: express.Response): Promise<void> {
  
  // validate
  let request = ValidateRequest<Request>(req, res, logInSchema);
  if (!request) return;
  
  // find the account
  let account = Config.accounts.find((a) => a.Username.trim() === request.u);
  if (!account) {
    console.log(`Attempt to log in with unknown username '${request.u}'.`);
    res.sendStatus(401);
    return;
  }
  
  // validate password
  if (account.Password !== request.p) {
    console.log(`Attempt to log into account '${request.u}' with incorrect password.`);
    res.sendStatus(401);
    return;
  }
  
  // set token
  account.Token = uuid.v1().replace(new RegExp('-', 'g'), '');
  
  let response: Response = {
    account: {
      Username: account.Username,
      Token: account.Token,
      Sender: account.Sender
    }
  };
  
  res.header('Content-Type', 'text/json');
  res.send(response);
  
}
