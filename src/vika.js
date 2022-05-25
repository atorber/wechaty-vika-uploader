import { Vika } from '@vikadata/vika'
import moment from 'moment'
import { v4 } from 'uuid'
import rp from 'request-promise'

//定义一个延时方法
let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

class VikaBot {
  constructor(config) {
    if (!config.token && !process.env['VIKA_TOKEN']) {
      console.error('未配置token，请在config.ts中配置')
    } else if (!config.spaceName && !process.env['VIKA_SPACENAME']) {
      console.error('未配置空间名称，请在config.ts中配置')
    } else {
      this.token = config.token || process.env['VIKA_TOKEN']
      this.space = {
        name: config.spaceName || process.env['VIKA_SPACENAME'],
        id: '',
      }
      // {
      //   id: cuid(),
      //   listenerId: toId,
      //   roomId,
      //   talkerId,
      //   text,
      //   timestamp: Date.now(),
      //   toId,
      //   type,
      // }
      this.sheets = {
        Message: {
          name: 'Message',
          id: '',
          fields: [
            {
              "type": "SingleText",
              "name": "id",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "DateTime",
              "name": "timestamp",
              "property": {
                "dateFormat": 'YYYY-MM-DD',
                "timeFormat": "hh:mm"
              }
            },
            {
              "type": "SingleText",
              "name": "roomId",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "SingleText",
              "name": "topic",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "SingleText",
              "name": "talkerId",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "SingleText",
              "name": "name",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "Text",
              "name": "text"
            },
            {
              "type": "SingleText",
              "name": "listenerId",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "SingleText",
              "name": "toId",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "SingleText",
              "name": "type",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "Attachment",
              "name": "file"
            }
          ]
        },
        Room: {
          name: 'Room',
          id: '',
          fields: [
            {
              "type": "SingleText",
              "name": "id",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "SingleText",
              "name": "topic",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "SingleText",
              "name": "ownerId",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "Text",
              "name": "avatar"
            },
            {
              "type": "Text",
              "name": "adminIdList"
            },
            {
              "type": "Text",
              "name": "memberIdList"
            },
            {
              "type": "SingleText",
              "name": "external",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "Attachment",
              "name": "file"
            }
          ]
        },
        Contact: {
          name: 'Contact',
          id: '',
          fields: [
            {
              "type": "SingleText",
              "name": "id",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "SingleText",
              "name": "name",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "SingleText",
              "name": "alias",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "SingleText",
              "name": "gender",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "Checkbox",
              "name": "friend",
              "property": {
                "icon": 'white_check_mark'
              }
            },
            {
              "type": "SingleText",
              "name": "type",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "Text",
              "name": "avatar"
            },
            {
              "type": "SingleText",
              "name": "phone",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "Attachment",
              "name": "file"
            }
          ]
        },
        Event: {
          name: 'Event',
          id: '',
          fields: [
            {
              "type": "SingleText",
              "name": "id",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "SingleText",
              "name": "name",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "Text",
              "name": "text"
            }
          ]
        },
        Wechaty: {
          name: 'Wechaty',
          id: '',
          fields: [
            {
              "type": "SingleText",
              "name": "id",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "Text",
              "name": "userSelf"
            },
            {
              "type": "DateTime",
              "name": "timestamp",
              "property": {
                "dateFormat": 'YYYY-MM-DD',
                "timeFormat": "hh:mm"
              }
            },
            {
              "type": "Checkbox",
              "name": "startState",
              "property": {
                "icon": 'white_check_mark'
              }
            },
            {
              "type": "Checkbox",
              "name": "loginState",
              "property": {
                "icon": 'white_check_mark'
              }
            },
            {
              "type": "Text",
              "name": "profile"
            },
            {
              "type": "SingleText",
              "name": "puppet",
              "property": {
                "defaultValue": ''
              }
            },
            {
              "type": "Text",
              "name": "puppetOptions"
            },
            {
              "type": "SingleText",
              "name": "ioToken",
              "property": {
                "defaultValue": ''
              }
            }
          ]
        }
      }
      this.vika = new Vika({ token: this.token })
      this.spaceId = ''
      this.datasheetId = ''
      this.checkInit()
    }
  }


  async getAllSpaces() {
    // 获取当前用户的空间站列表
    const spaceListResp = await this.vika.spaces.list()
    if (spaceListResp.success) {
      console.table(spaceListResp.data.spaces)
      return spaceListResp.data.spaces
    } else {
      console.error(spaceListResp)
      return spaceListResp
    }
  }

  async getSpaceId() {
    let spaceList = await this.getAllSpaces()
    for (let i in spaceList) {
      if (spaceList[i].name === this.space.name) {
        this.space.id = spaceList[i].id
        break
      }
    }
    if (this.space.id) {
      return this.space.id
    } else {
      return null
    }
  }

  async getNodesList() {
    // 获取指定空间站的一级文件目录
    const nodeListResp = await this.vika.nodes.list({ spaceId: this.space.id })
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

  async createSheet(spaceId, name, fields) {
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
      uri: `https://api.vika.cn/fusion/v1/spaces/${spaceId}/datasheets`,
      body,
      headers,
      json: true // Automatically stringifies the body to JSON
    };

    var parsedBody = await rp(options)
    // console.debug(parsedBody)
    if (parsedBody.success) {
      return parsedBody.data
    } else {
      return parsedBody
    }
  }

  async addChatRecord(msg, uploaded_attachments, msg_type, text) {
    // console.debug(msg)
    // console.debug(JSON.stringify(msg))
    const talker = msg.talker()
    // console.debug(talker)
    const to = msg.to()
    const type = msg.type()
    text = text || msg.text()
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
      text = JSON.stringify(uploaded_attachments)
    }

    let records = [
      {
        fields: {
          id: ID,
          timestamp: curTime,
          name: talker ? talker.name() : '未知',
          topic: topic || '--',
          text: text,
          talkerId: talker.id != 'null' ? talker.id : '--',
          roomId: room && room.id ? room.id : '--',
          type: msg_type,
          listenerId: '',
          toId: '',
          file: files
        },
      },
    ]

    // let records = [
    //   {
    //     fields: {
    //       id: ID,
    //       timeHms: timeHms,
    //       name: talker ? talker.name() : '未知',
    //       topic: topic || '--',
    //       text: text,
    //       wxid: talker.id != 'null' ? talker.id : '--',
    //       roomid: room && room.id ? room.id : '--',
    //       messageType: msg_type,
    //       files: files
    //     },
    //   },
    // ]

    // console.table(records[0].fields)
    const datasheet = this.vika.datasheet(this.sheets.Message.id)
    datasheet.records.create(records).then((response) => {
      if (response.success) {
        console.log('写入vika成功：', response.code)
      } else {
        console.error('调用vika写入接口成功，写入vika失败：', response)
      }
    }).catch(err => { console.error('调用vika写入接口失败：', err) })
  }

  async createRecords(datasheetId, records, count = 0) {
    const datasheet = this.vika.datasheet(datasheetId)
    datasheet.records.create(records).then(async (response) => {
      if (response.success) {
        console.log('写入vika成功：', response.code)
      } else {
        console.error('调用vika写入接口成功，写入vika失败：', response)
        count = count + 1
        if (count < 2) {
          await this.createRecords(datasheetId, records, count)
        }
      }
    }).catch(async err => {
      console.error('调用vika写入接口失败：', err)
      count = count + 1
      if (count < 2) {
        await this.createRecords(datasheetId, records, count)
      }
    })
  }

  async upload(file) {
    const datasheet = this.vika.datasheet(this.sheets.Message.id);
    try {
      const resp = await datasheet.upload(file)
      if (resp.success) {
        const uploaded_attachments = resp.data
        console.debug('上传成功', uploaded_attachments)
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

  async checkAndsetSheets(spaceId) {
    try {
      let tables = await this.getNodesList(spaceId) || []
      console.table(tables)

      Object.keys(this.sheets).forEach(async sheetName => {
        console.debug(sheetName)
        // console.debug(tables[sheetName])
        if (tables[sheetName]) {
          this.sheets[sheetName].id = tables[sheetName]
          console.debug(sheetName + '表存在:', this.sheets[sheetName].id, '初始化完成')

        } else {
          console.debug(sheetName + '表不存在:自动创建...')
          let sheetId = await this.createSheet(spaceId, sheetName, this.sheets[sheetName].fields)
          this.sheets[sheetName].id = sheetId.id || ''
          await wait(500)
        }
      })

      return {
        code: 200
      }
    } catch (e) {
      console.error('checkAndsetSheets', e)
      return e
    }

  }

  async checkInit() {
    const spaceId = await this.getSpaceId()
    console.debug(`空间ID${this.space.name}:`, spaceId)
    if (spaceId) {
      this.space.id = spaceId
      const res = await this.checkAndsetSheets(spaceId)

      if (res.code == 200) {
        console.error('表格初始化完成...')
        return true
      } else {
        console.error('表格初始化失败，请重试')
        return res
      }

    }
    console.error('指定空间不存在，请先创建空间')
    return false
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
