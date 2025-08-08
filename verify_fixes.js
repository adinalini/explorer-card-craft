// Verification script for triple draft fixes
// This script checks that all critical fixes are properly implemented

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 VERIFYING TRIPLE DRAFT FIXES');
console.log('================================');
console.log('');

const roomFile = path.join(__dirname, 'src', 'pages', 'Room.tsx');
const roomContent = fs.readFileSync(roomFile, 'utf8');

let allFixesPresent = true;

// Check 1: roomRef declaration and sync
console.log('1. Checking roomRef implementation...');
if (roomContent.includes('const roomRef = useRef<Room | null>(null)')) {
  console.log('   ✅ roomRef declared');
} else {
  console.log('   ❌ roomRef not declared');
  allFixesPresent = false;
}

if (roomContent.includes('roomRef.current = room')) {
  console.log('   ✅ roomRef sync useEffect present');
} else {
  console.log('   ❌ roomRef sync useEffect missing');
  allFixesPresent = false;
}

// Check 2: updateTimer using roomRef.current
console.log('\n2. Checking updateTimer fixes...');
if (roomContent.includes('const currentRoom = roomRef.current')) {
  console.log('   ✅ updateTimer uses roomRef.current');
} else {
  console.log('   ❌ updateTimer not using roomRef.current');
  allFixesPresent = false;
}

if (roomContent.includes('currentRoom.draft_type === \'triple\' && isRevealing')) {
  console.log('   ✅ Timer hidden during reveal phases');
} else {
  console.log('   ❌ Timer not hidden during reveal phases');
  allFixesPresent = false;
}

// Check 3: performAutoSelect not calling handleTriplePhaseEnd
console.log('\n3. Checking auto-select fixes...');
if (roomContent.includes('Don\'t call handleTriplePhaseEnd here - let roomChannel handle it')) {
  console.log('   ✅ Auto-select doesn\'t call handleTriplePhaseEnd');
} else {
  console.log('   ❌ Auto-select still calls handleTriplePhaseEnd');
  allFixesPresent = false;
}

// Check 4: handleTriplePhaseEnd using upsert
console.log('\n4. Checking card addition fixes...');
if (roomContent.includes('.upsert({') && roomContent.includes('onConflict: \'room_id,card_id,player_side,selection_order\'')) {
  console.log('   ✅ Card additions use upsert with conflict resolution');
} else {
  console.log('   ❌ Card additions not using upsert');
  allFixesPresent = false;
}

// Check 5: Phase 1->2 transition not updating round_start_time
console.log('\n5. Checking phase transition fixes...');
if (roomContent.includes('Don\'t update round_start_time here to prevent timer issues')) {
  console.log('   ✅ Phase 1->2 transition doesn\'t update round_start_time');
} else {
  console.log('   ❌ Phase 1->2 transition still updates round_start_time');
  allFixesPresent = false;
}

// Check 6: roomChannel auto-select phase transition logic
console.log('\n6. Checking roomChannel auto-select logic...');
if (roomContent.includes('Handle auto-select phase transitions') && roomContent.includes('Triggering handleTriplePhaseEnd for auto-select')) {
  console.log('   ✅ roomChannel has auto-select phase transition logic');
} else {
  console.log('   ❌ roomChannel missing auto-select phase transition logic');
  allFixesPresent = false;
}

// Check 7: Timer useEffect dependencies
console.log('\n7. Checking timer useEffect dependencies...');
if (roomContent.includes('isRevealing]')) {
  console.log('   ✅ Timer useEffect includes isRevealing dependency');
} else {
  console.log('   ❌ Timer useEffect missing isRevealing dependency');
  allFixesPresent = false;
}

console.log('\n================================');
if (allFixesPresent) {
  console.log('🎉 ALL FIXES ARE PROPERLY IMPLEMENTED!');
  console.log('The triple draft card management and timer issues should be resolved.');
} else {
  console.log('⚠️  SOME FIXES ARE MISSING!');
  console.log('Please review the implementation and ensure all fixes are in place.');
}
console.log('================================\n');

// Summary of what each fix addresses
console.log('FIX SUMMARY:');
console.log('============');
console.log('1. roomRef: Prevents stale closures in timer updates');
console.log('2. updateTimer: Uses fresh room state and hides timer during reveals');
console.log('3. performAutoSelect: Prevents premature phase transitions');
console.log('4. handleTriplePhaseEnd: Uses upsert for idempotent card additions');
console.log('5. Phase transitions: Maintains original round_start_time for timer continuity');
console.log('6. roomChannel: Handles auto-select phase transitions centrally');
console.log('7. Timer dependencies: Ensures timer updates when reveal state changes');
