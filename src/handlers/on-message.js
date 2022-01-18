import { VikaBot } from '../vika.js'
import { Wechaty, ScanStatus, log, Message } from 'wechaty'
import fs from 'fs'

let msgList = []

async function onMessage(message) {
  // console.debug(message)
  try {
    // const config = await getVikaConfig()
    // // console.debug(config)
    // const { token, reportList, vikaConfig } = config
    // 维格表相关配置
    let vika = new VikaBot()

    let file_payload = {}
    let uploaded_attachments = ''
    let msg_type = 'Unknown'
    let msgId = message.id
    switch (message.type()) {
      // 文本消息
      case Message.Type.Text:
        msg_type = 'Text'
        // const text = message.text();
        break;

      // 图片消息
      case Message.Type.Image:
        msg_type = 'Image'
        const messageImage = await message.toImage();

        // 缩略图
        const thumbImage = await messageImage.thumbnail();
        const thumbImageData = await thumbImage.toBuffer();
        // thumbImageData: 缩略图图片二进制数据

        // console.debug(thumbImageData)

        // 大图
        const hdImage = await messageImage.hd();
        const hdImageData = await hdImage.toBuffer();
        // 大图图片二进制数据
        file_payload = {
          cloudPath: 'images/' + hdImage.name,
          fileContent: hdImageData
        }
        uploaded_attachments = await vika.upload(file_payload)
        // 原图
        const artworkImage = await messageImage.artwork();
        const artworkImageData = await artworkImage.toBuffer();
        // artworkImageData: 原图图片二进制数据
        // file_payload = {
        //   cloudPath: artworkImage.name,
        //   fileContent: artworkImageData
        // }
        break;

      // 链接卡片消息
      case Message.Type.Url:
        msg_type = 'Url'
        const urlLink = await message.toUrlLink();
        // urlLink: 链接主要数据：包括 title，URL，description

        const urlThumbImage = await message.toFileBox();
        const urlThumbImageData = await urlThumbImage.toBuffer();
        // urlThumbImageData: 链接的缩略图二进制数据
        file_payload = {
          cloudPath: 'images/' + msgId + '.' + urlThumbImage.name.split('.').pop(),
          fileContent: urlThumbImageData
        }

        uploaded_attachments = await vika.upload(file_payload)

        break;

      // 小程序卡片消息
      case Message.Type.MiniProgram:
        msg_type = 'MiniProgram'

        const miniProgram = await message.toMiniProgram();
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
      case Message.Type.Audio:
        msg_type = 'Audio'

        const audioFileBox = await message.toFileBox();

        const audioData = await audioFileBox.toBuffer();
        // audioData: silk 格式的语音文件二进制数据
        file_payload = {
          cloudPath: 'images/' + msgId + '.' + audioFileBox.name.split('.').pop(),
          fileContent: audioData
        }
        uploaded_attachments = await vika.upload(file_payload)
        break;

      // 视频消息
      case Message.Type.Video:
        msg_type = 'Video'

        const videoFileBox = await message.toFileBox();

        const videoData = await videoFileBox.toBuffer();
        // videoData: 视频文件二进制数
        file_payload = {
          cloudPath: 'images/' + msgId + '.' + videoFileBox.name.split('.').pop(),
          fileContent: videoData
        }
        uploaded_attachments = await vika.upload(file_payload)

        break;

      // 动图表情消息
      case Message.Type.Emoticon:
        msg_type = 'Emoticon'

        const emotionFile = await message.toFileBox();

        const emotionData = await emotionFile.toBuffer();
        // emotionData: 动图 Gif文件 二进制数据
        file_payload = {
          cloudPath: 'images/' + msgId + '.' + emotionFile.name.split('.').pop(),
          fileContent: emotionData
        }
        uploaded_attachments = await vika.upload(file_payload)

        break;

      // 文件消息
      case Message.Type.Attachment:
        msg_type = 'Attachment'

        const attachFileBox = await message.toFileBox();

        const attachData = await attachFileBox.toBuffer();
        // attachData: 文件二进制数据
        file_payload = {
          cloudPath: 'images/' + msgId + '.' + attachFileBox.name.split('.').pop(),
          fileContent: attachData
        }
        uploaded_attachments = await vika.upload(file_payload)

        break;

      // 其他消息
      default:
        break;
    }

    // console.debug(message)
    vika.addChatRecord(message, uploaded_attachments, msg_type)

  } catch (e) {
    console.log('监听消息失败', e)
  }
}

export { onMessage }

export default onMessage
