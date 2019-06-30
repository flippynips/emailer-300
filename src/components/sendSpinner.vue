<template>
  <transition name="fade" appear>
    <div class="sending-overlay">
      <div class="sending-icon">⛬</div>
      <div class="sending-text">Sending...</div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  
});
</script>

<style lang="scss" scoped>

.sending-overlay {
  position:fixed;
  top:0;
  right:0;
  bottom:0;
  left:0;
  z-index:1000;
  background-color:rgba(255, 255, 255, 0.377);
  padding: 48vh 0 0 42vw;
  >.sending-icon {
    animation:spin 1s infinite linear;
    display:inline-block;
  }
  >.sending-text {
    display:inline-block;
    font-size:1.3em;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

</style>

