import {
  Contact,
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
// import 'dotenv/config.js'

import WechatyVikaPlugin from '../src/index.js'

const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  puppet: 'wechaty-puppet-xp',
})

async function onMessage(msg) {
  log.info('StarterBot', msg.toString())
  // console.debug(msg)
  if (msg.text() == 'ding') {
    msg.say('dong')
  }
}

const VIKA_TOKEN = '' // VIKA维格表token
const VIKA_SPACENAME = 'chatbot-ledongmao'  // VIKA维格表空间名称

const configs = {
  VIKA_TOKEN,
  VIKA_SPACENAME,
}

const vika_config = { token: configs.VIKA_TOKEN, spaceName: configs.VIKA_SPACENAME }

bot.use(
  WechatyVikaPlugin(vika_config),
)
bot.on('scan', (qrcode, status) => {
  if (status === ScanStatus.Waiting) {
    qrcodeTerminal.generate(qrcode, {
      small: true
    })
  }
})
bot.on('login', async user => {
  console.log(`user: ${JSON.stringify(user)}`)
})
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))
