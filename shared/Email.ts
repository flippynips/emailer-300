
export interface Email {
  
  From?: string;
  To: string[];
  Cc?: string[];
  Bcc?: string[];
  
  Subject: string;
  Text?: string;
  Html?: string;
  
}
