import PageWrapper from '_c/page-wrapper.vue'
// import PanelIndex from '_c/panel-index.vue'
// import PanelInfo from '_c/panel-info.vue'
// import PanelLine from '_c/panel-line.vue'
import TreeTable from '_c/table-tree'
// import ELTreeTableColumn from '_c/table-tree-column'
import Tables from '_c/tables'
// import TotalItem from '_c/total-item.vue'
// import SearchOr from '_c/search-is-or.vue'
import Container from '_c/container.vue'
import UploadModel from '_c/upload/upload-model.vue'
import CountTo from '_c/count-to'
import TimeClock from '_c/time-clock'

function plugins(Vue) {
  if (plugins.installed) {
    return
  }

  Vue.component('container', Container)
  Vue.component('upload-model', UploadModel)
  Vue.component('page-wrapper', PageWrapper)
  // Vue.component('panel-index', PanelIndex)
  // Vue.component('panel-info', PanelInfo)
  // Vue.component('panel-line', PanelLine)
  // Vue.component('total-item', TotalItem)
  // Vue.component('search-or', SearchOr)
  Vue.component('time-clock', TimeClock)
  Vue.component('count-to', CountTo)
  Vue.component('TreeTable', TreeTable)
  // Vue.component('ELTreeTable', ELTreeTableColumn)
  Vue.component('Tables', Tables)
  // Vue.component('upload-drag', UploadDrag)
}

export default plugins
