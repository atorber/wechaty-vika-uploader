import { getVikaConfig } from '../common/configDb.js'
import { VikaBot } from '../vika.js'

async function onMessage(message) {
  // console.debug(message)
  try {
    const config = await getVikaConfig()
    // console.debug(config)
    const { token, reportList, vikaConfig } = config
    // 维格表相关配置
    let vika = new VikaBot(token)

    // console.debug(message)
    let room = message.room()

    if (!room || (reportList.length && reportList.indexOf(room.id) != -1) || reportList.length == 0) {
      vika.addChatRecord(message, vikaConfig.sysTables.ChatRecord)
    }
  } catch (e) {
    console.log('监听消息失败', e)
  }
}

export { onMessage }

export default onMessage
