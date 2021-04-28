import forge from 'node-forge'

export function encryptAES(text, secretKey) {
    const ivbyte = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const cipher = forge.cipher.createCipher('AES-CBC', secretKey)
    cipher.start({ iv: ivbyte })
    cipher.update(forge.util.createBuffer(text))
    cipher.finish()
    return forge.util.encode64(cipher.output.getBytes())
}