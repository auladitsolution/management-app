const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`

/**
 * Send a text message to a specific Telegram chat
 */
export async function sendTelegramMessage(chatId: string, text: string): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      }),
    })
    const data = await response.json()
    return data.ok
  } catch (error) {
    console.error('Telegram message error:', error)
    return false
  }
}

/**
 * Send a photo with caption to a specific Telegram chat
 */
export async function sendTelegramPhoto(chatId: string, photoUrl: string, caption: string): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoUrl,
        caption,
        parse_mode: 'HTML',
      }),
    })
    const data = await response.json()
    return data.ok
  } catch (error) {
    console.error('Telegram photo error:', error)
    return false
  }
}

/**
 * Broadcast a message to multiple chat IDs
 */
export async function broadcastMessage(
  chatIds: string[],
  text: string,
  photoUrl?: string
): Promise<{ success: number; failed: number; results: { chatId: string; ok: boolean }[] }> {
  const results = []
  let success = 0
  let failed = 0

  for (const chatId of chatIds) {
    let ok: boolean
    if (photoUrl) {
      ok = await sendTelegramPhoto(chatId, photoUrl, text)
    } else {
      ok = await sendTelegramMessage(chatId, text)
    }

    results.push({ chatId, ok })
    if (ok) success++
    else failed++

    // Small delay to avoid Telegram rate limits
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return { success, failed, results }
}
