<template>
  <div id="app">
    <transition name="screen" mode="out-in">
      <component :is="screen" @changeScreen="changeScreen"/>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Account } from '../shared/Accounts';
import { Store } from './Store';

interface DataType {
  screen: string;
  account: Account;
}

export default Vue.extend({
  name: 'App',
  data: function() {
    return {
      screen: null
    };
  },
  beforeMount: function(this: DataType) {
    
    // load initial state
    Store.loadState();
    
    // is there a local account?
    if (Store.state.account) {
      // yes, move to the dashboard
      this.screen = 'dashboard';
    } else {
      // nope, log in screen
      this.screen = 'login';
    }
    
  },
  methods: {
    changeScreen: function(this: DataType, name: string) {
      this.screen = name;
    }
  },
  components: {
    login: () => import('./components/logIn.vue'),
    dashboard: () => import('./components/dashboard.vue')
  }
});
</script>

<style lang="scss">

body {
  font-family: 'Avenir', sans-serif;
  font-size:1em;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  text-align: center;
  color: $color_text_0;
  background-color:$color_back_0;
  user-select: none;
}

hr {
  border-color:mix($tone, $color_1, 40%);
  margin:.5em;
}

/* content */

p {
  margin:0;
}

h1 {
  -webkit-margin-before:0;
  -webkit-margin-after:.2em;
}
h2 {
  -webkit-margin-before:0;
  -webkit-margin-after:.3em;
}
h3 {
  -webkit-margin-before:0;
  -webkit-margin-after:.5em;
}
h4 {
  -webkit-margin-before:0;
  -webkit-margin-after:.5em;
}

i {
  font-size: 1em;
}

ol {
  -webkit-padding-start:0;
}

/* input */
form {
  padding:1em 1.5em;
  margin:.2em;
}

input {
  outline:none;
  font-size:1em;
  padding:.2em .05em .4em .8em;
  border-top:0;
  border-right:0;
  border-bottom:.03em solid $color_1;
  border-left:.05em solid $color_1;
  background-color: rgba($color_back_1, .5);
  color:$color_text_1;
  &.good {
    text-shadow: 0 0 .08em $color_1;
  }
  &:disabled {
    color: mix($tone, desaturate($color_text_1,100%), 5%);
    background: mix($tone, desaturate($color_back_1, 100%), 5%);
  }
}

.textarea {
  background-color: rgba($color_back_1, .5);
  border:none;
  border-bottom:.03em solid $color_1;
  border-left:.05em solid $color_1;
  >textarea {
    outline:none;
    font-family:'main', 'Avenir', sans-serif;
    font-size:1em;
    background:none;
    border:none;
    color:$color_text_1;
    margin:.5em;
    padding:0;
  }
}

select {
  outline:none;
  font-size:1em;
  padding:.5em;
  border:.05em solid $color_1;
  background-image:linear-gradient($color_back_1 80%, mix($tone, $color_1, 40%));
  color:$color_text_1;
}

button, label {
  outline: none;
  overflow: hidden;
  font-size: 1em;
  text-decoration: none;
  color: $color_text_2;
  background-color: mix($tone, $color_2, 68%);
  border:none;
  border-bottom: 1px solid $color_2;
  border-radius:.3em;
  padding:.3em .6em;
  margin:.2em .3em;
  transition: background-color 200ms ease-out;
  &:active {
    background-color:mix($tone, $color_2, 35%);
    transition: unset;
  }
  &:disabled {
    color: mix($tone, desaturate($color_text_2, 90%), 5%);
    background: mix($tone, desaturate($color_back_2, 90%), 5%);
    border-color: desaturate($color_2, 90%);
  }
}

label {
  display:block;
  font-size:1.1em;
  padding:.265em .531em;
}

.disable {
  pointer-events:none;
}

::placeholder {
  color: mix($tone, desaturate($color_text_2, 70%), 35%);
  opacity: 1;
}

/* common transitions */
.screen-enter-active {
  transition: all .3s ease-out;
}
.screen-leave-active {
  transition: all .2s ease-in;
}
.screen-enter {
  opacity:0;
  transform:translateX(5%);
}
.screen-leave-to {
  opacity: 0;
  transform:translateX(-5%);
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s linear;
}

</style>
