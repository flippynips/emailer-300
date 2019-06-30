<template>
  <transition name="fade" appear>
    <div class="tooltip" v-if="p_text">
      <p class="tooltip-text" >{{ p_text }}</p>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    p_text: { type: String, default: null }
  }
});
</script>

<style lang="scss" scoped>

.tooltip {
  position: relative;
  >.tooltip-text {
    position: absolute;
    margin-top:.3em;
    padding:.4em;
    color: lighten($color_info, 35%);
    background-color: darken($color_info, 15%);
    border-radius: .5em;
    border-bottom: 1px solid $color_info;
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      width: 0;
      height: 0;
      border: .8em solid transparent;
      border-bottom-color:darken($color_info, 15%);
      border-top: 0;
      margin-left: -.8em;
      margin-top: -.8em;
    }
  }
}

</style>


