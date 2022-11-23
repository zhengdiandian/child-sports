<template>
  <component

    :is="tag"
    :type="type"
    :disabled="disableButton"
    :class="[btnClass, colorVariants, {loading}]"
    :variant="variant"
    :variant-type="variantType"
    :size="size"
    :href="to"
    v-on="$listeners"
  >
    <slot />
    <span class="spinner">
      <span />
      <span />
      <span />
      <span />
    </span>
  </component>
</template>

<script>
export default {
  name: 'LoadingButton',
  props: {
    tag: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      default: 'primary'
    },
    variantType: {
      type: String,
      default: 'normal'
    },
    size: {
      type: String,
      default: 'normal'
    },
    rounded: {
      type: String,
      default: 'medium'
    },
    type: {
      type: String,
      default: ''
    },
    to: {
      type: String
    }
  },
  data () {
    return {
      loading: false,
      disableButton: this.disabled
    }
  },

  computed: {
    btnClass () {
      return {
        'base-spinner': this.loading == true,
        'cursor-not-allowed': this.disableButton == true,
        'base-button inline-flex align-middle align-items-center justify-center font-medium focus:outline-none border-2': true,

        'rounded-sm': this.rounded === 'medium',
        'rounded-full': this.rounded === 'large',

        'px-6 py-3': this.size == 'normal',
        'px-4 py-2': this.size == 'small'
      }
    },

    colorVariants () {
      switch (this.variant) {
        case 'primary':
          switch (this.variantType) {
            case 'normal':
              switch (this.disableButton) {
                case true:
                  return 'border-blue-300 bg-blue-300 text-white'
                  break
                default:
                  break
              }
              return 'border-blue-600 bg-blue-600 hover:bg-blue-700 hover:border-blue-700 text-white'
              break
            case 'outline':
              return 'border-gray-200 text-blue-500 hover:text-blue-700'
              break
            default:
              break
          }
          break
        case 'danger':
          switch (this.variantType) {
            case 'normal':
              switch (this.disableButton) {
                case true:
                  return 'border-red-300 bg-red-300 text-white'
                  break
                default:
                  break
              }
              return 'border-red-600 bg-red-600 hover:bg-red-700 hover:border-red-700 text-white'
              break
            case 'outline':
              return 'border-gray-200 text-red-500 hover:text-red-600'
              break
            default:
              break
          }
          break

        case 'warning':
          switch (this.variantType) {
            case 'normal':
              return 'border-orange-600 bg-orange-600 hover:bg-orange-700 hover:border-orange-700 text-white'
              break
            default:
              break
          }
          break

        case 'success':
          switch (this.variantType) {
            case 'normal':
              switch (this.disableButton) {
                case true:
                  return 'border-green-300 bg-green-300 text-white'
                  break
                default:
                  break
              }
              return 'border-green-600 bg-green-600 hover:bg-green-700 hover:border-green-700 text-white'
              break
            case 'outline':
              return 'border-2 border-gray-200 text-green-500 hover:text-green-700'
              break
            default:
              break
          }
          break

        case 'white':
          switch (this.variantType) {
            case 'normal':
              return 'border-white bg-white text-blue-600 hover:text-blue-800'
              break
            default:
              break
          }
          break

        case 'secondary':
          switch (this.variantType) {
            case 'outline':
              return 'border-gray-300 text-gray-500 hover:text-blue-500'
              break
            default:
              break
          }
          break

        default:
          break
      }
    }
  },

  methods: {
    startLoading () {
      this.loading = true
      this.disableButton = true
    },
    stopLoading () {
      this.loading = false
      this.disableButton = false
    }
  }
}
</script>
<style>
.spinner {
  line-height: 1.15;
  position: relative;
  /*top: 50%;*/
  /*transform: translateY(-50%);*/
  left: 1.5rem;
  /*right: .7rem;*/
  /*margin: -0.5em;*/
  opacity: 0;
  transition-property: padding, opacity;
  transition-duration: 0.2s, 0.2s;
  transition-timing-function: ease-in, ease;
  transition-delay: 0s, 0.2s;
}
.spinner span {
  box-sizing: border-box;
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0;
  width: 1rem;
  height: 1rem;
  opacity: 1;
  border: 3.4px solid #888;
  border-radius: 50%;
  animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #888 transparent transparent transparent;
}
.spinner span:nth-child(1) {
  animation-delay: 0.45s;
}
.spinner span:nth-child(2) {
  animation-delay: 0.3s;
}
.spinner span:nth-child(3) {
  animation-delay: 0.15s;
}
.loading {
  padding-right: 3rem !important;
}
.loading .spinner {
  opacity: 1;
}
.loading .spinner span {
  opacity: 1;
}
button:not(:disabled) {
  transition-delay: 0.2s;
}
button:not(:disabled) .spinner span {
  box-shadow: 0 0 0 0.2rem #888 inset;
  border: 7.4px solid transparent;
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
}
button:not(:disabled) .spinner span:nth-child(1) {
  transform: rotate(0deg) !important;
}
button:not(:disabled) .spinner span:nth-child(2) {
  transform: rotate(90deg) !important;
}
button:not(:disabled) .spinner span:nth-child(3) {
  transform: rotate(180deg) !important;
}
button:not(:disabled) .spinner span:nth-child(4) {
  transform: rotate(270deg) !important;
}
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
/* optional styles */
.default-styles {
  color: white;
  background-color: blue;
  border: solid 1px transparent;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16.5px 8px 16px;
  line-height: 1.9rem;
}
.default-styles:disabled {
  pointer-events: stroke;
  cursor: not-allowed;
}
.default-styles:focus {
  outline: none;
  box-shadow: 0 0 0 3px lightblue, 0 0 0 1.5px lightblue;
}
.default-styles .spinner span {
  top: 0rem;
  width: 1.2rem;
  height: 1.2rem;
  border: 3.4px solid #fff;
  border-color: #fff transparent transparent transparent;
}
.default-styles:not(:disabled) .spinner span {
  border: 8.4px solid transparent;
  box-shadow: 0 0 0 0.1rem #fff inset;
}
</style>
