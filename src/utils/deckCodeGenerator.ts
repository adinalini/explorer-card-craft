// Deck Code Generator - JavaScript port of the C# implementation
// Copyright Notice: Based on code by Koin Games Inc.

import { cardDatabase } from './cardData'

const PREFIX_MARKER = 'KGBLDC'
const VERSION_PREFIX = 'v1'
const SEPARATOR = '|'
const CHECKSUM_SEPARATOR = ':'

/**
 * Creates a shareable Deck Code string from a list of card keys by encoding it in a specific format.
 */
export function encodeDeck(cardKeys: string[]): string | null {
  if (!cardKeys || cardKeys.length === 0) {
    return null
  }

  // Ensure all keys have a variant (default _V00000 if missing)
  const normalizedCardKeys = cardKeys.map(key =>
    key.includes('_V') ? key : key + '_V00000'
  )

  // Helpers
  const normalize = (k: string) =>
    k.includes('_V') ? k.split('_V')[0] : k

  const codeNum = (k: string) => {
    const m = normalize(k).match(/^C(\d+)/i)
    return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER
  }

  const getCardData = (cardKey: string) => {
    const normalizedKey = normalize(cardKey)
    return cardDatabase.find(
      card => card.cardKey?.split('_V')[0] === normalizedKey
    )
  }

  const isSpell = (cardKey: string) =>
    !!getCardData(cardKey)?.isSpell

  const isLegendary = (cardKey: string) =>
    !!getCardData(cardKey)?.isLegendary

  // Sort cards
  const sortedCardKeys = [...normalizedCardKeys].sort((a, b) => {
    const normA = normalize(a)
    const normB = normalize(b)

    const typeA = isLegendary(normA) ? 0 : isSpell(normA) ? 2 : 1
    const typeB = isLegendary(normB) ? 0 : isSpell(normB) ? 2 : 1

    if (typeA !== typeB) {
      return typeA - typeB
    }

    return codeNum(normA) - codeNum(normB) || normA.localeCompare(normB)
  })

  // Strip default variant suffix before encoding
  const cleanedCardKeys = sortedCardKeys.map(k =>
    k.endsWith('_V00000') ? k.split('_V')[0] : k
  )

  // Encode
  const joined = VERSION_PREFIX + SEPARATOR + cleanedCardKeys.join(SEPARATOR)

  // 🔍 Debug log: show what string is being checksummed
  console.log("ENCODE - Joined string for checksum:", JSON.stringify(joined))

  const bytes = new TextEncoder().encode(joined)
  const base64 = btoa(String.fromCharCode(...bytes))

  // Checksum
  const checksum = computeChecksum(joined)

  return PREFIX_MARKER + base64 + CHECKSUM_SEPARATOR + checksum
}

/**
 * Decodes a Deck Code string back into a list of card keys.
 */
export function decodeDeck(input: string): { cardKeys: string[] | null, errorMessage: string } {
  let errorMessage = ''

  if (!input || input.trim() === '') {
    return { cardKeys: null, errorMessage: 'Input is empty.' }
  }

  input = input.trim()
  input = input.replace(/[^\w|:+=/]+$/, '')

  const prefixIndex = input.indexOf(PREFIX_MARKER)
  if (prefixIndex < 0) {
    return { cardKeys: null, errorMessage: 'Invalid deck code format: missing prefix marker.' }
  }

  const deckCode = input.substring(prefixIndex + PREFIX_MARKER.length)
  const checksumIndex = deckCode.lastIndexOf(':')
  if (checksumIndex < 0) {
    return { cardKeys: null, errorMessage: 'Invalid deck code format: missing checksum separator.' }
  }

  const base64 = deckCode.substring(0, checksumIndex)
  const givenChecksum = deckCode.substring(checksumIndex + 1)

  try {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const joined = new TextDecoder().decode(bytes)

    // 🔍 Debug log: show the string recovered before checksum verification
    console.log("DECODE - Joined string recovered:", JSON.stringify(joined))

    const expectedChecksum = computeChecksum(joined)
    if (givenChecksum !== expectedChecksum) {
      return { cardKeys: null, errorMessage: 'Checksum mismatch: the deck code may be corrupted.' }
    }

    const tokens = joined.split('|')
    if (tokens.length < 2 || tokens[0] !== 'v1') {
      return { cardKeys: null, errorMessage: 'Unsupported or missing version prefix.' }
    }

    const cardKeys: string[] = []
    for (let i = 1; i < tokens.length; i++) {
      let cardKey = tokens[i]
      if (!cardKey.includes('_V')) {
        cardKey += '_V00000'
      }
      cardKeys.push(cardKey)
    }

    return { cardKeys, errorMessage: '' }
  } catch (e: any) {
    return { cardKeys: null, errorMessage: 'Failed to decode deck: ' + e.message }
  }
}

/**
 * Computes a hash checksum for the input string (browser-compatible)
 */
function computeChecksum(input: string): string {
  return crc32(input)
}

// CRC32 checksum (polynomial 0xEDB88320), returns 8-char lowercase hex
let CRC32_TABLE: number[] | undefined
function getCrc32Table() {
  if (CRC32_TABLE) return CRC32_TABLE
  CRC32_TABLE = new Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    }
    CRC32_TABLE[n] = c >>> 0
  }
  return CRC32_TABLE
}
function crc32(input: string): string {
  const table = getCrc32Table()
  let crc = 0 ^ -1
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i)
    crc = (crc >>> 8) ^ table[(crc ^ code) & 0xff]
  }
  const out = (crc ^ -1) >>> 0
  return out.toString(16).padStart(8, '0')
}
