import adb from '../lib/nedb.js'
import { VikaBot } from '../vika.js'

async function addVikaConfig(info) {
  let vika = new VikaBot(info.token)
  let vikaConfig = await vika.checkInit()
  console.debug(vikaConfig)
  info.vikaConfig = vikaConfig
  try {
    let doc = await adb('data/config.db').insert(info)
    return doc
  } catch (error) {
    console.log('插入数据错误', error)
  }
}

async function getVikaConfig() {
  try {
    let search = await adb('data/config.db').find({})
    return search[0]
  } catch (error) {
    console.log('查询数据错误', error)
  }
}
export { addVikaConfig, getVikaConfig }

export default addVikaConfig
