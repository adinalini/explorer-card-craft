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
  // Sanity check
  if (!cardKeys || cardKeys.length === 0) {
    return null
  }

  // Helper functions for card key processing
  const normalize = (k: string) => (k.includes('_V') ? k.split('_V')[0] : k)
  const codeNum = (k: string) => {
    const m = normalize(k).match(/^C(\d+)/i)
    return m ? parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER
  }

  // Helper function to get card data by card key
  const getCardData = (cardKey: string) => {
    const normalizedKey = normalize(cardKey)
    return cardDatabase.find(card => card.cardKey?.split('_V')[0] === normalizedKey)
  }

  // Helper function to determine card type priority for sorting
  const getCardTypePriority = (cardKey: string) => {
    const cardData = getCardData(cardKey)
    if (!cardData) return 3 // Unknown cards go to the end
    if (cardData.isLegendary) return 0 // Legendary first
    if (cardData.isSpell) return 2 // Spells last
    return 1 // Units in the middle
  }

  // Sort by type first (legendary, units, spells), then by cost, then by card number
  const sortedCardKeys = [...cardKeys]
    .map(normalize)
    .sort((a: string, b: string) => {
      const typePriorityA = getCardTypePriority(a)
      const typePriorityB = getCardTypePriority(b)
      
      // First sort by type priority
      if (typePriorityA !== typePriorityB) {
        return typePriorityA - typePriorityB
      }
      
      // Then by cost within the same type
      const cardDataA = getCardData(a)
      const cardDataB = getCardData(b)
      const costA = cardDataA?.cost || 0
      const costB = cardDataB?.cost || 0
      
      if (costA !== costB) {
        return costA - costB
      }
      
      // Finally by card number if costs are equal
      return codeNum(a) - codeNum(b) || a.localeCompare(b)
    })

  // Encode the deck code
  const joined = VERSION_PREFIX + SEPARATOR + sortedCardKeys.join(SEPARATOR)
  const bytes = new TextEncoder().encode(joined)
  const base64 = btoa(String.fromCharCode(...bytes))

  // Create the checksum
  const checksum = computeChecksum(joined)

  // Put the deck code together with the prefix and checksum
  return PREFIX_MARKER + base64 + CHECKSUM_SEPARATOR + checksum
}

/**
 * Decodes a Deck Code string back into a list of card keys.
 */
export function decodeDeck(input: string): { cardKeys: string[] | null, errorMessage: string } {
  let errorMessage = ''

  // Verify we have valid input
  if (!input || input.trim() === '') {
    errorMessage = 'Input is empty.'
    return { cardKeys: null, errorMessage }
  }

  // Sanitize the input by removing whitespace and invalid trailing characters
  input = input.trim()
  input = input.replace(/[^\w|:+=/]+$/, '')

  // Locate the Prefix Marker in the input string
  const prefixIndex = input.indexOf(PREFIX_MARKER)
  if (prefixIndex < 0) {
    errorMessage = 'Invalid deck code format: missing prefix marker.'
    return { cardKeys: null, errorMessage }
  }

  // Extract the encoded portion starting after the Prefix Marker
  const deckCode = input.substring(prefixIndex + PREFIX_MARKER.length)

  // Split off the checksum using the last colon
  const checksumIndex = deckCode.lastIndexOf(':')
  if (checksumIndex < 0) {
    errorMessage = 'Invalid deck code format: missing checksum separator.'
    return { cardKeys: null, errorMessage }
  }

  const base64 = deckCode.substring(0, checksumIndex)
  const givenChecksum = deckCode.substring(checksumIndex + 1)

  try {
    // Base64 decode and verify checksum
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const joined = new TextDecoder().decode(bytes)

    const expectedChecksum = computeChecksum(joined)
    if (givenChecksum !== expectedChecksum) {
      errorMessage = 'Checksum mismatch: the deck code may be corrupted.'
      return { cardKeys: null, errorMessage }
    }

    // Validate version and extract card keys
    const tokens = joined.split('|')
    if (tokens.length < 2 || tokens[0] !== 'v1') {
      errorMessage = 'Unsupported or missing version prefix.'
      return { cardKeys: null, errorMessage }
    }

    const cardKeys: string[] = []
    for (let i = 1; i < tokens.length; i++) {
      let cardKey = tokens[i]
      if (!cardKey.includes('_V')) {
        cardKey += '_V00000' // Ensure it has a variant suffix if missing
      }
      cardKeys.push(cardKey)
    }

    return { cardKeys, errorMessage: '' }
  } catch (e: any) {
    errorMessage = 'Failed to decode deck: ' + e.message
    return { cardKeys: null, errorMessage }
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