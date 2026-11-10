import { computed } from 'vue';

export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary' // 'primary' | 'outline' | 'danger'
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const buttonClass = computed(() => {
      const classes = ['cyber-action-btn'];
      if (props.variant === 'outline') classes.push('btn-outline');
      if (props.variant === 'danger') classes.push('btn-danger-outline');
      return classes.join(' ');
    });

    function handleClick(event) {
      if (!props.disabled) {
        emit('click', event);
      }
    }

    return {
      buttonClass,
      handleClick
    };
  },
  template: /* html */ `
    <button
      :type="type"
      :class="buttonClass"
      :disabled="disabled"
      @click="handleClick"
    >
      <slot />
    </button>
  `
};
