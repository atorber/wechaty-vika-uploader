import { Wechaty, ScanStatus, log } from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
// import 'dotenv/config.js'

import WechatyVikaPlugin from '../src/index.js'

const bot = new Wechaty()

async function onMessage(msg) {
  log.info('StarterBot', msg.toString())
  // console.debug(msg)
  if (msg.text() == 'ding') {
    msg.say('dong')
  }
}

bot
  .use(
    WechatyVikaPlugin()
  )
  .on('message', onMessage)

bot.start().catch((e) => console.error(e))
