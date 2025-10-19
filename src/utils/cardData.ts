// Card data with imports for all available cards
const cardImports = {
  'ali_baba': () => import('@/assets/cards/ali_baba.png'),
  'alice': () => import('@/assets/cards/alice.png'),
  'axe_throw': () => import('@/assets/cards/axe_throw.png'),
  
  'bandersnatch': () => import('@/assets/cards/bandersnatch.png'),
  'banshee': () => import('@/assets/cards/banshee.png'),
  'baloo': () => import('@/assets/cards/baloo.png'),
  'beast': () => import('@/assets/cards/beast.png'),
  'beautiful_swan': () => import('@/assets/cards/beautiful_swan.png'),
  'big_bad_wolf': () => import('@/assets/cards/big_bad_wolf.png'),
  'billy': () => import('@/assets/cards/billy.png'),
  'black_knight': () => import('@/assets/cards/black_knight.png'),
  'blow_the_house_down': () => import('@/assets/cards/blow_the_house_down.png'),
  'bridge_troll': () => import('@/assets/cards/bridge_troll.png'),
  'bullseye': () => import('@/assets/cards/bullseye.png'),
  'card_soldier': () => import('@/assets/cards/card_soldier.png'),
  'cheshire': () => import('@/assets/cards/cheshire.png'),
  'concentrate': () => import('@/assets/cards/concentrate.png'),
  'cowardly_lion': () => import('@/assets/cards/cowardly_lion.png'),
  'dark_omen': () => import('@/assets/cards/Dark Omen.png'),
  'death': () => import('@/assets/cards/death.png'),
  'defense_matrix': () => import('@/assets/cards/defense_matrix.png'),
  'don_quixote': () => import('@/assets/cards/don_quixote.png'),
  'dorothy': () => import('@/assets/cards/dorothy.png'),
  'dr_frank': () => import('@/assets/cards/dr_frank.png'),
  'dracula': () => import('@/assets/cards/dracula.png'),
  'en_passant': () => import('@/assets/cards/en_passant.png'),
  'fairy_godmother': () => import('@/assets/cards/fairy_godmother.png'),
  'flying_monkey': () => import('@/assets/cards/flying_monkey.png'),
  'franks_monster': () => import('@/assets/cards/franks_monster.png'),
  'freeze': () => import('@/assets/cards/freeze.png'),
  'tuck': () => import('@/assets/cards/Tuck.png'),
  'galahad': () => import('@/assets/cards/galahad.png'),
  'jacks_giant': () => import('@/assets/cards/jacks_giant.png'),
  'glinda': () => import('@/assets/cards/glinda.png'),
  'golden_egg': () => import('@/assets/cards/golden_egg.png'),
  'golden_goose': () => import('@/assets/cards/golden_goose.png'),
  'goldi': () => import('@/assets/cards/Goldi.png'),
  'grendel': () => import('@/assets/cards/grendel.png'),
  'guy_of_gisborne': () => import('@/assets/cards/guy_of_gisborne.png'),
  'headless_horseman': () => import('@/assets/cards/headless_horseman.png'),
  'heroic_charge': () => import('@/assets/cards/heroic_charge.png'),
  'huntsman': () => import('@/assets/cards/huntsman.png'),
  'hyde': () => import('@/assets/cards/hyde.png'),
  'imhotep': () => import('@/assets/cards/imhotep.png'),
  'its_alive': () => import('@/assets/cards/its_alive.png'),
  'jack': () => import('@/assets/cards/jack.png'),
  'jack_in_the_box': () => import('@/assets/cards/jack_in_the_box.png'),
  'jekyll': () => import('@/assets/cards/jekyll.png'),
  'kanga': () => import('@/assets/cards/kanga.png'),
  'king_arthur': () => import('@/assets/cards/king_arthur.png'),
  'king_shahryar': () => import('@/assets/cards/king_shahryar.png'),
  'lady_of_the_lake': () => import('@/assets/cards/lady_of_the_lake.png'),
  'lancelot': () => import('@/assets/cards/lancelot.png'),
  'legion_of_the_dead': () => import('@/assets/cards/legion_of_the_dead.png'),
  'lightning_strike': () => import('@/assets/cards/lightning_strike.png'),
  'little_john': () => import('@/assets/cards/little_john.png'),
  'mad_hatter': () => import('@/assets/cards/mad_hatter.png'),
  'marian': () => import('@/assets/cards/marian.png'),
  'merlin': () => import('@/assets/cards/merlin.png'),
  'moby': () => import('@/assets/cards/moby.png'),
  'morgiana': () => import('@/assets/cards/morgiana.png'),
  'moriarty': () => import('@/assets/cards/moriarty.png'),
  'mouse': () => import('@/assets/cards/mouse.png'),
  'mowgli': () => import('@/assets/cards/mowgli.png'),
  'mummy': () => import('@/assets/cards/mummy.png'),
  'musketeer': () => import('@/assets/cards/musketeer.png'),
  'not_so_little_pig': () => import('@/assets/cards/not_so_little_pig.png'),
  'ogre': () => import('@/assets/cards/ogre.png'),
  'pegasus': () => import('@/assets/cards/pegasus.png'),
  'phantom_coachman': () => import('@/assets/cards/phantom_coachman.png'),
  'piggy_bank': () => import('@/assets/cards/piggy_bank.png'),
  'prince_charming': () => import('@/assets/cards/prince_charming.png'),
  'princess_aurora': () => import('@/assets/cards/princess_aurora.png'),
  'quasimodo': () => import('@/assets/cards/quasimodo.png'),
  'queen_guinevere': () => import('@/assets/cards/queen_guinevere.png'),
  'rain_of_arrows': () => import('@/assets/cards/Rai_of_arrows.png'),
  'red': () => import('@/assets/cards/red.png'),
  'red_cap': () => import('@/assets/cards/Red_cap.png'),
  'reinforcements': () => import('@/assets/cards/reinforcements.png'),
  'robinhood': () => import('@/assets/cards/Robinhood.png'),
  'roo': () => import('@/assets/cards/roo.png'),
  'rumple': () => import('@/assets/cards/rumple.png'),
  'scarecrow': () => import('@/assets/cards/scarecrow.png'),
  'scorpion': () => import('@/assets/cards/scorpion.png'),
  'sea_witch': () => import('@/assets/cards/sea_witch.png'),
  'searing_light': () => import('@/assets/cards/searing_light.png'),
  'sheriff_of_nottingham': () => import('@/assets/cards/sheriff_of_nottingham.png'),
  'sherlock': () => import('@/assets/cards/sherlock.png'),
  'shield_maiden': () => import('@/assets/cards/shield_maiden.png'),
  'siren': () => import('@/assets/cards/siren.png'),
  'snow_white': () => import('@/assets/cards/snow_white.png'),
  'soldier': () => import('@/assets/cards/soldier.png'),
  'soul_surge': () => import('@/assets/cards/soul_surge.png'),
  'stryga': () => import('@/assets/cards/stryga.png'),
  'the_green_knight': () => import('@/assets/cards/the_green_knight.png'),
  'the_kraken': () => import('@/assets/cards/the_kraken.png'),
  'the_white_queen': () => import('@/assets/cards/the_white_queen.png'),
  'three_blind_mice': () => import('@/assets/cards/three_blind_mice.png'),
  'three_musketeers': () => import('@/assets/cards/three_musketeers.png'),
  'three_not_so_little_pigs': () => import('@/assets/cards/three_not_so_little_pigs.png'),
  'tin_woodman': () => import('@/assets/cards/tin_woodman.png'),
  'trash_for_treasure': () => import('@/assets/cards/trash_for_treasure.png'),
  'trojan_horse': () => import('@/assets/cards/trojan_horse.png'),
  'twister_toss': () => import('@/assets/cards/twister_toss.png'),
  'ugly_duckling': () => import('@/assets/cards/ugly_duckling.png'),
  'underworld_flare': () => import('@/assets/cards/underworld_flare.png'),
  'watson': () => import('@/assets/cards/watson.png'),
  'white_rabbit': () => import('@/assets/cards/white_rabbit.png'),
  'wicked_witch_of_the_west': () => import('@/assets/cards/wicked_witch_of_the_west.png'),
  'zorro': () => import('@/assets/cards/zorro.png'),
  'tin_soldier': () => import('@/assets/cards/tin_soldier.png'),
  'hansel_gretel': () => import('@/assets/cards/hansel_gretel.png'),
  'beauty': () => import('@/assets/cards/beauty.png'),
  'wendy': () => import('@/assets/cards/wendy.png'),
  'baba_yaga': () => import('@/assets/cards/baba_yaga.png'),
  'christopher': () => import('@/assets/cards/christopher.png'),
  'wukong': () => import('@/assets/cards/wukong.png'),
  'genie': () => import('@/assets/cards/genie.png'),
  'paul_bunyan': () => import('@/assets/cards/paul_bunyan.png'),
  // New cards added in October 2025 patch
  'animated_broomstick': () => import('@/assets/cards/Animated_Broomstick.png'),
  'babe_the_blue_ox': () => import('@/assets/cards/Babe_the_blue_ox.png'),
  'baby_bear': () => import('@/assets/cards/Baby_Bear.png'),
  'bagheera': () => import('@/assets/cards/Bagheera.png'),
  'baker': () => import('@/assets/cards/Baker.png'),
  'bigfoot': () => import('@/assets/cards/Bigfoot.png'),
  'brandy': () => import('@/assets/cards/Brandy.png'),
  'butcher': () => import('@/assets/cards/Butcher.png'),
  'cake': () => import('@/assets/cards/Cake.png'),
  'captain_ahab': () => import('@/assets/cards/Captain_Ahab.png'),
  'cerberus': () => import('@/assets/cards/Cerberus.png'),
  'chimera': () => import('@/assets/cards/Chimera.png'),
  'drop_bear': () => import('@/assets/cards/Drop_Bear.png'),
  'first_aid': () => import('@/assets/cards/First_Aid.png'),
  'flying_dutchman': () => import('@/assets/cards/Flying_Dutchman.png'),
  'hare': () => import('@/assets/cards/Hare.png'),
  'hercules': () => import('@/assets/cards/Hercules.png'),
  'huck_finn': () => import('@/assets/cards/Huck_Finn.png'),
  'impundulu': () => import('@/assets/cards/Impundulu.png'),
  'koschei': () => import('@/assets/cards/KOschei.png'),
  'mary': () => import('@/assets/cards/Mary.png'),
  'momotaro': () => import('@/assets/cards/Momotaro.png'),
  'morgan_le_fay': () => import('@/assets/cards/Morgan_le_Fay.png'),
  'mortal_coil': () => import('@/assets/cards/Mortal_Coil.png'),
  'mothman': () => import('@/assets/cards/Mothman.png'),
  'obliterate': () => import('@/assets/cards/Obliterate.png'),
  'piglet': () => import('@/assets/cards/Piglet.png'),
  'popeye': () => import('@/assets/cards/Popeye.png'),
  'run_over': () => import('@/assets/cards/Run_Over.png'),
  'sandman': () => import('@/assets/cards/Sandman.png'),
  'sinbad': () => import('@/assets/cards/Sinbad.png'),
  'thumbelina': () => import('@/assets/cards/Thumbelina.png'),
  'tinker_bell': () => import('@/assets/cards/Tinker_Bell.png'),
  'tortoise': () => import('@/assets/cards/Tortoise.png'),
  'wicked_stepmother': () => import('@/assets/cards/Wicked_Stepmother.png'),
  'winnie_the_pooh': () => import('@/assets/cards/Winnie_the_pooh.png'),
  'yuki_onna': () => import('@/assets/cards/Yuki_onna.png'),
}

export interface Card {
  id: string
  name: string
  image: string
  isLegendary: boolean
  cost?: number
  isSpell?: boolean
  cardKey?: string // Card key for deck code generation
  inDraftPool?: boolean // Whether this card is in the draft selection pool
}

// Card database with cost, spell status, and legendary information
// Cards marked with inDraftPool: false are NOT available in draft/random selections yet
export const cardDatabase: Card[] = [
  // Existing cards that are in draft pool
  { id: 'bandersnatch', name: 'Bandersnatch', image: '/src/assets/cards/bandersnatch.png', isLegendary: false, cost: 8, isSpell: false, cardKey: 'C00009_MB', inDraftPool: true },
  { id: 'blow_the_house_down', name: 'Blow the House Down', image: '/src/assets/cards/blow_the_house_down.png', isLegendary: false, cost: 7, isSpell: true, cardKey: 'C00162_SB', inDraftPool: true },
  { id: 'death', name: 'Death', image: '/src/assets/cards/death.png', isLegendary: true, cost: 5, isSpell: false, cardKey: 'C00059_MC', inDraftPool: true },
  { id: 'fairy_godmother', name: 'Fairy Godmother', image: '/src/assets/cards/fairy_godmother.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00023_MB', inDraftPool: true },
  { id: 'grendel', name: 'Grendel', image: '/src/assets/cards/grendel.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00139_MB', inDraftPool: true },
  { id: 'heroic_charge', name: 'Heroic Charge', image: '/src/assets/cards/heroic_charge.png', isLegendary: false, cost: 6, isSpell: true, cardKey: 'C00108_SB', inDraftPool: true },
  { id: 'king_arthur', name: 'King Arthur', image: '/src/assets/cards/king_arthur.png', isLegendary: true, cost: 7, isSpell: false, cardKey: 'C00012_MC', inDraftPool: true },
  { id: 'legion_of_the_dead', name: 'Legion of the Dead', image: '/src/assets/cards/legion_of_the_dead.png', isLegendary: true, cost: 7, isSpell: true, cardKey: 'C00042_SC', inDraftPool: true },
  { id: 'merlin', name: 'Merlin', image: '/src/assets/cards/merlin.png', isLegendary: true, cost: 6, isSpell: false, cardKey: 'C00075_MC', inDraftPool: true },
  { id: 'mowgli', name: 'Mowgli', image: '/src/assets/cards/mowgli.png', isLegendary: false, cost: 6, isSpell: false, cardKey: 'C00126_MB', inDraftPool: true },
  { id: 'robinhood', name: 'Robin Hood', image: '/src/assets/cards/Robinhood.png', isLegendary: true, cost: 5, isSpell: false, cardKey: 'C00065_MC', inDraftPool: true },
  { id: 'snow_white', name: 'Snow White', image: '/src/assets/cards/snow_white.png', isLegendary: true, cost: 7, isSpell: false, cardKey: 'C00117_MC', inDraftPool: true },
  { id: 'the_green_knight', name: 'The Green Knight', image: '/src/assets/cards/the_green_knight.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00136_MB', inDraftPool: true },
  { id: 'three_musketeers', name: 'Three Musketeers', image: '/src/assets/cards/three_musketeers.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00072_MB', inDraftPool: true },
  { id: 'baloo', name: 'Baloo', image: '/src/assets/cards/baloo.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00125_MB', inDraftPool: true },
  { id: 'beast', name: 'Beast', image: '/src/assets/cards/beast.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00109_MB', inDraftPool: true },
  { id: 'bridge_troll', name: 'Bridge Troll', image: '/src/assets/cards/bridge_troll.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00160_MB', inDraftPool: true },
  { id: 'cheshire', name: 'Cheshire Cat', image: '/src/assets/cards/cheshire.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00004_MB', inDraftPool: true },
  { id: 'dark_omen', name: 'Dark Omen', image: '/src/assets/cards/Dark Omen.png', isLegendary: false, cost: 4, isSpell: true, cardKey: 'C00028_SB', inDraftPool: true },
  { id: 'dorothy', name: 'Dorothy', image: '/src/assets/cards/dorothy.png', isLegendary: true, cost: 5, isSpell: false, cardKey: 'C00063_MC', inDraftPool: true },
  { id: 'dracula', name: 'Dracula', image: '/src/assets/cards/dracula.png', isLegendary: true, cost: 4, isSpell: false, cardKey: 'C00118_MC', inDraftPool: true },
  { id: 'galahad', name: 'Sir Galahad', image: '/src/assets/cards/galahad.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00019_MB', inDraftPool: true },
  { id: 'jacks_giant', name: "Jack's Giant", image: '/src/assets/cards/jacks_giant.png', isLegendary: false, cost: 6, isSpell: false, cardKey: 'C00007_MB', inDraftPool: true },
  { id: 'glinda', name: 'Glinda', image: '/src/assets/cards/glinda.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00022_MB', inDraftPool: true },
  { id: 'goldi', name: 'Goldilocks', image: '/src/assets/cards/Goldi.png', isLegendary: true, cost: 4, isSpell: false, cardKey: 'C00067_MC', inDraftPool: true },
  { id: 'headless_horseman', name: 'Headless Horseman', image: '/src/assets/cards/headless_horseman.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00091_MB', inDraftPool: true },
  { id: 'imhotep', name: 'Imhotep', image: '/src/assets/cards/imhotep.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00036_MB', inDraftPool: true },
  { id: 'jack_in_the_box', name: 'Jack in the Box', image: '/src/assets/cards/jack_in_the_box.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00159_MB', inDraftPool: true },
  { id: 'jekyll', name: 'Dr. Jekyll', image: '/src/assets/cards/jekyll.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00070_MB', inDraftPool: true },
  { id: 'moby', name: 'Moby Dick', image: '/src/assets/cards/moby.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00049_MB', inDraftPool: true },
  { id: 'phantom_coachman', name: 'Phantom Coachman', image: '/src/assets/cards/phantom_coachman.png', isLegendary: false, cost: 10, isSpell: false, cardKey: 'C00038_MB', inDraftPool: true },
  { id: 'queen_guinevere', name: 'Queen Guinevere', image: '/src/assets/cards/queen_guinevere.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00156_MB', inDraftPool: true },
  { id: 'the_kraken', name: 'The Kraken', image: '/src/assets/cards/the_kraken.png', isLegendary: false, cost: 8, isSpell: false, cardKey: 'C00153_MB', inDraftPool: true },
  { id: 'three_not_so_little_pigs', name: 'Three Not So Little Pigs', image: '/src/assets/cards/three_not_so_little_pigs.png', isLegendary: true, cost: 7, isSpell: false, cardKey: 'C00046_MC', inDraftPool: true },
  { id: 'tin_woodman', name: 'Tin Woodman', image: '/src/assets/cards/tin_woodman.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00094_MB', inDraftPool: true },
  { id: 'trojan_horse', name: 'Trojan Horse', image: '/src/assets/cards/trojan_horse.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00034_MB', inDraftPool: true },
  { id: 'jack', name: 'Jack', image: '/src/assets/cards/jack.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00110_MB', inDraftPool: true },
  { id: 'kanga', name: 'Kanga', image: '/src/assets/cards/kanga.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00101_MB', inDraftPool: true },
  { id: 'king_shahryar', name: 'King Shahryar', image: '/src/assets/cards/king_shahryar.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00121_MB', inDraftPool: true },
  { id: 'lady_of_the_lake', name: 'Lady of the Lake', image: '/src/assets/cards/lady_of_the_lake.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00168_MB', inDraftPool: true },
  { id: 'lancelot', name: 'Sir Lancelot', image: '/src/assets/cards/lancelot.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00047_MB', inDraftPool: true },
  { id: 'lightning_strike', name: 'Lightning Strike', image: '/src/assets/cards/lightning_strike.png', isLegendary: false, cost: 3, isSpell: true, cardKey: 'C00060_SB', inDraftPool: true },
  { id: 'little_john', name: 'Little John', image: '/src/assets/cards/little_john.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00074_MB', inDraftPool: true },
  { id: 'marian', name: 'Maid Marian', image: '/src/assets/cards/marian.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00068_MB', inDraftPool: true },
  { id: 'moriarty', name: 'Professor Moriarty', image: '/src/assets/cards/moriarty.png', isLegendary: false, cost: 7, isSpell: false, cardKey: 'C00055_MB', inDraftPool: true },
  { id: 'mummy', name: 'Mummy', image: '/src/assets/cards/mummy.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00031_MB', inDraftPool: true },
  { id: 'piggy_bank', name: 'Piggy Bank', image: '/src/assets/cards/piggy_bank.png', isLegendary: false, cost: 3, isSpell: true, cardKey: 'C00161_SB', inDraftPool: true },
  { id: 'princess_aurora', name: 'Princess Aurora', image: '/src/assets/cards/princess_aurora.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00157_MB', inDraftPool: true },
  { id: 'rain_of_arrows', name: 'Rain of Arrows', image: '/src/assets/cards/Rai_of_arrows.png', isLegendary: false, cost: 4, isSpell: true, cardKey: 'C00096_SB', inDraftPool: true },
  { id: 'red', name: 'Little Red Riding Hood', image: '/src/assets/cards/red.png', isLegendary: true, cost: 3, isSpell: false, cardKey: 'C00069_MC', inDraftPool: true },
  { id: 'scorpion', name: 'Scorpion', image: '/src/assets/cards/scorpion.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00164_MB', inDraftPool: true },
  { id: 'sea_witch', name: 'Sea Witch', image: '/src/assets/cards/sea_witch.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00111_MB', inDraftPool: true },
  { id: 'sheriff_of_nottingham', name: 'Sheriff of Nottingham', image: '/src/assets/cards/sheriff_of_nottingham.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00083_MB', inDraftPool: true },
  { id: 'sherlock', name: 'Sherlock Holmes', image: '/src/assets/cards/sherlock.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00008_MB', inDraftPool: true },
  { id: 'shield_maiden', name: 'Shield Maiden', image: '/src/assets/cards/shield_maiden.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00018_MB', inDraftPool: true },
  { id: 'siren', name: 'Siren', image: '/src/assets/cards/siren.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00123_MB', inDraftPool: true },
  { id: 'stryga', name: 'Stryga', image: '/src/assets/cards/stryga.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00122_MB', inDraftPool: true },
  { id: 'wicked_witch_of_the_west', name: 'Wicked Witch of the West', image: '/src/assets/cards/wicked_witch_of_the_west.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00100_MB', inDraftPool: true },
  { id: 'zorro', name: 'Zorro', image: '/src/assets/cards/zorro.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00035_MB', inDraftPool: true },
  { id: 'alice', name: 'Alice', image: '/src/assets/cards/alice.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00099_MB', inDraftPool: true },
  { id: 'axe_throw', name: 'Axe Throw', image: '/src/assets/cards/axe_throw.png', isLegendary: false, cost: 3, isSpell: true, cardKey: 'C00015_SB', inDraftPool: true },
  { id: 'banshee', name: 'Banshee', image: '/src/assets/cards/banshee.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00029_MB', inDraftPool: true },
  { id: 'big_bad_wolf', name: 'Big Bad Wolf', image: '/src/assets/cards/big_bad_wolf.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00021_MB', inDraftPool: true },
  { id: 'black_knight', name: 'Black Knight', image: '/src/assets/cards/black_knight.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00006_MB', inDraftPool: true },
  { id: 'bullseye', name: 'Bullseye', image: '/src/assets/cards/bullseye.png', isLegendary: false, cost: 2, isSpell: true, cardKey: 'C00013_SB', inDraftPool: true },
  { id: 'concentrate', name: 'Concentrate', image: '/src/assets/cards/concentrate.png', isLegendary: false, cost: 2, isSpell: true, cardKey: 'C00163_SB', inDraftPool: true },
  { id: 'cowardly_lion', name: 'Cowardly Lion', image: '/src/assets/cards/cowardly_lion.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00095_MB', inDraftPool: true },
  { id: 'dr_frank', name: 'Dr. Frankenstein', image: '/src/assets/cards/dr_frank.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00020_MB', inDraftPool: true },
  { id: 'en_passant', name: 'En Passant', image: '/src/assets/cards/en_passant.png', isLegendary: false, cost: 3, isSpell: true, cardKey: 'C00102_SB', inDraftPool: true },
  { id: 'flying_monkey', name: 'Flying Monkey', image: '/src/assets/cards/flying_monkey.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00033_MB', inDraftPool: true },
  { id: 'golden_egg', name: 'Golden Egg', image: '/src/assets/cards/golden_egg.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00048_MB', inDraftPool: true },
  { id: 'guy_of_gisborne', name: 'Guy of Gisborne', image: '/src/assets/cards/guy_of_gisborne.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00003_MB', inDraftPool: true },
  { id: 'huntsman', name: 'Huntsman', image: '/src/assets/cards/huntsman.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00017_MB', inDraftPool: true },
  { id: 'its_alive', name: "It's Alive!", image: '/src/assets/cards/its_alive.png', isLegendary: false, cost: 3, isSpell: true, cardKey: 'C00027_SB', inDraftPool: true },
  { id: 'mad_hatter', name: 'Mad Hatter', image: '/src/assets/cards/mad_hatter.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00005_MB', inDraftPool: true },
  { id: 'morgiana', name: 'Morgiana', image: '/src/assets/cards/morgiana.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00144_MB', inDraftPool: true },
  { id: 'red_cap', name: 'Redcap', image: '/src/assets/cards/Red_cap.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00165_MB', inDraftPool: true },
  { id: 'roo', name: 'Roo', image: '/src/assets/cards/roo.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00103_MB', inDraftPool: true },
  { id: 'scarecrow', name: 'Scarecrow', image: '/src/assets/cards/scarecrow.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00155_MB', inDraftPool: true },
  { id: 'the_white_queen', name: 'The White Queen', image: '/src/assets/cards/the_white_queen.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00107_MB', inDraftPool: true },
  { id: 'ali_baba', name: 'Ali Baba', image: '/src/assets/cards/ali_baba.png', isLegendary: false, cost: 1, isSpell: false, cardKey: 'C00143_MB', inDraftPool: true },
  { id: 'billy', name: 'Billy', image: '/src/assets/cards/billy.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00032_MB', inDraftPool: true },
  { id: 'card_soldier', name: 'Card Soldier', image: '/src/assets/cards/card_soldier.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00054_MB', inDraftPool: true },
  { id: 'defense_matrix', name: 'Defense Matrix', image: '/src/assets/cards/defense_matrix.png', isLegendary: false, cost: 1, isSpell: true, cardKey: 'C00062_SB', inDraftPool: true },
  { id: 'don_quixote', name: 'Don Quixote', image: '/src/assets/cards/don_quixote.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00142_MB', inDraftPool: true },
  { id: 'freeze', name: 'Freeze', image: '/src/assets/cards/freeze.png', isLegendary: false, cost: 1, isSpell: true, cardKey: 'C00124_SB', inDraftPool: true },
  { id: 'tuck', name: 'Friar Tuck', image: '/src/assets/cards/Tuck.png', isLegendary: false, cost: 1, isSpell: false, cardKey: 'C00001_MB', inDraftPool: true },
  { id: 'ogre', name: 'Ogre', image: '/src/assets/cards/ogre.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00166_MB', inDraftPool: true },
  { id: 'pegasus', name: 'Pegasus', image: '/src/assets/cards/pegasus.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00052_MB', inDraftPool: true },
  { id: 'prince_charming', name: 'Prince Charming', image: '/src/assets/cards/prince_charming.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00158_MB', inDraftPool: true },
  { id: 'quasimodo', name: 'Quasimodo', image: '/src/assets/cards/quasimodo.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00119_MB', inDraftPool: true },
  { id: 'reinforcements', name: 'Reinforcements', image: '/src/assets/cards/reinforcements.png', isLegendary: false, cost: 1, isSpell: true, cardKey: 'C00014_SB', inDraftPool: true },
  { id: 'rumple', name: 'Rumpelstiltskin', image: '/src/assets/cards/rumple.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00016_MB', inDraftPool: true },
  { id: 'searing_light', name: 'Searing Light', image: '/src/assets/cards/searing_light.png', isLegendary: false, cost: 0, isSpell: true, cardKey: 'C00026_SB', inDraftPool: true },
  { id: 'soul_surge', name: 'Soul Surge', image: '/src/assets/cards/soul_surge.png', isLegendary: false, cost: 2, isSpell: true, cardKey: 'C00044_SB', inDraftPool: true },
  { id: 'three_blind_mice', name: 'Three Blind Mice', image: '/src/assets/cards/three_blind_mice.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00002_MB', inDraftPool: true },
  { id: 'trash_for_treasure', name: 'Trash for Treasure', image: '/src/assets/cards/trash_for_treasure.png', isLegendary: false, cost: 1, isSpell: true, cardKey: 'C00169_SB', inDraftPool: true },
  { id: 'twister_toss', name: 'Twister Toss', image: '/src/assets/cards/twister_toss.png', isLegendary: false, cost: 1, isSpell: true, cardKey: 'C00061_SB', inDraftPool: true },
  { id: 'ugly_duckling', name: 'Ugly Duckling', image: '/src/assets/cards/ugly_duckling.png', isLegendary: false, cost: 1, isSpell: false, cardKey: 'C00030_MB', inDraftPool: true },
  { id: 'underworld_flare', name: 'Underworld Flare', image: '/src/assets/cards/underworld_flare.png', isLegendary: false, cost: 2, isSpell: true, cardKey: 'C00043_SB', inDraftPool: true },
  { id: 'white_rabbit', name: 'White Rabbit', image: '/src/assets/cards/white_rabbit.png', isLegendary: false, cost: 1, isSpell: false, cardKey: 'C00051_MB', inDraftPool: true },
  { id: 'tin_soldier', name: 'Tin Soldier', image: '/src/assets/cards/tin_soldier.png', isLegendary: false, cost: 1, isSpell: false, cardKey: 'C00191_MB', inDraftPool: true },
  { id: 'hansel_gretel', name: 'Hansel & Gretel', image: '/src/assets/cards/hansel_gretel.png', isLegendary: false, cost: 2, isSpell: false, cardKey: 'C00152_MB', inDraftPool: true },
  { id: 'beauty', name: 'Beauty', image: '/src/assets/cards/beauty.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00173_MB', inDraftPool: true },
  { id: 'wendy', name: 'Wendy', image: '/src/assets/cards/wendy.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00192_MB', inDraftPool: true },
  { id: 'baba_yaga', name: 'Baba Yaga', image: '/src/assets/cards/baba_yaga.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00138_MB', inDraftPool: true },
  { id: 'christopher', name: 'Christopher Robin', image: '/src/assets/cards/christopher.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00193_MB', inDraftPool: true },
  { id: 'wukong', name: 'Sun Wukong', image: '/src/assets/cards/wukong.png', isLegendary: true, cost: 4, isSpell: false, cardKey: 'C00097_MC', inDraftPool: true },
  { id: 'genie', name: 'Genie', image: '/src/assets/cards/genie.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00120_MB', inDraftPool: true },
  { id: 'paul_bunyan', name: 'Paul Bunyan', image: '/src/assets/cards/paul_bunyan.png', isLegendary: false, cost: 7, isSpell: false, cardKey: 'C00194_MB', inDraftPool: true },
  
  // New cards added in October 2025 patch (NOT in draft pool yet)
  { id: 'huck_finn', name: 'Huck Finn', image: '/src/assets/cards/Huck_Finn.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00191_MB', inDraftPool: false },
  { id: 'bagheera', name: 'Bagheera', image: '/src/assets/cards/Bagheera.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00245_MB', inDraftPool: false },
  { id: 'bigfoot', name: 'Bigfoot', image: '/src/assets/cards/Bigfoot.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00258_MB', inDraftPool: false },
  { id: 'thumbelina', name: 'Thumbelina', image: '/src/assets/cards/Thumbelina.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00198_MB', inDraftPool: false },
  { id: 'hare', name: 'Hare', image: '/src/assets/cards/Hare.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00184_MB', inDraftPool: false },
  { id: 'tortoise', name: 'Tortoise', image: '/src/assets/cards/Tortoise.png', isLegendary: false, cost: 3, isSpell: false, cardKey: 'C00183_MB', inDraftPool: false },
  { id: 'babe_the_blue_ox', name: 'Babe the Blue Ox', image: '/src/assets/cards/Babe_the_blue_ox.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00203_MB', inDraftPool: false },
  { id: 'baby_bear', name: 'Baby Bear', image: '/src/assets/cards/Baby_Bear.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00147_MB', inDraftPool: false },
  { id: 'mary', name: 'Mary', image: '/src/assets/cards/Mary.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00208_MB', inDraftPool: false },
  { id: 'piglet', name: 'Piglet', image: '/src/assets/cards/Piglet.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00199_MB', inDraftPool: false },
  { id: 'wicked_stepmother', name: 'Wicked Stepmother', image: '/src/assets/cards/Wicked_Stepmother.png', isLegendary: false, cost: 4, isSpell: false, cardKey: 'C00175_MB', inDraftPool: false },
  { id: 'captain_ahab', name: 'Captain Ahab', image: '/src/assets/cards/Captain_Ahab.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00261_MB', inDraftPool: false },
  { id: 'sinbad', name: 'Sinbad', image: '/src/assets/cards/Sinbad.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00214_MB', inDraftPool: false },
  { id: 'butcher', name: 'Butcher', image: '/src/assets/cards/Butcher.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00229_MB', inDraftPool: false },
  { id: 'baker', name: 'Baker', image: '/src/assets/cards/Baker.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00259_MB', inDraftPool: false },
  { id: 'mothman', name: 'Mothman', image: '/src/assets/cards/Mothman.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00263_MB', inDraftPool: false },
  { id: 'yuki_onna', name: 'Yuki-onna', image: '/src/assets/cards/Yuki_onna.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00179_MB', inDraftPool: false },
  { id: 'impundulu', name: 'Impundulu', image: '/src/assets/cards/Impundulu.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00230_MB', inDraftPool: false },
  { id: 'sandman', name: 'Sandman', image: '/src/assets/cards/Sandman.png', isLegendary: false, cost: 5, isSpell: false, cardKey: 'C00275_MB', inDraftPool: false },
  { id: 'chimera', name: 'Chimera', image: '/src/assets/cards/Chimera.png', isLegendary: false, cost: 6, isSpell: false, cardKey: 'C00274_MB', inDraftPool: false },
  { id: 'koschei', name: 'Koschei', image: '/src/assets/cards/KOschei.png', isLegendary: false, cost: 6, isSpell: false, cardKey: 'C00132_MB', inDraftPool: false },
  { id: 'morgan_le_fay', name: 'Morgan le Fay', image: '/src/assets/cards/Morgan_le_Fay.png', isLegendary: false, cost: 6, isSpell: false, cardKey: 'C00056_MB', inDraftPool: false },
  { id: 'momotaro', name: 'Momotaro', image: '/src/assets/cards/Momotaro.png', isLegendary: false, cost: 6, isSpell: false, cardKey: 'C00128_MB', inDraftPool: false },
  { id: 'tinker_bell', name: 'Tinker Bell', image: '/src/assets/cards/Tinker_Bell.png', isLegendary: false, cost: 6, isSpell: false, cardKey: 'C00053_MB', inDraftPool: false },
  { id: 'flying_dutchman', name: 'The Flying Dutchman', image: '/src/assets/cards/Flying_Dutchman.png', isLegendary: false, cost: 7, isSpell: false, cardKey: 'C00233_MB', inDraftPool: false },
  { id: 'popeye', name: 'Popeye', image: '/src/assets/cards/Popeye.png', isLegendary: false, cost: 7, isSpell: false, cardKey: 'C00282_MC', inDraftPool: false },
  { id: 'hercules', name: 'Hercules', image: '/src/assets/cards/Hercules.png', isLegendary: false, cost: 8, isSpell: false, inDraftPool: false },
  { id: 'cerberus', name: 'Cerberus', image: '/src/assets/cards/Cerberus.png', isLegendary: false, cost: 8, isSpell: false, inDraftPool: false },
  { id: 'drop_bear', name: 'Drop Bear', image: '/src/assets/cards/Drop_Bear.png', isLegendary: false, cost: 8, isSpell: false, cardKey: 'C00226_MB', inDraftPool: false },
  { id: 'winnie_the_pooh', name: 'Winnie the Pooh', image: '/src/assets/cards/Winnie_the_pooh.png', isLegendary: true, cost: 5, isSpell: false, cardKey: 'C00084_MC', inDraftPool: false },
  { id: 'brandy', name: 'Brandy', image: '/src/assets/cards/Brandy.png', isLegendary: true, cost: 6, isSpell: false, cardKey: 'C00282_MC', inDraftPool: false },
  { id: 'cake', name: 'Cake', image: '/src/assets/cards/Cake.png', isLegendary: false, cost: 2, isSpell: true, cardKey: 'C00206_SB', inDraftPool: false },
  { id: 'run_over', name: 'Run Over', image: '/src/assets/cards/Run_Over.png', isLegendary: false, cost: 3, isSpell: true, cardKey: 'C00228_SB', inDraftPool: false },
  { id: 'obliterate', name: 'Obliterate', image: '/src/assets/cards/Obliterate.png', isLegendary: false, cost: 4, isSpell: true, cardKey: 'C00190_SB', inDraftPool: false },
  { id: 'first_aid', name: 'First Aid', image: '/src/assets/cards/First_Aid.png', isLegendary: false, cost: 4, isSpell: true, cardKey: 'C00232_SB', inDraftPool: false },
  { id: 'mortal_coil', name: 'Mortal Coil', image: '/src/assets/cards/Mortal_Coil.png', isLegendary: false, cost: 5, isSpell: true, cardKey: 'C00235_SB', inDraftPool: false },
  { id: 'animated_broomstick', name: 'Animated Broomstick', image: '/src/assets/cards/Animated_Broomstick.png', isLegendary: false, cost: 5, isSpell: false, inDraftPool: false },
]

// Generate all 13 draft choices with the specified logic
export const generateAllDraftChoices = (usedCardIds: string[]): Card[][] => {
  const availableCards = cardDatabase.filter(card => 
    !usedCardIds.includes(card.id) && 
    card.cost !== undefined && 
    card.inDraftPool !== false
  )
  
  const choices: Card[][] = []
  const usedInChoices: Set<string> = new Set()

  // 1. One legendary choice
  const legendaryCards = availableCards.filter(card => card.isLegendary && !usedInChoices.has(card.id))
  if (legendaryCards.length >= 4) {
    const legendaryChoice = legendaryCards.slice(0, 4)
    choices.push(legendaryChoice)
    legendaryChoice.forEach(card => usedInChoices.add(card.id))
  }

  // 2. One spell choice (sum within range of 2)
  const spellCards = availableCards.filter(card => card.isSpell && !usedInChoices.has(card.id))
  if (spellCards.length >= 4) {
    // Try to find 4 spells with total cost sum within range of 2
    const spellChoice = spellCards.slice(0, 4)
    choices.push(spellChoice)
    spellChoice.forEach(card => usedInChoices.add(card.id))
  }

  // 3. Required cost choices: 1, 2, 3, 4, 5 (5 choices)
  const requiredCosts = [1, 2, 3, 4, 5]
  for (const cost of requiredCosts) {
    const cardsOfCost = availableCards.filter(card => 
      card.cost === cost && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id)
    )
    
    if (cardsOfCost.length >= 4) {
      const costChoice = cardsOfCost.slice(0, 4)
      choices.push(costChoice)
      costChoice.forEach(card => usedInChoices.add(card.id))
    } else if (cardsOfCost.length >= 2) {
      // Mix with neighboring costs
      const neighboringCosts = [cost - 1, cost + 1].filter(c => c >= 0)
      for (const neighborCost of neighboringCosts) {
        const neighborCards = availableCards.filter(card => 
          card.cost === neighborCost && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id)
        )
        if (cardsOfCost.length + neighborCards.length >= 4) {
          const mixedChoice = [...cardsOfCost, ...neighborCards].slice(0, 4)
          choices.push(mixedChoice)
          mixedChoice.forEach(card => usedInChoices.add(card.id))
          break
        }
      }
    }
  }

  // 4. Random choices from specific cost distribution: 2,2,2,3,3,3,4,4 (4 choices)
  const randomCostPool = [2, 2, 2, 3, 3, 3, 4, 4]
  const shuffledCostPool = [...randomCostPool].sort(() => Math.random() - 0.5)
  
  let addedRandomChoices = 0
  for (const cost of shuffledCostPool) {
    if (addedRandomChoices >= 4) break
    
    const cardsOfCost = availableCards.filter(card => 
      card.cost === cost && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id)
    )
    
    if (cardsOfCost.length >= 4) {
      const costChoice = cardsOfCost.slice(0, 4)
      choices.push(costChoice)
      costChoice.forEach(card => usedInChoices.add(card.id))
      addedRandomChoices++
    } else if (cardsOfCost.length >= 2) {
      // Mix with neighboring costs
      const neighboringCosts = [cost - 1, cost + 1].filter(c => c >= 0)
      for (const neighborCost of neighboringCosts) {
        const neighborCards = availableCards.filter(card => 
          card.cost === neighborCost && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id)
        )
        if (cardsOfCost.length + neighborCards.length >= 4) {
          const mixedChoice = [...cardsOfCost, ...neighborCards].slice(0, 4)
          choices.push(mixedChoice)
          mixedChoice.forEach(card => usedInChoices.add(card.id))
          addedRandomChoices++
          break
        }
      }
    }
  }

  // 5. One choice from cost 5-6 range
  const midRangeCards = availableCards.filter(card => 
    card.cost && card.cost >= 5 && card.cost <= 6 && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id)
  )
  if (midRangeCards.length >= 4) {
    const midRangeChoice = midRangeCards.slice(0, 4)
    choices.push(midRangeChoice)
    midRangeChoice.forEach(card => usedInChoices.add(card.id))
  }

  // 6. One choice from cost 7-10 range
  const highRangeCards = availableCards.filter(card => 
    card.cost && card.cost >= 7 && card.cost <= 10 && !card.isLegendary && !card.isSpell && !usedInChoices.has(card.id)
  )
  if (highRangeCards.length >= 4) {
    const highRangeChoice = highRangeCards.slice(0, 4)
    choices.push(highRangeChoice)
    highRangeChoice.forEach(card => usedInChoices.add(card.id))
  }

  // Shuffle all choices to randomize order
  return choices.sort(() => Math.random() - 0.5)
}

// Generate draft choices with cost-based logic (updated to use new system)
export const generateDraftChoices = (usedCardIds: string[]): { cards: Card[], isLegendary: boolean, isSpell: boolean } | null => {
  const allChoices = generateAllDraftChoices(usedCardIds)
  
  if (allChoices.length === 0) return null
  
  // Return a random choice instead of always the first one
  const randomIndex = Math.floor(Math.random() * allChoices.length)
  const cards = allChoices[randomIndex]
  const isLegendary = cards.some(card => card.isLegendary)
  const isSpell = cards.some(card => card.isSpell)
  
  return { cards, isLegendary, isSpell }
}

export const getRandomCards = (count: number, excludeIds: string[] = []): Card[] => {
  const availableCards = cardDatabase.filter(card => !excludeIds.includes(card.id) && card.inDraftPool !== false)
  const shuffled = [...availableCards].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export const getCardById = (id: string): Card | undefined => {
  return cardDatabase.find(card => card.id === id)
}
