import Config from 'react-native-config'
import {
  authorizationSignInRequest,
  connKeepAliveRequest,
  websocketClose,
  websocketConnect,
  websocketOpen
} from 'hg/actions'
import { getCurrentTimestamp } from 'hg/utils'

const KEEP_ALIVE_REQUEST_INTERVAL = 30000
const RECONNECT_INTERVAL = 1000

let instance
let keepAliveIntervalId

export default () => {
  return {
    connect: (dispatch, countryCode, phoneNumber, verificationCode) => {
      instance = websocket(dispatch, countryCode, phoneNumber, verificationCode)
    },

    sendAction: (action) => {
      try {
        instance.send(JSON.stringify(action))
      }
      catch (err) {
        console.log('__WEBSOCKET__ send action error')
        console.log(err)
      }
    }
  }
}

const websocket = (dispatch, countryCode, phoneNumber, verificationCode) => {
  const ws = new WebSocket(Config.API_HOST)

  ws.onopen = () => {
    dispatch(websocketOpen(Config.API_HOST))
    const canSignIn = countryCode && phoneNumber && verificationCode

    if (canSignIn) {
      const actionId = getCurrentTimestamp()
      action = authorizationSignInRequest(actionId, countryCode, phoneNumber, verificationCode)
      instance.send(JSON.stringify(action))
    }

    keepAliveIntervalId = setInterval(() => {
      const actionId = getCurrentTimestamp()
      instance.send(JSON.stringify(connKeepAliveRequest(actionId)))
    }, KEEP_ALIVE_REQUEST_INTERVAL)
  }

  ws.onmessage = (event) => {
    const { data } = event
    let action

    try {
      action = JSON.parse(data)
    }
    catch (err) {
      if (__DEV__) {
        console.log('__WEBSOCKET__ action parse error')
        console.log(err)
      }

      return
    }

    dispatch(action)
  }

  ws.onclose = () => {
    instance = null
    clearInterval(keepAliveIntervalId)
    dispatch(websocketClose())
    setTimeout(() => {
      dispatch(websocketConnect())
    }, RECONNECT_INTERVAL)
  }

  return ws
}
