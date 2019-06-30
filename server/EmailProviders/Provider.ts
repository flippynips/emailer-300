import { Email } from '../../shared/Email';

/** Base class for email provider implementations. */
export abstract class EmailProvider {
  
  // -------------------------------------------//
  
  public readonly Name: string;
  
  // -------------------------------------------//
  
  /** Promise to initialize the provider. */
  protected _initialize: Promise<void>;
  
  // -------------------------------------------//
  
  constructor(name: string) {
    this.Name = name;
    this._initialize = this.Initialize();
  }
  
  /** Initialize the provider. */
  public abstract Initialize(): Promise<void>;
  
  /** Send an email using this provider. */
  public async SendEmail(email: Email): Promise<boolean> {
    
    // initialize if required
    if (this._initialize) {
      try {
        await this._initialize;
        this._initialize = null;
      } catch (error) {
        console.log(`Failed ot initialize email provider '${this.Name}'. ${error}`);
        this._initialize = this.Initialize();
        return false;
      }
    }
    
    console.log(`Sending email to '${this.Name}';\n${JSON.stringify(email, undefined, 2)}`);
    
    // try send mail
    try {
      await this.Send(email);
      return true;
    } catch (error) {
      console.log(`Failed to send email using '${this.Name}'. ${error}`);
      return false;
    }
    
  }
  
  // -------------------------------------------//
  
  /** Send the specfifed email. */
  protected abstract Send(email: Email): Promise<void>;
  
}
