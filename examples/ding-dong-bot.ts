/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */

import { VikaBot } from '../src/vika.js'
// import { Wechaty, ScanStatus, log, Message } from 'wechaty'
import console from 'console'

let msgList = []

const VIKA_TOKEN = '' // 替换为自己的vika表token
const VIKA_DATASHEETNAME = '抗疫信息统计表'

let vika = new VikaBot(VIKA_TOKEN, VIKA_DATASHEETNAME)

import {
    Contact,
    Message,
    ScanStatus,
    WechatyBuilder,
    log,
    types,
} from 'wechaty'
import fs from 'fs'

import { PuppetXp } from 'wechaty-puppet-xp'
import qrcodeTerminal from 'qrcode-terminal'
import timersPromise from 'timers/promises'

let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function onScan(qrcode: string, status: ScanStatus) {
    if (qrcode) {
        const qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(qrcode),
        ].join('')
        console.info('StarterBot', 'onScan: %s(%s) - %s', status, qrcodeImageUrl)

        qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console
        console.info(`[${status}] ${qrcode}\nScan QR Code above to log in: `)
    } else {
        console.info(`[${status}]`)
    }
}

async function onLogin(user: Contact) {
    log.info('StarterBot', '%s login', user)
    const roomList = await bot.Room.findAll()
    console.info('群数量：',roomList.length)
}

function onLogout(user: Contact) {
    log.info('StarterBot', '%s logout', user)
}

async function onMessage(message: Message) {
    // log.info('onMessage', message)

    const contact = message.talker()
    // console.log(contact)

    const text = message.text()
    // console.log(text)

    const room = message.room()
    // console.log(room)



    if (room) {
        const topic = await room.topic()
        console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
    } else {
        console.log(`Contact: ${contact.name()} Text: ${text}`)
    }

    if (message.text() === 'ding') {
        await message.say('dong')
    }
    if (message.text() === 'dong') {
        const miniProgram = new bot.MiniProgram({
            appid: 'gh_0aa444a25adc',
            title: '我正在使用Authing认证身份，你也来试试吧',
            pagePath: 'routes/explore.html',
            thumbUrl: '30590201000452305002010002041092541302033d0af802040b30feb602045df0c2c5042b777875706c6f61645f31373533353339353230344063686174726f6f6d3131355f313537363035393538390204010400030201000400',
            thumbKey: '',
        })

        await message.say(miniProgram)
    }
    if (message.type() === types.Message.Image) {
        // const img = await message.toImage()
        // const thumbFile = await img.thumbnail()
        // log.info('thumbFile', thumbFile.name)
        // await thumbFile.toFile(`${process.cwd()}/cache/${thumbFile.name}`, true)
        // await timersPromise.setTimeout(1000)

        // console.info(img)
        // const hdFile = await img.hd()
        // log.info('hdFile', hdFile.name)
        // await hdFile.toFile(`${process.cwd()}/cache/${hdFile.name}`, true)
        // setTimeout(message.wechaty.wrapAsync(
        //     async function () {
        //         const imginfo = await message.toFileBox()
        //         console.info(imginfo)
        //     },
        // ), 500)

        // if (message.type() === types.Message.Attachment) {
        //     const img = await message.toImage()
        //     const thumbFile = await img.thumbnail()
        //     log.info('thumbFile', thumbFile.name)
        //     await thumbFile.toFile(`${process.cwd()}/cache/${thumbFile.name}`, true)
        //     await timersPromise.setTimeout(1000)

        //     console.info(img)
        //     const hdFile = await img.hd()
        //     log.info('hdFile', hdFile.name)
        //     await hdFile.toFile(`${process.cwd()}/cache/${hdFile.name}`, true)
        //     setTimeout(message.wechaty.wrapAsync(
        //         async function () {
        //             const imginfo = await message.toFileBox()
        //             console.info(imginfo)
        //         },
        //     ), 500)
        // }
    }

    try {
        // const config = await getVikaConfig()
        // // console.debug(config)
        // const { token, reportList, vikaConfig } = config
        // 维格表相关配置


        let uploaded_attachments: any = ''
        let msg_type = 'Unknown'
        let file: any = ''
        let filePath = ''
        let text = ''


        switch (message.type()) {
            // 文本消息
            case bot.Message.Type.Text:
                msg_type = 'Text'
                text = message.text();
                break;

            // 图片消息
            case bot.Message.Type.Image:
                msg_type = 'Image'

                const img = await message.toImage()
                console.info(img)

                const thumbFile = await img.thumbnail()
                // log.info('thumbFile', thumbFile.name)
                await thumbFile.toFile(`${process.cwd()}/cache/${thumbFile.name}`, true)
                await timersPromise.setTimeout(1000)

                const hdFile = await img.hd()
                // log.info('hdFile', hdFile.name)
                await hdFile.toFile(`${process.cwd()}/cache/${hdFile.name}`, true)
                setTimeout(message.wechaty.wrapAsync(
                    async function () {
                        file = await message.toFileBox()
                        // console.info(imginfo)
                    },
                ), 500)

                file = thumbFile


                break;

            // 链接卡片消息
            case bot.Message.Type.Url:
                msg_type = 'Url'
                const urlLink = await message.toUrlLink();
                text = JSON.stringify(JSON.parse(JSON.stringify(urlLink)).payload)

                // urlLink: 链接主要数据：包括 title，URL，description

                file = await message.toFileBox();
                break;

            // 小程序卡片消息
            case bot.Message.Type.MiniProgram:
                msg_type = 'MiniProgram'

                const miniProgram = await message.toMiniProgram();
                text = JSON.stringify(JSON.parse(JSON.stringify(miniProgram)).payload)

                // console.debug(miniProgram)
                /*
                miniProgram: 小程序卡片数据
                {
                  appid: "wx363a...",
                  description: "贝壳找房 - 真房源",
                  title: "美国白宫，10室8厅9卫，99999刀/月",
                  iconUrl: "http://mmbiz.qpic.cn/mmbiz_png/.../640?wx_fmt=png&wxfrom=200",
                  pagePath: "pages/home/home.html...",
                  shareId: "0_wx363afd5a1384b770_..._1615104758_0",
                  thumbKey: "84db921169862291...",
                  thumbUrl: "3051020100044a304802010002046296f57502033d14...",
                  username: "gh_8a51...@app"
                }
               */
                break;

            // 语音消息
            case bot.Message.Type.Audio:
                msg_type = 'Audio'
                file = await message.toFileBox();

                break;

            // 视频消息
            case bot.Message.Type.Video:
                msg_type = 'Video'

                file = await message.toFileBox();
                break;

            // 动图表情消息
            case bot.Message.Type.Emoticon:
                msg_type = 'Emoticon'
                file = await message.toFileBox();

                break;

            // 文件消息
            case bot.Message.Type.Attachment:
                msg_type = 'Attachment'
                file = await message.toFileBox();

                break;

            // 其他消息
            default:
                break;
        }

        if (file) {
            filePath = './cache/' + file.name
            console.debug('filePath', filePath)
            try {
                const writeStream = fs.createWriteStream(filePath)
                await file.pipe(writeStream)
                await wait(200)
                let readerStream = fs.createReadStream(filePath);
                uploaded_attachments = await vika.upload(readerStream)
                console.debug(uploaded_attachments)
                // fs.unlink(filePath, (err) => {
                //   console.debug(filePath, '已删除')
                // })
            } catch {
                console.debug('上传失败：', filePath)
            }

        }else{

        }

        // console.debug(message)
        vika.addChatRecord(message, uploaded_attachments, msg_type, text)

    } catch (e) {
        console.log('监听消息失败', e)
    }

}

const puppet = new PuppetXp()
const bot = WechatyBuilder.build({
    name: 'ding-dong-bot',
    puppet,
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

bot.start()
    .then(() => {
        return log.info('StarterBot', 'Starter Bot Started.')
    })
    .catch(console.error)
