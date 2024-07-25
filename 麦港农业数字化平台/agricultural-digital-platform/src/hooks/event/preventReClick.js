export default (app) => {
  app.directive('preventReClick', {
    mounted(el, binidng) {
      el.addEventListener('click', () => {
        if (!el.disabled) {
          el.disabled = true
          setTimeout(() => {
            el.disabled = false
          }, binidng.value || 1000)
        }
      })
    }
  })
}
