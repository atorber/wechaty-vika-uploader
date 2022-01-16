const { addVikaConfig } = require('./common/configDb')
const onMessage = require('./handlers/on-message')

module.exports = function WechatyVikaPlugin(config = { token, reportList }) {
  const initConfig = {
    token: config.token,
    reportList: config.reportList || [],
  }
  addVikaConfig(initConfig)
  return function (bot) {
    bot.on('message', onMessage)
  }
}
