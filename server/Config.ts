
export default {
  host: 'localhost',
  port: 80,
  root: './dist',
  maxRequestSize: 1024 * 100,
  maxResponseSize: 1024 * 100,
  MailJetPublicKey: 'mail-jet-public-key',
  MailJetPrivateKey: 'mail-jet-private-key',
  SendGridApiKey: 'send-grid-api-key',
  accounts: [
    {
      Username: 'username',
      Password: 'password',
      Token: null,
      Sender: 'sender@address'
    }
  ]
};
