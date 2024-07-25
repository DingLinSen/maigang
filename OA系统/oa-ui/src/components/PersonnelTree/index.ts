import PersonnelTree from './src/Tree.vue'
import { ElTree } from 'element-plus'
// import { TableSetPropsType } from '@/types/table'

export interface TableExpose {
  setProps: (props: Recordable) => void
  // setColumn: (columnProps: TableSetPropsType[]) => void
  selections: Recordable[]
  elTableRef: ComponentRef<typeof ElTree>
}

export { PersonnelTree }
