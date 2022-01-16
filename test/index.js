const { Contact, log, Message, ScanStatus, WechatyBuilder, UrlLink, MiniProgram, MessageType } = require('wechaty')
const WechatyVikaPlugin = require('../src/index')

// const token = 'padtoken'
const name = 'wechat-vika'
// const puppet = new PuppetPadlocal({
//     token,
// })
const bot = WechatyBuilder.build({
  name, // generate xxxx.memory-card.json and save login data for the next login
  // puppet,
  puppet: 'wechaty-puppet-wechat',
})
bot
  .use(
    WechatyVikaPlugin({
      token: '替换为自己的维格表token',
      reportList: [],
    })
  )
  .start()
  .catch((e) => console.error(e))
