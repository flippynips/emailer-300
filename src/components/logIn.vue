<template>
  <div class="log-in">
    <h2>Log In</h2>
    <form @submit="LogIn">
      <input type="text" class="credentials" placeholder="Username"
        v-model="username" @focus="warning = null"/>
      <input type="password" class="credentials" placeholder="Password"
        v-model="password" @focus="warning = null"/>
      <button type="button" class="button-log-in" @click="LogIn">Log In</button>
    </form>
    <p v-if="warning" class="warning">{{ warning }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Store } from '../Store';
import { Request, Response } from '../../shared/Requests/LogIn';
import { MakeXMLRequest } from '../tools/Requests';

interface DataType extends Vue {
  
  /** Entered username. */
  username: string;
  /** Entered password. */
  password: string;
  
  /** Log in warning. */
  warning: string | null;
  
}

export default Vue.extend({
  data() {
    return {
      username: '',
      password: '',
      warning: null
    };
  },
  methods: {
    LogIn: function(this: DataType) {
      
      this.warning = null;
      
      // validate username and password
      if (this.username.length === 0) {
        this.warning = 'Please enter username.';
        return;
      }
      
      if (this.password.length === 0) {
        this.warning = 'Please enter password.';
        return;
      }
      
      let self = this;
      MakeXMLRequest(
        `${Store.state.server}/api/v1/login`,
        {
          method: 'post',
          data: JSON.stringify({
            u: this.username,
            p: this.password
          } as Request),
          timeout: 5000
        },
        'json'
      ).then((res) => {
        
        switch (res.status) {
          case 200:
            break;
          case 401:
            // unrecognized credentials
            self.warning = 'Invalid username or password.';
            return;
          case 405:
            // unhandled validation error
            self.warning = 'Validation error! Please check fields.';
            return;
          case 500:
            // server indicated an error
            self.warning = 'Server encountered an error. Please notify your administrator.';
            return;
          case 502:
          case 503:
          case 504:
            // connection issue
            self.warning = 'Connection failed! Please check connectivity.';
            return;
          default:
            console.log(`Unhandled response status code '${res.status}'.`);
            location.reload();
            return;
        }
        
        // reference the response
        let response = res.data as Response;
        
        // persist the account
        Store.setAccount(response.account);
        
        // move to dashboard
        self.$emit('changeScreen', 'dashboard');
        
      })
      .catch((error) => {
        
        console.log(`Error logging in. ${error}`);
        self.warning = error;
        
      });
      
    }
  }
});
</script>

<style scoped lang="scss">

.log-in {
  text-align: center;
  margin:20vh 0 0 35vw;
  width:30vw;
}

.credentials {
  display:block;
  width:100%;
  margin:.5em 0;
  border-radius: .2em;
}

.button-log-in {
  display:block;
  margin:.5em;
}

</style>
