<template>
  <div class="notification">
    <transition name="fade">
      <div v-if="show" class="notification-container">{{ text }}</div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export interface DataType {
  
  /** Flag indicating the notification should be showing. */
  show: boolean;
  /** Text content of the notification. */
  text: string;
  
  /** Timer reference. */
  timer: any;
  
  /** Method to show the notification with the specified text. */
  Show(text: string): void;
  
}

export default Vue.extend({
  data() {
    return {
      show: false,
      text: ''
    };
  },
  methods: {
    Show: function(this: DataType, text: string): void {
      // clear previous
      if (this.timer) clearTimeout(this.timer);
      this.text = text;
      this.show = true;
      let self = this;
      this.timer = setTimeout(() => {
        self.show = false;
        self.timer = undefined;
      }, 1000 * 2);
    }
  }
});
</script>

<style lang="scss" scoped>

.notification {
  vertical-align:middle;
  text-align:center;
  >.notification-container {
    z-index:9;
    font-size:1.3em;
    padding:.5em;
    max-width:90%;
    position: absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    border:1px solid $color_2;
    border-radius:.2em;
    background-color:$color_back_2;
    color:$color_text_2;
  }
}

</style>

