const { getVikaConfig } = require('../common/configDb')
const { VikaBot } = require('../vika')

async function onMessage(msg) {
  try {
    const config = await getVikaConfig()
    const { token, reportList } = config
    // 维格表相关配置
    let vika = new VikaBot(token)

    // console.debug(message)
    let room = message.room() || {}

    if (!room.id || (reportList.length && reportList.indexOf(room.id) != -1) || reportList.length == 0) {
      vika.addChatRecord(message)
    }
  } catch (e) {
    console.log('监听消息失败', e)
  }
}

module.exports = onMessage
