// Deck Code Generation System
// Based on the C# implementation provided

// Create a hash function using Web Crypto API (for browser compatibility)
async function computeSHA256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  
  // Take first 4 bytes and convert to hex (8 hex characters)
  return Array.from(hashArray.slice(0, 4))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const PREFIX_MARKER = "KGBLDC";
const VERSION_PREFIX = "v1";
const SEPARATOR = "|";
const CHECKSUM_SEPARATOR = ":";

export interface DeckCodeResult {
  cardKeys?: string[];
  errorMessage?: string;
}

/**
 * Creates a shareable Deck Code string from a list of card keys
 */
export async function encodeDeck(cardKeys: string[]): Promise<string | null> {
  // Sanity check
  if (!cardKeys || cardKeys.length === 0) {
    return null;
  }

  // Sort the card keys to ensure consistent ordering
  const sortedCardKeys = [...cardKeys].sort((a, b) => 
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  // Encode the deck code
  const joined = VERSION_PREFIX + SEPARATOR + sortedCardKeys.join(SEPARATOR);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(joined);
  const base64 = btoa(String.fromCharCode(...bytes));

  // Create the checksum
  const checksum = await computeSHA256(joined);

  // Put the deck code together with the prefix and checksum
  return PREFIX_MARKER + base64 + CHECKSUM_SEPARATOR + checksum;
}

/**
 * Decodes a Deck Code string back into a list of card keys
 */
export async function decodeDeck(input: string): Promise<DeckCodeResult> {
  if (!input || !input.trim()) {
    return { errorMessage: "Input is empty." };
  }

  // Sanitize the input by removing whitespace and invalid trailing characters
  const sanitized = input.trim().replace(/[^\w|:+=/]+$/, "");

  // Locate the Prefix Marker in the input string
  const prefixIndex = sanitized.indexOf(PREFIX_MARKER);
  if (prefixIndex < 0) {
    return { errorMessage: "Invalid deck code format: missing prefix marker." };
  }

  // Extract the encoded portion starting after the Prefix Marker
  const deckCode = sanitized.substring(prefixIndex + PREFIX_MARKER.length);

  // Split off the checksum using the last colon
  const checksumIndex = deckCode.lastIndexOf(':');
  if (checksumIndex < 0) {
    return { errorMessage: "Invalid deck code format: missing checksum separator." };
  }

  const base64 = deckCode.substring(0, checksumIndex);
  const givenChecksum = deckCode.substring(checksumIndex + 1);

  try {
    // Base64 decode
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    const joined = decoder.decode(bytes);

    // Verify checksum
    const expectedChecksum = await computeSHA256(joined);
    if (givenChecksum !== expectedChecksum) {
      return { errorMessage: "Checksum mismatch: the deck code may be corrupted." };
    }

    // Validate version and extract card keys
    const tokens = joined.split('|');
    if (tokens.length < 2 || tokens[0] !== "v1") {
      return { errorMessage: "Unsupported or missing version prefix." };
    }

    const cardKeys: string[] = [];
    for (let i = 1; i < tokens.length; i++) {
      let cardKey = tokens[i];
      // Ensure it has a variant suffix if missing
      if (!cardKey.includes("_V")) {
        cardKey += "_V00000";
      }
      cardKeys.push(cardKey);
    }

    return { cardKeys };
  } catch (error) {
    return { errorMessage: `Failed to decode deck: ${error.message}` };
  }
}

/**
 * Generates a deck code from a list of card IDs using the card database
 */
export async function generateDeckCodeFromCardIds(cardIds: string[]): Promise<string | null> {
  const { getCardById } = await import('./cardData');
  
  const cardKeys: string[] = [];
  
  for (const cardId of cardIds) {
    const card = getCardById(cardId);
    if (card?.cardKey) {
      cardKeys.push(card.cardKey);
    }
  }
  
  if (cardKeys.length === 0) {
    return null;
  }
  
  return await encodeDeck(cardKeys);
}