import { addVikaConfig } from './common/configDb.js'
import onMessage from './handlers/on-message.js'

function WechatyVikaPlugin(config = { token, reportList }) {
  const initConfig = {
    token: config.token,
    reportList: config.reportList || [],
  }
  addVikaConfig(initConfig)
  return function (bot) {
    bot.on('message', onMessage)
  }
}

export { WechatyVikaPlugin }

export default WechatyVikaPlugin
