// Deck Code Generator - JavaScript port of the C# implementation
// Copyright Notice: Based on code by Koin Games Inc.

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

  // Sort the card keys to ensure consistent ordering
  const sortedCardKeys = [...cardKeys].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

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
  return simpleHash(input)
}

/**
 * Simple hash function for browser compatibility
 * Uses a variation of the djb2 hash algorithm for better distribution
 */
function simpleHash(input: string): string {
  let hash = 5381 // djb2 initial value
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) + hash) + char // hash * 33 + char
    hash = hash & 0xffffffff // Keep it 32-bit
  }
  
  // Convert to 8-character hex string
  const hex = Math.abs(hash).toString(16).padStart(8, '0')
  return hex.substring(0, 8)
}