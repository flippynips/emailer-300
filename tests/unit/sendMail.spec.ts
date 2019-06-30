import { shallowMount } from '@vue/test-utils';
import SendMail from '@/components/sendMail.vue';
import { Store } from '../../src/Store';

describe('sendMail.vue', () => {
  
  it('renders accounts sender when displayed', () => {
    const account = {
      Username: 'Test Username',
      Token: 'test_token',
      Sender: 'test@sender'
    };
    
    // set the account
    Store.setAccount(account);
    
    const wrapper = shallowMount(SendMail, {});
    
    expect(wrapper.text()).toMatch(account.Sender);
    
  });
  
  it('added email is displayed', () => {
    const account = {
      Username: 'Test Username',
      Token: 'test_token',
      Sender: 'test@sender'
    };
    
    // set the account
    Store.setAccount(account);
    
    const wrapper = shallowMount(SendMail, {});
    
    let inputElement = wrapper.vm.$refs.to as HTMLInputElement;
    inputElement.value = 'added@test.com';
    let collection: string[] = [];
    
    expect((<any> wrapper.vm).AddEmail(inputElement, collection)).toBeTruthy();
    expect(inputElement.value).toBe('');
    expect(wrapper.text()).toMatch(inputElement.value);
    
  });
  
  it('attempts to add duplicate emails fail', () => {
    const account = {
      Username: 'Test Username',
      Token: 'test_token',
      Sender: 'test@sender'
    };
    
    // set the account
    Store.setAccount(account);
    
    const wrapper = shallowMount(SendMail, {});
    
    let inputElement = wrapper.vm.$refs.to as HTMLInputElement;
    inputElement.value = 'added@test.com';
    
    expect((<any> wrapper.vm).AddEmail(inputElement, (<any> wrapper.vm).to)).toBeTruthy();
    inputElement.value = 'added@test.com';
    expect((<any> wrapper.vm).AddEmail(inputElement, (<any> wrapper.vm).to)).toBeFalsy();
    
  });
  
  it('invalid email entry results in warning', () => {
    const account = {
      Username: 'Test Username',
      Token: 'test_token',
      Sender: 'test@sender'
    };
    
    // set the account
    Store.setAccount(account);
    
    const wrapper = shallowMount(SendMail, {});
    
    let inputElement = wrapper.vm.$refs.to as HTMLInputElement;
    inputElement.value = 'invalid email';
    let collection: string[] = [];
    
    expect((<any> wrapper.vm).AddEmail(inputElement, collection)).toBeFalsy();
    
  });
  
  it('attempting to send an email without recipients fails', () => {
    const account = {
      Username: 'Test Username',
      Token: 'test_token',
      Sender: 'test@sender'
    };
    
    // set the account
    Store.setAccount(account);
    
    const wrapper = shallowMount(SendMail, {});
    
    (<any> wrapper.vm).OnSend();
    
    expect((<any> wrapper.vm).infoGeneral).toMatch('Enter at least one \'To\' recipient.');
    
  });
  
  it('attempt to send email without subject fails', () => {
    const account = {
      Username: 'Test Username',
      Token: 'test_token',
      Sender: 'test@sender'
    };
    
    // set the account
    Store.setAccount(account);
    
    const wrapper = shallowMount(SendMail, {});
    
    (<any> wrapper.vm).to = [ 'recipient@test.com' ];
    (<any> wrapper.vm).OnSend();
    
    expect((<any> wrapper.vm).warningEmailSubject).toMatch('Please enter an Email subject.');
    
  });
  
  it('attempt to send email without content fails', () => {
    const account = {
      Username: 'Test Username',
      Token: 'test_token',
      Sender: 'test@sender'
    };
    
    // set the account
    Store.setAccount(account);
    
    const wrapper = shallowMount(SendMail, {});
    
    (<any> wrapper.vm).to = [ 'recipient@test.com' ];
    (<any> wrapper.vm).$refs.subject.value = 'a subject';
    (<any> wrapper.vm).OnSend();
    
    expect((<any> wrapper.vm).warningEmailContent).toMatch('Please enter Email text content.');
    
  });
  
});
