import rp from 'request-promise'

async function addDataSheets(token) {
    // console.debug(JSON.stringify(msg))
    var body = {
        "name": "我的表格",
        "description": "创建自wechaty-vika-link",
        "folderId": "",
        "preNodeId": "",
        "fields": [
            {
                "type": "Text",
                "name": "标题"
            }
        ]
    }
    var headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    }
    var options = {
        method: 'POST',
        uri: `https://api.vika.cn/fusion/v1/spaces/spcP52TvPjHxM/datasheets`,
        body,
        headers,
        json: true // Automatically stringifies the body to JSON
    };

    var parsedBody = await rp(options)
    console.debug(parsedBody)

}

addDataSheets()