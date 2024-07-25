import CryptoJS from 'crypto-js' // js
// import CryptoJS from 'crypto-js' // ts
import JSEncrypt from 'jsencrypt'

// rsa公钥：加密
const rsaPublicKey: any = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxpNjffeqjUrZfz2HiaTo
6WdPqlUcyqrsykyrzynDk6mXknIybijcwuX7G7OHlUV0kbs7XDjyrtsmTj3ezhGd
OvmJn7q4swddgiDGo0mCCXa2hf7VCukmptJccRsxZLOuf20vu/iAeYtIkQUZJp8w
Se7IOkIcn7aX+zcQPls7OOQI37cCJx+Mxr08Sg+H6R+uo3naFyOaGCirlJc58NfH
r1oOmuSCcDRSxWatIaqTGpFC+jnU8LbNZJyUXaCGC4FETGuzfc01qd4CfO/sKuPa
3NoF94+/AQPnd/QOdy654C6WeuYO8SPqRCPEnpNd05CeVSVfT9GGLfpbz3ARrhUp
0wIDAQAB`
// rsa私钥：解密
const rsaPrivateKey: any = `MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDGk2N996qNStl/
PYeJpOjpZ0+qVRzKquzKTKvPKcOTqZeScjJuKNzC5fsbs4eVRXSRuztcOPKu2yZO
Pd7OEZ06+YmfurizB12CIMajSYIJdraF/tUK6Sam0lxxGzFks65/bS+7+IB5i0iR
BRkmnzBJ7sg6Qhyftpf7NxA+Wzs45AjftwInH4zGvTxKD4fpH66jedoXI5oYKKuU
lznw18evWg6a5IJwNFLFZq0hqpMakUL6OdTwts1knJRdoIYLgURMa7N9zTWp3gJ8
7+wq49rc2gX3j78BA+d39A53LrngLpZ65g7xI+pEI8Sek13TkJ5VJV9P0YYt+lvP
cBGuFSnTAgMBAAECggEAA+MwyG+HzDpR5bbLp3suABvAqIIADUupVRCJMIYNyR9B
02Ee8Z8lKz+bWeB64AY7EPtMXzLSNXAe4Ns/OGOJ43StKA5cvUyAnSKNIPc4b3z+
d8MUYqFL22o02xYAMot9+AqoK5Li2P5MDmK+Kk5lgJ0HGHTg4JOPiCB81eutTiDH
4A7XsqCesLMYHTLLtEHmRLQVq40BVobS1oh1j9zDmHmC7ygMEZHHFD+NZhM++jkS
qZXFrMgI4yMFS0nw9SmkTtYtIigXrqHcLsIN+kTgrpgTsjDwARmnesUr3Pb3XwO4
YAPykQraa0g60nGJaZw5jCQ+S3IpdSPjf0djencUyQKBgQDutLqx3emyfw8gGFG3
e4AX/Y9uyTbRmZtSYwObP+bDJ702EXhVeu+3y9QA3YRCB8BwYf4YIBSYSaaaErGO
WByW2GNhX5KBMmAZ2V8EafSmFmXCHcki9BbZAcoYH98hK8K8NLxm+AVvY/81Sa34
ESBnoeWQRjO1UoZ3bA9e93nq1wKBgQDU9l2I3AC2sxJQA6rgx332TabnFlH34H2D
OUyRQiLPNPwkBruLadNXVAjd0xXxzZFk640YSjTuCZ6yMyRkn+tEmnIUMlZFx/6k
38cIA2hVAV1CzK4HMRwHytXVMQjlISXwRn9Ww/Wu7S63Go+gl5x6d9SSpCm1D9xR
5eUJVus1ZQKBgH0B9reJQIay1af4NGtDaPynVEMvat7vc5D8u3nFSEMxf3xeP8d8
PyfgvaDKYSX3S0dPejMGMeLixzXuzj9+U1KH9dubomy4he1jkcgM+Qs1tYqn8Jq2
e3Sf5EcoAcEsWqoXcAb4olgIZTFx6YJ87Zx4A3G/4fp2QmcuFwqjzZw3AoGAY0+o
esQtyQVlCs9LBpvBT/USWj18aB3WKjW0USEIXpyU4LALEY5+MgFMSTXAzAxTOz7l
g2hHmqH90Zgr5oj1C/8CKAz5Un1bcMOyazg7lTiXpykQFuZ97dxXL544SbHVoWEe
zPWBQtv0pwrJ49gP7sSm6uOHV5pX4hFVZ6+S7EkCgYBIahpocIdQmQeBRpcSPq7q
Rwfyd/EQ8CrLM7v4hXAMGeUDi1BGy+J98ZBLVFMm1Hs4iS2mBEBdRCRNXLwJIOwk
3Ug0Alt6/5hYtsGA6PLfR96/v1A8e61rqt8v3cvcd8SsFmPNZVGqke7LNE+N2ywM
NBpJQ7zSda3WQ2La0B1x0A==`

/**
 * 加密
 * @param {*} word
 * @param {*} key
 */
export const njxEncode = (word: any) => {
  // 随机16位key
  const key = getKey()
  // rsa给key加密
  const rsaKey = setRsa(key)
  // 给数据加密
  word = JSON.stringify(word)
  const data = setAes(word, key)
  return {
    key: rsaKey,
    data
  }
}

/**
 * 解密
 * @param {*} word
 * @param {*} key
 */
export const njxDecode = (word: any, rsaKey: any) => {
  const key = getRsa(rsaKey)
  word = getAes(word, key)

  return {
    res: (key && word && JSON.parse(word)) || ''
  }
}

/**
 * 获取随机16位key
 * @param {*} len
 * @param {*} radix
 * @returns
 */
function getKey(len = 16, radix = 16) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid: any = []
  let i: any
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    let r: any

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

/**
 * rsa加密
 * @param {*} key
 * @returns
 */
const setRsa = (key: any) => {
  const jsencrypt = new JSEncrypt()
  jsencrypt.setPublicKey(rsaPublicKey)
  return jsencrypt.encrypt(key)
}
/**
 * rsa解密
 * @param {*} key
 * @returns
 */
function getRsa(key: any) {
  const decrypt = new JSEncrypt()
  decrypt.setPrivateKey(rsaPrivateKey)
  // 下文的""为了防止存于localStorage中的信息被不小心损坏
  return decrypt.decrypt(key) || ''
}

/**
 * aes加密
 * @param {*} word
 * @param {*} key
 * @returns
 */
function setAes(word: any, key: any) {
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(key),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString().toUpperCase()
}
/**
 * aes解密
 * @param {*} word
 * @param {*} key
 * @returns
 */
function getAes(word: any, key: any) {
  // 在aes解密中会遇到很多解不出的情况，所以这里我们使用了try catch
  try {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
    const iv = CryptoJS.enc.Utf8.parse(key)
    const decrypt = CryptoJS.AES.decrypt(srcs, iv, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    return decryptedStr.toString()
  } catch {
    return ''
  }
}

// 额外记录一下子没有key的aes加解密方法
const key = CryptoJS.enc.Utf8.parse('aaDJL2d9DfhLZO0z') // 密钥
const iv = CryptoJS.enc.Utf8.parse('412ADDSSFA342442') // 偏移量
// aes无key加密
export const aesEncode = (word: any) => {
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString().toUpperCase()
}
// aes无key解密
export const aesDecode = (word: any) => {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
