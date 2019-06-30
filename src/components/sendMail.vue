<template>
  <div class="send-mail">
    
    <!-- Feedback -->
    <notification ref="notification"/>
    <send-spinner v-if="isSending"/>
    
    <!-- Email input fields - TODO : Create email input component. -->
    <div>
      <p class="sender">From:  {{ from }}</p>
      <div>
        <p class="email-label">  To: </p>
        <input
          ref="to"
          type="email" class="email-input"
          @input="OnEmailInput($event.target, to)"
          @keydown="OnEmailKey($event, to)"/>
        <transition-group name="recipients" appear>
          <div v-for="email in to" :key="email" class="email-recipient">
            <p class="email-name">{{ email }}</p>
            <button type="button" class="email-remove" @click="to.splice(to.indexOf(email), 1)">⛌</button>
          </div>
        </transition-group>
      </div>
      <div>
        <p class="email-label">  Cc: </p>
        <input
          ref="cc"
          type="email" class="email-input"
          @input="OnEmailInput($event.target, cc)"
          @keydown="OnEmailKey($event, cc)"/>
        <transition-group name="recipients" appear>
          <div v-for="email in cc" :key="email" class="email-recipient">
            <p class="email-name">{{ email }}</p>
            <button type="button" class="email-remove" @click="cc.splice(cc.indexOf(email), 1)">⛌</button>
          </div>
        </transition-group>
      </div>
      <div>
        <p class="email-label">  Bcc: </p>
        <input
          ref="bcc"
          type="email" class="email-input"
          @input="OnEmailInput($event.target, bcc)"
          @keydown="OnEmailKey($event, bcc)"/>
        <transition-group name="recipients" appear>
          <div v-for="email in bcc" :key="email" class="email-recipient">
            <p class="email-name">{{ email }}</p>
            <button type="button" class="email-remove" @click="bcc.splice(bcc.indexOf(email), 1)">⛌</button>
          </div>
        </transition-group>
      </div>
    </div>
    <hr>
    
    <!-- Subject -->
    <input ref="subject" class="subject" type="text" title="Email Subject" @focus="warningEmailSubject = null"
      placeholder="Subject..." pattern="[^\x00-\x1F\x80-\x9F]+"/>
    <tooltip v-if="warningEmailSubject" :p_text="warningEmailSubject"/>
    
    <!-- Email Text Content -->
    <div class="textarea">
      <textarea ref="content" class="content" type="text" title="Email Content" @focus="warningEmailContent = null"
        placeholder="Text..." pattern="[^\x00-\x1F\x80-\x9F]+"/>
    </div>
    <tooltip v-if="warningEmailContent" :p_text="warningEmailContent"/>
    
    <button type="button" class="action-button" @click="ClearInput">Clear</button>
    <button type="button" class="action-button" @click="OnSend">Send</button>
    <transition name="fade">
      <label v-if="infoGeneral" class="info">{{ infoGeneral }}</label>
    </transition>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Notification, { DataType as NotificationType } from './notification.vue';
import SendSpinner from './sendSpinner.vue';
import Tooltip from './tooltip.vue';

import { MakeXMLRequest } from '../tools/Requests';
import { Request, Response } from '../../shared/Requests/SendMail';
import { Store } from '../Store';

interface DataType {
  
  $refs: {
    to: HTMLInputElement;
    cc: HTMLInputElement;
    bcc: HTMLInputElement;
    subject: HTMLInputElement;
    content: HTMLInputElement;
    notification: NotificationType;
  };
  
  /** From email address. */
  from: string;
  /** Destination email addresses. */
  to: string[];
  /** Carbon copy email addresses. */
  cc: string[];
  /** Blind carbon copy email addresses. */
  bcc: string[];
  
  /** General info string. */
  infoGeneral: string | null;
  /** Warning for the email subject. */
  warningEmailSubject: string | null;
  /** Warning for the email content. */
  warningEmailContent: string | null;
  
  /** Flag indicating sending state. Toggles the fullscreen overlay. */
  isSending: boolean;
  
  /** Add an email. Checks for duplicates and validates. */
  AddEmail(target: HTMLInputElement, collection: string[]): boolean;
  /** Clear all current input fields. */
  ClearInput(): void;
  
}

export default Vue.extend({
  data() {
    return {
      from: Store.state.account.Sender,
      to: [],
      cc: [],
      bcc: [],
      infoGeneral: null,
      warningEmailSubject: null,
      warningEmailContent: null,
      isSending: false
    };
  },
  methods: {
    OnSend: function(this: DataType) {
      
      this.infoGeneral = null;
      
      // validate input fields
      if (this.$refs.to.value.length) {
        if (!this.AddEmail(this.$refs.to, this.to)) return;
      }
      if (this.$refs.cc.value.length) {
        if (!this.AddEmail(this.$refs.cc, this.cc)) return;
      }
      if (this.$refs.bcc.value.length) {
        if (!this.AddEmail(this.$refs.bcc, this.bcc)) return;
      }
      if (!this.to.length) {
        this.infoGeneral = `Enter at least one 'To' recipient.`;
        return;
      }
      
      // validate subject
      if (!this.$refs.subject.value.length || !this.$refs.subject.checkValidity()) {
        this.warningEmailSubject = 'Please enter an Email subject.';
        return;
      }
      // validate text content
      if (!this.$refs.content.value.length || !this.$refs.content.checkValidity()) {
        this.warningEmailContent = 'Please enter Email text content.';
        return;
      }
      
      this.isSending = true;
      
      // send the mail
      let self = this;
      MakeXMLRequest(
        `${Store.state.server}/api/v1/send-mail`,
        {
          method: 'post',
          data: JSON.stringify({
            token: Store.state.account.Token,
            email: {
              To: this.to,
              Cc: this.cc.length && this.cc || undefined,
              Bcc: this.bcc.length && this.bcc || undefined,
              Subject: this.$refs.subject.value,
              Text: this.$refs.content.value
            }
          } as Request),
          timeout: 6000
        },
        'json'
      ).then((res) => {
        
        switch (res.status) {
          case 200:
            break;
          case 405:
            // unhandled validation error
            self.infoGeneral = 'Validation error! Please check fields.';
            return;
          case 401:
            // unauthorized - reload
            Store.clearAccount();
            location.reload();
            return;
          case 500:
            // server indicated an error
            self.infoGeneral = 'Server encountered an error. Please notify your administrator.';
            return;
          case 502:
          case 504:
            // connection issue
            self.infoGeneral = 'Connection failed! Please check connectivity.';
            return;
          case 503:
            // connection issue
            self.infoGeneral = 'Email provider did not respond successfully.';
            return;
          default:
            console.log(`Unhandled response status code '${res.status}'.`);
            location.reload();
            return;
        }
        
        // clear fields
        self.ClearInput();
        // show success
        self.$refs.notification.Show('Send Complete!');
        
      })
      .catch((error) => {
        console.log(`Unhandled error making send mail request. ${error && error.stack || error}`);
      })
      .then(() => {
        self.isSending = false;
      });
      
    },
    OnEmailInput: function(this: DataType, target: HTMLInputElement, collection: string[]) {
      
      this.infoGeneral = null;
      
      if (!target.value.length) return;
      
      switch (target.value[target.value.length - 1]) {
        case ',':
        case ';':
          target.value = target.value.substring(0, target.value.length - 1);
          this.AddEmail(target, collection);
          return;
      }
      
    },
    OnEmailKey: function(this: DataType, event: KeyboardEvent, collection: string[]) {
      
      // was 'enter'/'return' pressed?
      if (event.keyCode === 13 || event.keyCode === 9) {
        // yes, validate and add the email
        if (this.AddEmail(event.target as HTMLInputElement, collection)) {
          // prevent tab cycle
          event.preventDefault();
        }
      }
      
    },
    AddEmail: function(this: DataType, target: HTMLInputElement, collection: string[]): boolean {
      
      // validate the email input
      if (!target.value.length || !target.reportValidity()) return false;
      
      // check for duplicates
      let collections = [ ...this.to, ...this.cc, ...this.bcc ];
      
      for (let recipient of collections) {
        if (recipient === target.value) {
          target.setCustomValidity(`Duplicate email '${recipient}'.`);
          return false;
        }
      }
      
      collection.push(target.value);
      target.value = '';
      target.focus();
      
      return true;
      
    },
    ClearInput: function(this: DataType) {
      
      this.$refs.to.value = '';
      this.$refs.cc.value = '';
      this.$refs.bcc.value = '';
      this.$refs.subject.value = '';
      this.$refs.content.value = '';
      this.to = [];
      this.cc = [];
      this.bcc = [];
      this.infoGeneral = null;
      this.warningEmailSubject = null;
      this.warningEmailContent = null;
      
    }
  },
  components: {
    'notification': Notification,
    'send-spinner': SendSpinner,
    'tooltip': Tooltip
  }
});
</script>

<style lang="scss" scoped>

.send-mail {
  width: calc(100% - 2em);
  text-align: left;
}

.sender {
  white-space: pre;
  padding:.3em;
}

.email-label {
  white-space: pre;
  display: inline-block;
  min-width: 3em;
}
.email-recipient {
  display: inline-block;
  -webkit-user-select: none;
  cursor: default;
  background-color:$color_back_2;
  border-radius:.5em;
  padding:.2em;
  margin:0 .3em;
  .email-name {
    display:inline-block;
    vertical-align: middle;
    padding:0 .3em;
  }
  .email-remove {
    display:inline-block;
    font-size:.5em;
    border-radius:2em;
    background-color:$color_2;
    border-color:lighten($color_2, 30%);
  }
}

.email-input {
  display:inline-block;
  margin:.2em;
  width:20em;
}

.subject {
  width: calc(100% - 1em);
}
.content {
  width: calc(100% - 1em);
  resize:vertical;
}
.action-button {
  display:inline-block;
}

.info {
  color: lighten($color_info, 35%);
  background-color: darken($color_info, 15%);
  border-color:$color_info;
}

.recipients-enter, .recipients-leave-to {
  opacity: 0;
}
.recipients-enter-active {
  transition: opacity .7s ease;
}
.recipients-leave-active {
  transition: opacity .6s ease;
  position: absolute;
}
.recipients-move {
  transition: transform .5s ease;
}


</style>


