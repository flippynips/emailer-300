import { Account } from '../shared/Accounts';

export const Store = {
  state: {
    account: <Account> null,
    server: 'http://localhost:80'
  },
  loadState() {
    let accountStr = window.localStorage.getItem('account');
    if (accountStr) this.state.account = JSON.parse(accountStr);
  },
  setAccount(account: Account) {
    window.localStorage.setItem('account', JSON.stringify(account));
    this.state.account = account;
  },
  clearAccount() {
    window.localStorage.removeItem('account');
    this.state.account = null;
  }
};
