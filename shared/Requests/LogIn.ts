import { Account } from '../Accounts';

export interface Request {
  u: string;
  p: string;
}

export interface Response {
  account: Account;
}
