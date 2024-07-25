// import store from '@/store'

let websocket = {}
let socket = null

websocket.openSocket = function(url, _this) {
  if(socket !== null) {
    socket.close()
    socket = null
  }
  url = url.replace('https', 'wss').replace('http', 'ws')
  socket = new WebSocket(url)
  socket.onopen = () => {
    console.log('打开websocket')
  }
  socket.onclose = () => {
    console.log('关闭websocket')
  }
  // 接收消息
  socket.onmessage = (message) => {
    if(message.data.indexOf('{') > -1 && message.data.indexOf('}') > -1) {
      // 1 认证 2 考试 3 拍照 4评判试卷 5 发布成绩  6下线
      let msg = JSON.parse(message.data)
      _this.$store.commit('user/setWebsocketFlag', msg)
      // if(msg.type === '1') {
      //   _this.Bus.$emit('certification', msg)
      // }else if(msg.type === 'test') {
      //   _this.Bus.$emit('2', msg)
      // }else if(msg.type === '3') {
      //   _this.Bus.$emit('photo', msg)
      // }else if(msg.type === '4') {
      //   _this.Bus.$emit('judge', msg)
      // }else if(msg.type === '5') {
      //   _this.Bus.$emit('release', msg)
      // }else if(msg.type === '6') {
      //   _this.Bus.$emit('offline', msg)
      // }
    }
  }
}
// 关闭链接
websocket.closeSocket = function() {
  console.log(socket)
  if(socket !== null) {
    socket.close()
    socket = null
  }
}
// 发送消息
websocket.sendMessage = function(msg) {
  socket.send(msg)
}

export default websocket
