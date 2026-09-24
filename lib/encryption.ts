import CryptoJS from 'crypto-js'

const SECRET_KEY = process.env.CREDENTIAL_ENCRYPTION_KEY || 'aulad-it-solution-2024-secret-key'

/**
 * Encrypts a plain text string using AES-256
 */
export function encrypt(text: string): string {
  if (!text) return ''
  const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString()
  return encrypted
}

/**
 * Decrypts an AES-256 encrypted string
 */
export function decrypt(cipherText: string): string {
  if (!cipherText) return ''
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return decrypted
  } catch {
    return ''
  }
}

/**
 * Encrypts an entire credentials object
 */
export function encryptCredentials(credentials: Record<string, string>): Record<string, string> {
  const encrypted: Record<string, string> = {}
  for (const key in credentials) {
    if (key === '_id') continue
    if (credentials[key] !== undefined && credentials[key] !== null) {
      encrypted[key] = encrypt(credentials[key])
    }
  }
  return encrypted
}

/**
 * Decrypts an entire credentials object
 */
export function decryptCredentials(credentials: Record<string, string>): Record<string, string> {
  const decrypted: Record<string, string> = {}
  for (const key in credentials) {
    if (key === '_id') continue
    if (credentials[key]) {
      decrypted[key] = decrypt(credentials[key])
    } else {
      decrypted[key] = ''
    }
  }
  return decrypted
}
