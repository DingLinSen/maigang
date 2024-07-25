import { defineStore } from 'pinia'
import { store } from '../index'

export const webSocketStore = defineStore('webSocket', {
  state: (): any => ({
    webSocketData: []
  }),
  getters: {
    getWebSocketData(): any {
      return this.webSocketData
    }
  },
  actions: {
    setwebSocketData(state: any): void {
      this.webSocketData = state
    }
  }
})

export const useWebSocketStore = () => {
  return webSocketStore(store)
}
