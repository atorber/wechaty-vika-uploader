import { Wechaty, ScanStatus, log } from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
// import 'dotenv/config.js'

import WechatyVikaPlugin from 'wechaty-vika-link'

const vikaToken = '替换为自己的维格表token'
const token = '替换为自己的token'
const puppet = 'wechaty-puppet-padlocal'
const bot = new Wechaty({
  puppet,
  puppetOptions: {
    token,
  },
})

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
