import { Vika } from '@vikadata/vika'
import moment from 'moment'
import { v4 } from 'uuid'
import fs from 'fs'
import stream from 'stream'
//定义一个延时方法
let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

class VikaBot {
  constructor() {
    this.vika = new Vika({ token: process.env['VIKA_TOKEN'] })
    this.datasheetId = process.env['VIKA_DATASHEETID']
  }

  async addChatRecord(msg, uploaded_attachments, msg_type) {
    // console.debug(JSON.stringify(msg))
    const talker = msg.talker()
    // console.debug(talker)
    const to = msg.to()
    const type = msg.type()
    let text = msg_type == 'Text' ? msg.text() : msg_type
    let room = msg.room() || {}
    let topic = ''
    if (room) {
      topic = await room.topic()
    }
    let curTime = this.getCurTime()
    let reqId = v4()
    let ID = msg.id
    // let msg_type = msg.type()
    let timeHms = moment(curTime).format('YYYY-MM-DD HH:mm:ss')
    let files = []
    if (uploaded_attachments) {
      files.push(uploaded_attachments)
    }
    let records = [
      {
        fields: {
          ID: ID,
          时间: timeHms,
          来自: talker.name(),
          接收: topic || '单聊',
          内容: text,
          发送者ID: talker.id != 'null' ? talker.id : '--',
          接收方ID: room.id ? room.id : '--',
          消息类型: msg_type,
          附件: files,
        },
      },
    ]
    console.debug(records)
    const datasheet = this.vika.datasheet(this.datasheetId)
    datasheet.records.create(records).then((response) => {
      if (response.success) {
        console.log(response.code)
      } else {
        console.error(response)
      }
    }).catch(err => { console.error(err) })
  }

  async upload(file_payload) {
    const datasheet = this.vika.datasheet(this.datasheetId);
    // node 环境中
    let ws = fs.createWriteStream(file_payload.cloudPath)
    ws.write(file_payload.fileContent)
    ws.end()

    await wait(500)

    const file = fs.createReadStream(file_payload.cloudPath)

    try {
      const resp = await datasheet.upload(file)
      if (resp.success) {
        const uploaded_attachments = resp.data
        console.debug(uploaded_attachments)
        // await vika.datasheet('dstWUHwzTHd2YQaXEE').records.create([{
        //   'title': '标题 A',
        //   'photos': [uploaded_attachments]
        // }])
        fs.unlink(file_payload.cloudPath, function (error) {
          if (error) {
            console.debug(error)
          }
          console.debug('文件删除成功', file_payload.cloudPath)
        })
        return uploaded_attachments
      }
    } catch (error) {
      // console.error(error.message)
    }
  }

  getCurTime() {
    //timestamp是整数，否则要parseInt转换
    let timestamp = new Date().getTime()
    var timezone = 8 //目标时区时间，东八区
    var offset_GMT = new Date().getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
    var time = timestamp + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
    return time
  }
}

export { VikaBot }

export default VikaBot
