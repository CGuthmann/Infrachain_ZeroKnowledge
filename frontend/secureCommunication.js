import {bufferToHex} from 'ethereumjs-util'
import * as nacl from 'tweetnacl';
import * as naclUtil from "tweetnacl-util";

const myFunc = ({publicKey, data}) => {
  console.debug("myFunc() publicKey >> ", publicKey)
  // generate ephemeral keypair
  const ephemeralKeyPair = nacl.box.keyPair();

  // assemble encryption parameters - from string to UInt8
  let pubKeyUInt8Array;
  try {
    pubKeyUInt8Array = naclUtil.decodeBase64(publicKey);
  } catch (err) {
    throw new Error('Bad public key');
  }
  console.debug("myFunc() pubKeyUInt8Array >> ", pubKeyUInt8Array)

  let msgParamsUInt8Array;
  let nonce;
  try {
    msgParamsUInt8Array = naclUtil.decodeUTF8(data);
    nonce = nacl.randomBytes(nacl.box.nonceLength);
  } catch (e) {
    console.error("msgParamsUInt8Array/nonce error", e)
    return
  }
  console.debug("myFunc() msgParamsUInt8Array >> ", msgParamsUInt8Array)
  console.debug("myFunc() nonce >> ", nonce)


  // encrypt
  let encryptedMessage;
  try {
    encryptedMessage = nacl.box(
      msgParamsUInt8Array,
      nonce,
      pubKeyUInt8Array,
      ephemeralKeyPair.secretKey,
    );
  } catch (e) {
    console.error("encryptedMessage error", e)
    return
  }
  console.debug("myFunc() encryptedMessage >> ", encryptedMessage)


  // handle encrypted data
  const output = {
    version: 'x25519-xsalsa20-poly1305',
    nonce: naclUtil.encodeBase64(nonce),
    ephemPublicKey: naclUtil.encodeBase64(ephemeralKeyPair.publicKey),
    ciphertext: naclUtil.encodeBase64(encryptedMessage),
  };
  // return encrypted msg data
  return output;
}

const getEncryptionPublicKey = async () => {
  try {
    const account = await getEthereumWalletAddress()
    return await window.ethereum.request({
      method: 'eth_getEncryptionPublicKey',
      params: [account]
    })
  } catch (error) {
    console.error('(getPublicKey) error  >> ', error)
  }
}

const getEthereumWalletAddress = async () => {
  try {
    const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})
    console.debug('(getEthereumWalletAddress) account >>', account)
    return account
  } catch (error) {
    console.error('(getEthereumWalletAddress) error >> ', error)
  }
}

const encrypt = async (message, encryptionPublicKey) => {
  console.debug('(encrypt) encryptionPublicKey >> ', encryptionPublicKey)
  try {
    const encryptedMessage = myFunc({
      publicKey: encryptionPublicKey,
      data: message,
    })
    return bufferToHex(
      Buffer.from(JSON.stringify(encryptedMessage), 'utf8')
    )
  } catch (error) {
    console.error('(encrypt) error >> ', error)
  }
}

const decrypt = async encryptedMessage => {
  try {
    const account = await getEthereumWalletAddress()
    return await window.ethereum.request({
      method: 'eth_decrypt',
      params: [encryptedMessage, account]
    })
  } catch (error) {
    console.error('(decrypt) error >> ', error)
  }
}

export {
  encrypt,
  decrypt,
  getEncryptionPublicKey,
  getEthereumWalletAddress,
}
