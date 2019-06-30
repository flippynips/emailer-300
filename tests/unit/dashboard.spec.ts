import { shallowMount } from '@vue/test-utils';
import Dashboard from '@/components/dashboard.vue';
import { Store } from '../../src/Store';

describe('dashboard.vue', () => {
  
  it('displays accounts username when displayed', () => {
    const account = {
      Username: 'Test Username',
      Token: 'test_token',
      Sender: 'test@sender'
    };
    
    // set the account
    Store.setAccount(account);
    
    const wrapper = shallowMount(Dashboard, {});
    
    expect(wrapper.text()).toMatch(account.Username);
    
  });
  
  it('clears account when logging out', () => {
    const account = {
      Username: 'Test Username',
      Token: 'test_token',
      Sender: 'test@sender'
    };
    
    // set the account
    Store.setAccount(account);
    
    const wrapper = shallowMount(Dashboard, {});
    
    (<any> wrapper.vm).LogOut();
    expect(Store.state.account).toBeNull();
    expect(wrapper.emitted('changeScreen'));
    
  });
  
});
