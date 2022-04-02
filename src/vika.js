import { Vika } from '@vikadata/vika'
import moment from 'moment'
import { v4 } from 'uuid'
import rp from 'request-promise'

//定义一个延时方法
let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

class VikaBot {
  constructor() {
    this.vika = new Vika({ token: process.env['VIKA_TOKEN'] })
    this.spaceId = ''
    this.datasheetId = ''
    this.token = process.env['VIKA_TOKEN']
    this.checkInit()
  }

  async getAllSpaces() {
    // 获取当前用户的空间站列表
    const spaceListResp = await this.vika.spaces.list()
    if (spaceListResp.success) {
      console.log(spaceListResp.data.spaces)
      return spaceListResp.data.spaces
    } else {
      console.error(spaceListResp)
      return spaceListResp
    }
  }

  async getSpaceId() {
    let spaceList = await this.getAllSpaces()
    for (let i in spaceList) {
      if (spaceList[i].name === 'mp-chatbot') {
        this.spaceId = spaceList[i].id
      }
    }
    return this.spaceId
  }

  async getNodesList() {
    // 获取指定空间站的一级文件目录
    const nodeListResp = await this.vika.nodes.list({ spaceId: this.spaceId })
    let tables = {}
    if (nodeListResp.success) {
      // console.log(nodeListResp.data.nodes);
      const nodes = nodeListResp.data.nodes
      nodes.forEach((node) => {
        // 当节点是文件夹时，可以执行下列代码获取文件夹下的文件信息
        if (node.type === 'Datasheet') {
          tables[node.name] = node.id
        }
      })
    } else {
      console.error(nodeListResp)
    }
    return tables
  }

  async addDataSheet(name, fields) {
    /*
    {
          "name": "我的表格",
          "description": "创建自wechaty-vika-link",
          "folderId": "",
          "preNodeId": "",
          "fields": [
            {
              "type": "Text",
              "name": "标题"
            }
          ]
        }
    */
    var body = {
      "name": name,
      "description": "创建自wechaty-vika-link",
      "folderId": "",
      "preNodeId": "",
      "fields": fields
    }
    var headers = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json"
    }
    var options = {
      method: 'POST',
      uri: `https://api.vika.cn/fusion/v1/spaces/${this.spaceId}/datasheets`,
      body,
      headers,
      json: true // Automatically stringifies the body to JSON
    };

    var parsedBody = await rp(options)
    // console.debug(parsedBody)
    if (parsedBody.success) {
      this.datasheetId = parsedBody.data.id
    } else {
      console.debug(parsedBody)
    }
  }

  async addChatRecord(msg, uploaded_attachments, msg_type) {
    // console.debug(JSON.stringify(msg))
    const talker = msg.talker()
    // console.debug(talker)
    const to = msg.to()
    const type = msg.type()
    let text = msg.text()
    let room = msg.room()
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
          来自: talker ? talker.name() : '未知',
          接收: topic || '单聊',
          内容: text,
          发送者ID: talker.id != 'null' ? talker.id : '--',
          接收方ID: room && room.id ? room.id : '--',
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

  async upload(file) {
    const datasheet = this.vika.datasheet(this.datasheetId);
    try {
      const resp = await datasheet.upload(file)
      if (resp.success) {
        const uploaded_attachments = resp.data
        console.debug(uploaded_attachments)
        // await vika.datasheet('dstWUHwzTHd2YQaXEE').records.create([{
        //   'title': '标题 A',
        //   'photos': [uploaded_attachments]
        // }])
        return uploaded_attachments
      }
    } catch (error) {
      // console.error(error.message)
    }
  }

  async checkInit() {
    this.spaceId = await this.getSpaceId()
    console.debug('mp-chatbot空间ID:', this.spaceId)

    if (this.spaceId) {
      let tables = await this.getNodesList()
      console.debug('空间内所有表:', tables)

      if (tables.ChatRecord) {
        this.datasheetId = tables.ChatRecord
        console.debug('ChatRecord表存在:', this.datasheetId)
      } else {
        console.debug('缺失ChatRecord表,自动创建')
        let name = 'ChatRecord'
        let fields = [
          {
            "type": "SingleText",
            "name": "ID",
            "property": {
              "defaultValue": ''
            }
          },
          {
            "type": "SingleText",
            "name": "时间",
            "property": {
              "defaultValue": ''
            }
          },
          {
            "type": "SingleText",
            "name": "来自",
            "property": {
              "defaultValue": ''
            }
          },
          {
            "type": "SingleText",
            "name": "接收",
            "property": {
              "defaultValue": ''
            }
          },
          {
            "type": "Text",
            "name": "内容"
          },
          {
            "type": "SingleText",
            "name": "发送者ID",
            "property": {
              "defaultValue": ''
            }
          },
          {
            "type": "SingleText",
            "name": "接收者ID",
            "property": {
              "defaultValue": ''
            }
          },
          {
            "type": "SingleText",
            "name": "消息类型",
            "property": {
              "defaultValue": ''
            }
          },
          {
            "type": "Attachment",
            "name": "附件"
          }
        ]
        await this.addDataSheet(name, fields)
        await wait(200)
        await this.checkInit()
      }

    } else {
      console.debug('mp-chatbot空间不存在')
    }

    return {
      spaceId: this.spaceId,
      datasheetId: this.datasheetId
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