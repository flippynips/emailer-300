import { Email } from '../Email';

export interface Request {
  /** Token. */
  token: string;
  /** Email to be sent. */
  email: Email;
}

export interface Response {
}
