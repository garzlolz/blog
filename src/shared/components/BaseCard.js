export default {
  name: 'BaseCard',
  props: {
    hoverable: {
      type: Boolean,
      default: false
    }
  },
  template: /* html */ `
    <div :class="['cyber-card', { 'cyber-card-hover': hoverable }]">
      <slot />
    </div>
  `
};
