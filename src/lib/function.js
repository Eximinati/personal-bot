const axios = require('axios').default
const { tmpdir } = require('os')
const { promisify } = require('util')
const moment = require('moment-timezone')
const FormData = require('form-data')
const { load } = require('cheerio')
const { exec } = require('child_process')
const { createCanvas } = require('canvas')
const { sizeFormatter } = require('human-readable')
const { readFile, unlink, writeFile } = require('fs-extra')
const { removeBackgroundFromImageBase64 } = require('remove.bg')
const got = require('got')
const cheerio = require('cheerio')

/**
 * @param {string} url
 * @returns {Promise<Buffer>}
 */

const getBuffer = async (url) =>
    (
        await axios.get(url, {
            responseType: 'arraybuffer'
        })
    ).data

/**
 * @param {string} content
 * @param {boolean} all
 * @returns {string}
 */

const capitalize = (content, all = false) => {
    if (!all) return `${content.charAt(0).toUpperCase()}${content.slice(1)}`
    return `${content
        .split('')
        .map((text) => `${text.charAt(0).toUpperCase()}${text.slice(1)}`)
        .join('')}`
}

/**
 * @param {Buffer} input
 * @returns {Promise<Buffer>}
 */

const removeBG = async (input) => {
    try {
        const response = await removeBackgroundFromImageBase64({
            base64img: input.toString('base64'),
            apiKey: process.env.BG_API_KEY,
            size: 'auto',
            type: 'auto'
        })
        return Buffer.from(response.base64img, 'base64')
    } catch (error) {
        throw error
    }
}

/**
 * Copyright by (AliAryanTech), give credit!
 * @param {string} cardName
 * @param {string} expiryDate
 * @returns {Promise<Buffer}
 */

const generateCreditCardImage = (cardName, expiryDate) => {
    const canvas = createCanvas(800, 500)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, 800, 500)
    ctx.fillStyle = '#1e90ff'
    ctx.fillRect(0, 0, 800, 80)
    ctx.fillStyle = '#555'
    ctx.font = '24px Arial, sans-serif'
    ctx.fillText('Credit Card', 40, 150)
    ctx.fillStyle = '#000'
    ctx.font = '48px Arial, sans-serif'
    ctx.fillText('1234 5678 9012 3456', 40, 250) // card numbers
    ctx.fillStyle = '#555'
    ctx.font = '24px Arial, sans-serif'
    ctx.fillText('Card Name', 40, 350)
    ctx.fillStyle = '#000'
    ctx.font = '32px Arial, sans-serif'
    ctx.fillText(cardName, 40, 400)
    ctx.fillStyle = '#555'
    ctx.font = '24px Arial, sans-serif'
    ctx.fillText('Expiry Date', 450, 350)
    ctx.fillStyle = '#000'
    ctx.font = '32px Arial, sans-serif'
    ctx.fillText(expiryDate, 450, 400)
    return canvas.toBuffer()
}

const greetings = () => {
    const now = new Date();
const hour = now.getHours();
let greetmsg = "";

if (hour >= 0 && hour < 12) {
    greetmsg = "🌅 Ohayou gozaimasu"; //good morning
} else if (hour >= 12 && hour < 18) {
    greetmsg = "🌞 Konnichiwa"; //good afternoon
} else {
    greetmsg = "🌇 Konbanwa"; //good evening
}
return greetmsg
}

/**
 * @returns {string}
 */

const generateRandomHex = () => `#${(~~(Math.random() * (1 << 24))).toString(16)}`

/**
 * @param {string} content
 * @returns {number[]}
 */

const extractNumbers = (content) => {
    const search = content.match(/(-\d+|\d+)/g)
    if (search !== null) return search.map((string) => parseInt(string)) || []
    return []
}

/**
 * @param {string} url
 */

const fetch = async (url) => (await axios.get(url)).data

/**
 * @param {Buffer} webp
 * @returns {Promise<Buffer>}
 */

const webpToPng = async (webp) => {
    const filename = `${tmpdir()}/${Math.random().toString(36)}`
    await writeFile(`${filename}.webp`, webp)
    await execute(`dwebp "${filename}.webp" -o "${filename}.png"`)
    const buffer = await readFile(`${filename}.png`)
    Promise.all([unlink(`${filename}.png`), unlink(`${filename}.webp`)])
    return buffer
}

/**
 * @param {Buffer} webp
 * @returns {Promise<Buffer>}
 */

const webpToMp4 = async (webp) => {
    const responseFile = async (form, buffer = '') => {
        return axios.post(buffer ? `https://ezgif.com/webp-to-mp4/${buffer}` : 'https://ezgif.com/webp-to-mp4', form, {
            headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}` }
        })
    }
    return new Promise(async (resolve, reject) => {
        const form = new FormData()
        form.append('new-image-url', '')
        form.append('new-image', webp, { filename: 'blob' })
        responseFile(form)
            .then(({ data }) => {
                const datafrom = new FormData()
                const $ = load(data)
                const file = $('input[name="file"]').attr('value')
                datafrom.append('file', file)
                datafrom.append('convert', 'Convert WebP to MP4!')
                responseFile(datafrom, file)
                    .then(async ({ data }) => {
                        const $ = load(data)
                        const result = await getBuffer(
                            `https:${$('div#output > p.outfile > video > source').attr('src')}`
                        )
                        resolve(result)
                    })
                    .catch(reject)
            })
            .catch(reject)
    })
}

/**
 * @param {Buffer} gif
 * @param {boolean} write
 * @returns {Promise<Buffer | string>}
 */

const gifToMp4 = async (gif, write = false) => {
    const filename = `${tmpdir()}/${Math.random().toString(36)}`
    await writeFile(`${filename}.gif`, gif)
    await execute(
        `ffmpeg -f gif -i ${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${filename}.mp4`
    )
    if (write) return `${filename}.mp4`
    const buffer = await readFile(`${filename}.mp4`)
    Promise.all([unlink(`${filename}.gif`), unlink(`${filename}.mp4`)])
    return buffer
}

const execute = promisify(exec)

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)]

const calculatePing = (timestamp, now) => (now - timestamp) / 1000

const formatSize = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: '2',
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`
})

const term = (param) =>
    new Promise((resolve, reject) => {
        console.log('Run terminal =>', param)
        exec(param, (error, stdout, stderr) => {
            if (error) {
                console.log(error.message)
                resolve(error.message)
            }
            if (stderr) {
                console.log(stderr)
                resolve(stderr)
            }
            console.log(stdout)
            resolve(stdout)
        })
    })

const restart = () => {
    exec('pm2 start src/krypton.js', (err, stdout, stderr) => {
        if (err) {
            console.log(err)
            return
        }
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
    })
}

/**
 * @param {string} url - The URL of the video to scrape.
 * @returns {Promise<object>} A promise that resolves to an object containing the scraped video data.
 */

const snapsave = (url) => {
    return new Promise(async (resolve) => {
    try {
    if (!url.match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/) && !url.match(/(https|http):\/\/www.instagram.com\/(p|reel|tv|stories)/gi)) return resolve({ developer: 'github.com/Eximinati', status: false, msg: `Link Url not valid` })
    function decodeSnapApp(args) {
    let [h, u, n, t, e, r] = args
    // @ts-ignore
    function decode (d, e, f) {
    const g = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('')
    let h = g.slice(0, e)
    let i = g.slice(0, f)
    // @ts-ignore
    let j = d.split('').reverse().reduce(function (a, b, c) {
    if (h.indexOf(b) !== -1)
    return a += h.indexOf(b) * (Math.pow(e, c))
    }, 0)
    let k = ''
    while (j > 0) {
    k = i[j % f] + k
    j = (j - (j % f)) / f
    }
    return k || '0'
    }
    r = ''
    for (let i = 0, len = h.length; i < len; i++) {
    let s = ""
    // @ts-ignore
    while (h[i] !== n[e]) {
    s += h[i]; i++
    }
    for (let j = 0; j < n.length; j++)
    s = s.replace(new RegExp(n[j], "g"), j.toString())
    // @ts-ignore
    r += String.fromCharCode(decode(s, e, 10) - t)
    }
    return decodeURIComponent(encodeURIComponent(r))
    }
    function getEncodedSnapApp(data) {
    return data.split('decodeURIComponent(escape(r))}(')[1]
    .split('))')[0]
    .split(',')
    .map(v => v.replace(/"/g, '').trim())
    }
    function getDecodedSnapSave (data) {
    return data.split('getElementById("download-section").innerHTML = "')[1]
    .split('"; document.getElementById("inputData").remove(); ')[0]
    .replace(/\\(\\)?/g, '')
    }
    function decryptSnapSave(data) {
    return getDecodedSnapSave(decodeSnapApp(getEncodedSnapApp(data)))
    }
    const html = await got.post('https://snapsave.app/action.php?lang=id', {
    headers: {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'content-type': 'application/x-www-form-urlencoded','origin': 'https://snapsave.app',
    'referer': 'https://snapsave.app/id',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    },
    form: { url }
    }).text()
    const decode = decryptSnapSave(html)
    const $ = cheerio.load(decode)
    const results = []
    if ($('table.table').length || $('article.media > figure').length) {
    const thumbnail = $('article.media > figure').find('img').attr('src')
    $('tbody > tr').each((_, el) => {
    const $el = $(el)
    const $td = $el.find('td')
    const resolution = $td.eq(0).text()
    let _url = $td.eq(2).find('a').attr('href') || $td.eq(2).find('button').attr('onclick')
    const shouldRender = /get_progressApi/ig.test(_url || '')
    if (shouldRender) {
    _url = /get_progressApi\('(.*?)'\)/.exec(_url || '')?.[1] || _url
    }
    results.push({
    resolution,
    thumbnail,
    url: _url,
    shouldRender
    })
    })
    } else {
    $('div.download-items__thumb').each((_, tod) => {
    const thumbnail = $(tod).find('img').attr('src')
    $('div.download-items__btn').each((_, ol) => {
    let _url = $(ol).find('a').attr('href')
    if (!/https?:\/\//.test(_url || '')) _url = `https://snapsave.app${_url}`
    results.push({
    thumbnail,
    url: _url
    })
    })
    })
    }
    if (!results.length) return resolve({ developer: 'github.com/Eximinati', status: false, msg: `Blank data` })
    return resolve({ developer: 'github.com/Eximinati', status: true, data: results })
    } catch (e) {
    return resolve({ developer: 'github.com/Eximinati', status: false, msg: e.message })
    }
    })
  }
  

module.exports = {
    calculatePing,
    capitalize,
    execute,
    extractNumbers,
    fetch,
    formatSize,
    removeBG,
    generateCreditCardImage,
    generateRandomHex,
    getBuffer,
    getRandomItem,
    gifToMp4,
    restart,
    term,
    greetings,
    webpToMp4,
    webpToPng,
    snapsave
}
