import { reactive, ref, onMounted, onDeactivated, onActivated } from 'vue'
import { debounce } from '@/utils'

export default function () {
  let $_sidebarElm = reactive(null)
  const $_resizeHandler = reactive(null)
  const $_initResizeEvent = () => {
    window.addEventListener('resize', this.$_resizeHandler)
  }
  const $_destroyResizeEvent = () => {
    window.removeEventListener('resize', this.$_resizeHandler)
  }
  const $_sidebarResizeHandler = (e) => {
    if (e.propertyName === 'width') {
      this.$_resizeHandler()
    }
  }
  const $_initSidebarResizeEvent = () => {
    $_sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    $_sidebarElm && this.$_sidebarElm.addEventListener('transitionend', this.$_sidebarResizeHandler)
  }
  const $_destroySidebarResizeEvent = () => {
    this.$_sidebarElm && this.$_sidebarElm.removeEventListener('transitionend', this.$_sidebarResizeHandler)
  }
  const Mounted = onMounted(() => {
    console.log(11111)
    $_resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    $_initResizeEvent()
    $_initSidebarResizeEvent()
  })
  onDeactivated(() => {
    $_initResizeEvent()
    $_initSidebarResizeEvent()
  })
  onActivated(() => {
    $_initResizeEvent()
    $_initSidebarResizeEvent()
  })
  return {
    $_resizeHandler,
    $_sidebarElm,
    $_initResizeEvent,
    $_destroyResizeEvent,
    $_sidebarResizeHandler,
    $_destroySidebarResizeEvent

  }
}
