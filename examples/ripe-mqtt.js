/*
export WECHATY_PUPPET=wechaty-puppet-service
export WECHATY_PUPPET_SERVICE_TOKEN="你的wechaty-token"
export VIKA_TOKEN="你的vika-token"
export VIKA_DATASHEETNAME="dstsL6DH8BxYP4Fbl4"
export MQTT_USERNAME="你的百度物联网核心套件MQTT用户名"
export MQTT_PASSWORD="你的百度物联网核心套件MQTT密码"
export BOTID="你的botID,可以与设备名称一致"
npm run ripe-mqtt
*/

import { Wechaty, ScanStatus, log } from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
// import 'dotenv/config.js'

import WechatyVikaPlugin from 'wechaty-vika-link'

import { ChatDevice } from 'wechaty-mqtt-link'

const bot = new Wechaty()

const chatdev = new ChatDevice(process.env['MQTT_USERNAME'], process.env['MQTT_PASSWORD'], process.env['BOTID'])

async function onMessage(msg) {
    log.info('StarterBot', msg.toString())
    // console.debug(msg)
    chatdev.pub_message(msg)
    if (msg.text() == 'ding') {
        msg.say('dong')
    }
}

bot
  .use(
    WechatyVikaPlugin()
  )
  .on('scan', (qrcode, status) => {
    if (status === ScanStatus.Waiting) {
      qrcodeTerminal.generate(qrcode, {
        small: true
      })
    }
  })
  .on('login', async user => {
    console.log(`user: ${JSON.stringify(user)}`)
    chatdev.init(bot)
  })
  .on('message', onMessage)

bot.start().catch((e) => console.error(e))