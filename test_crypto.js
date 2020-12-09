const crypto = require('crypto')
console.log(crypto.getCurves())
const alice = crypto.createECDH('secp256k1')
const bob = crypto.createECDH('secp256k1')

//alice.setPrivateKey('')
alice.generateKeys()
bob.generateKeys()

const alice_to_bob_secret = alice.computeSecret(bob.getPublicKey(), null, 'hex')
const bob_to_alice_secret = bob.computeSecret(alice.getPublicKey(), null, 'hex')

const alice_to_bob_key = crypto.createHash('sha256').update(alice_to_bob_secret, 'utf-8').digest()
const bob_to_alice_key = crypto.createHash('sha256').update(bob_to_alice_secret, 'utf-8').digest()

const common_iv = crypto.randomBytes(16)
const alice_aes = crypto.createCipheriv('aes-256-gcm', alice_to_bob_key, common_iv)

let alice_encrypted = alice_aes.update('Ala ma kota','utf8','hex')
alice_encrypted += alice_aes.final('hex')
const auth_tag = alice_aes.getAuthTag()
console.log('Encrypted : ', alice_encrypted)

const bob_aes = crypto.createDecipheriv('aes-256-gcm', bob_to_alice_key, common_iv)
bob_aes.setAuthTag(auth_tag)
let bob_decrypted = bob_aes.update(alice_encrypted, 'hex', 'utf8')
bob_decrypted += bob_aes.final('utf-8')
console.log('Decrypted : ', bob_decrypted)
