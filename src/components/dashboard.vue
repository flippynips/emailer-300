<template>
  <div>
    <div class="top-left">
      <button class="logout" type="button" @click="LogOut">Log Out</button>
    </div>
    
    <p class="welcome" type="button">Welcome {{ account.Username }}!</p>
    <h1>Emailer 300</h1>
    
    <send-mail/>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { Store } from '../Store';
import { Debounce, MakeXMLRequest } from '../tools/Index';
import { Account } from '../../shared/Index';

interface DataType extends Vue {
  
  /** Current account. */
  account: Account | null;
  
}

export default Vue.extend({
  name: 'Dashboard',
  data() {
    return {
      account: null
    };
  },
  beforeMount: async function(this: DataType) {
    
    // reference the account
    this.account = Store.state.account;
    // check log in status
    if (!this.account) {
      // move back to the login screen
      return this.$emit('changeScreen', 'login');
    }
    
  },
  methods: {
    LogOut: function(this: DataType) {
      Store.clearAccount();
      this.$emit('changeScreen', 'login');
    }
  },
  components: {
    'send-mail': () => import('./sendMail.vue')
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.logout {
  float:left;
}

.welcome {
  float:right;
}

</style>
