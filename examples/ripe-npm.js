import { Wechaty, ScanStatus, log } from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
// import 'dotenv/config.js'

import WechatyVikaPlugin from 'wechaty-vika-link'

const bot = new Wechaty()

async function onMessage(msg) {
  log.info('StarterBot', msg.toString())
  // console.debug(msg)
}

bot
  .use(
    WechatyVikaPlugin({
      token: vikaToken,
      reportList: [],
    })
  )
  .on('message', onMessage)

bot.start().catch((e) => console.error(e))
