import { defineStore } from 'pinia'
import { store } from '../index'

export const toMessageStore = defineStore('toMessage', {
  state: (): any => ({
    messageType: null
  }),
  getters: {
    getToMessageData(): any {
      return this.messageType
    }
  },
  actions: {
    setToMessageData(state: any): void {
      this.messageType = state
    }
  }
})

export const useToMessageStore = () => {
  return toMessageStore(store)
}
