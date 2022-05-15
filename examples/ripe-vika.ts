#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
// https://stackoverflow.com/a/42817956/1123955
// https://github.com/motdotla/dotenv/issues/89#issuecomment-587753552
import 'dotenv/config.js'

import {
    Contact,
    Message,
    ScanStatus,
    WechatyBuilder,
    log,
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'

// import WechatyVikaPlugin from 'wechaty-vika-link'
import WechatyVikaPlugin from '../src/index.js'

import { VikaBot } from '../src/vika.js'

const isUpdate = false
const VIKA_TOKEN = '' // VIKA维格表token
const VIKA_SPACENAME = 'chatbot-ledongmao'  // VIKA维格表空间名称

const configs = {
    VIKA_TOKEN,
    VIKA_SPACENAME,
}
const vika_config = { token: configs.VIKA_TOKEN, spaceName: configs.VIKA_SPACENAME }
const vika = new VikaBot(vika_config)

// 定义一个延时方法
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

function onScan(qrcode: string, status: ScanStatus) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        const qrcodeImageUrl = [
            'https://wechaty.js.org/qrcode/',
            encodeURIComponent(qrcode),
        ].join('')
        log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

        qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

    } else {
        log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
    }
}

async function onLogin(user: Contact) {
    log.info('StarterBot', '%s login', user)

    if (isUpdate) {
        const rooms = await bot.Room.findAll()
        let roomsRecord = []
        for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i]
            let memberIdList = []
            const memberAll = await room.memberAll()
            // memberAll.forEach(member => {
            //     memberIdList.push(member.id)
            // })
            let newRoom = {
                fields: {
                    adminIdList: '',
                    avatar: JSON.stringify(room.avatar() || ''),
                    external: '',
                    id: room.id,
                    memberIdList: JSON.stringify(memberAll),
                    ownerId: room.owner()?.id || '',
                    topic: await room.topic(),
                },
            }
            // console.debug(newRoom)
            roomsRecord.push(newRoom)
            console.debug(roomsRecord.length, rooms.length)
            if (roomsRecord.length == 10) {
                await vika.createRecords(vika.sheets.Room.id, roomsRecord)
                roomsRecord = []
                await wait(500)
            }

            if (rooms.length == (i + 1)) {
                await vika.createRecords(vika.sheets.Room.id, roomsRecord)
                await wait(500)
            }
        }

        const contactList = await bot.Contact.findAll()
        let contactsRecord = []
        let contactsId = []
        let count = 0
        for (let i = 0; i < contactList.length; i++) {
            let contact = contactList[i]

            if (!contactsId.includes(contact.id)) {
                contactsId.push(contact.id)
                let newContact = {
                    fields: {
                        alias: '',
                        avatar: '',
                        friend: false,
                        gender: bot.Contact.Gender[contact.gender()],
                        id: contact.id,
                        name: contact.name(),
                        phone: JSON.stringify([]),
                        type: bot.Contact.Type[contact.type()],
                    },
                }
                // console.debug(newContact)
                if (contact.friend()) {
                    contactsRecord.push(newContact)
                    count = count + 1
                }
            }

            console.debug(contactList.length, contactsId.length, count, i)

            if (contactsRecord.length == 10) {
                await vika.createRecords(vika.sheets.Contact.id, contactsRecord)
                contactsRecord = []
                await wait(1000)
            }

            if (contactList.length == (i + 1)) {
                await vika.createRecords(vika.sheets.Contact.id, contactsRecord)
                await wait(1000)

            }
        }
    }

}

function onLogout(user: Contact) {
    log.info('StarterBot', '%s logout', user)
}

async function onMessage(message: Message) {

    try {
        console.table({
            msg: 'onMessage 消息id和类型',
            id: message.id,
            type: bot.Message.Type[message.type()],
        })
    } catch (e) {
        log.error('发起请求wxai失败', e)
    }
    const text = message.text()
    if (text == '我要转发') {
        // 生产转发密码
        await message.say('接收密码')
    }

    if (text == '我要接收') {
        // 生成接收密码
        await message.say('发送密码')
    }

    if (text == '发送密码to接收密码') {
        // 建立转发关系
        await message.say('发送密码')
    }

}


const bot = WechatyBuilder.build({
    name: 'openai-qa-bot',
    puppet: 'wechaty-puppet-xp',
})

bot.use(
    WechatyVikaPlugin(vika_config),
)
bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)
bot.start()
    .then(() => log.info('StarterBot', 'Starter Bot Started.'))
    .catch(e => log.error('StarterBot', e))



