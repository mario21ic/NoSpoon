import store from './index';

function WS () {
  this.autoReconnectInterval = 5000;
  this.subscriptions = {};
  this.onMessage = (msg) => {
    try {
      const parsedMsg = JSON.parse(msg.data);
      if (this.subscriptions[parsedMsg.type]) {
        this.subscriptions[parsedMsg.type].forEach((el) => { el(parsedMsg); })
      }
    } catch (e) {
      console.error(e);
    }
  }
  this.onClose = (msg) => {
    this.ws = null;
    this.reconnect()
    console.info('closed', msg);
  }

  this.reconnect = () => {
    this.setTimeout = setTimeout(() => {
      console.log('Reconnecting WebSocketClient');
      if (!this.ws) {
        this.connect();
      }
    }, this.autoReconnectInterval);
  }
  this.onOpen = (msg, ws) => {
    if (this.setTimeout) {
      this.setTimeout = null;
    }
    this.ws = ws
    console.info('socket Opened', msg);
  }
  this.connect();
}

WS.prototype.onError = function onError(msg) {
  console.error('error', msg, this);
}


// WS.prototype.onMessage = function onMessage(msg) {
//   try {
//     const parsedMsg = JSON.parse(msg.data)
//     console.log(parsedMsg)
//     if (this.subscriptions[parsedMsg.type]) {
//       this.subscriptions[parsedMsg.type].forEach((el) => { el(msg); })
//     }
//   } catch (e) {
//     console.error(e);
//   }
// }

WS.prototype.connect = function connect(url) {
  this.url = url || 'ws://localhost:3001';
  const ws = new WebSocket(this.url);
  ws.addEventListener('error', this.onError);
  ws.addEventListener('close', this.onClose);
  ws.addEventListener('open', msg => this.onOpen(msg, ws));
  ws.addEventListener('message', this.onMessage)
}

WS.prototype.subscribe = function subscribe(msgType, callback) {
  if (!this.subscriptions[msgType]) {
    this.subscriptions[msgType] = new Set();
  }
  this.subscriptions[msgType].add(callback);
}

WS.prototype.unSubscribe = function unSubscribe(msgType, callback) {
  if (this.subscriptions[msgType]) {
    return this.subscriptions[msgType].delete(callback);
  }
  return false;
}

WS.prototype.send = function send(msg) {
  if (!msg.type) {
    throw new Error('Message object withouth type');
  }
  if (!msg.user.id) {
    throw new Error('Message object withouth user ID');
  }
  if (this.ws) {
    this.ws.send(JSON.stringify(msg));
  }
}


// export enum MessageTypes {
//   createBullet = 'createBullet',
//   identifyUser = 'identifyUser',
//   bulletPosition = 'bulletPosition',
//   userPosition = 'userPosition,
// }

// export interface INoSpoonMessage {
//   type: MessageTypes;
//   user: {
//     id: string,
//     type: UserTypes;
//   };
// }
const ws = new WS();
export default ws;