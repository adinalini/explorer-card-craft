/**
 * Per-Patch Card Stats
 * Stores the complete card stats for each patch.
 * Stats are cumulative - each patch contains the FULL state of all cards at that point.
 * When a card is removed, its status is set to 'removed'.
 * When a card is added, it appears for the first time in that patch's stats.
 */

export type CardType = 'minion' | 'spell' | 'item'

export interface CardStats {
  name: string
  cost: number
  power?: number       // undefined for spells/items
  defense?: number     // undefined for spells/items
  cardType: CardType
  isLegendary: boolean
  status: 'active' | 'removed'
  formerName?: string  // If this card was renamed from a previous name
  alignment?: 'good' | 'evil' | 'neutral'  // Card alignment (introduced in GDC 2026)
}

export type PatchCardStats = Record<string, CardStats> // cardId -> stats

/**
 * Card stats indexed by patch ID.
 * Each entry contains the COMPLETE state of all cards in that patch.
 */
export const patchCardStats: Record<string, PatchCardStats> = {
  'summer-2025': {
    ali_baba: { name: 'Ali Baba', cost: 1, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    alice: { name: 'Alice', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    axe_throw: { name: 'Axe Throw', cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    baba_yaga: { name: 'Baba Yaga', cost: 4, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    baloo: { name: 'Baloo', cost: 5, power: 6, defense: 6, cardType: 'minion', isLegendary: false, status: 'active' },
    bandersnatch: { name: 'Bandersnatch', cost: 8, power: 9, defense: 9, cardType: 'minion', isLegendary: false, status: 'active' },
    banshee: { name: 'Banshee', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    beast: { name: 'Beast', cost: 4, power: 3, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    beauty: { name: 'Beauty', cost: 3, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    big_bad_wolf: { name: 'Big Bad Wolf', cost: 3, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    billy: { name: 'Billy', cost: 2, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    black_knight: { name: 'Black Knight', cost: 3, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    blow_the_house_down: { name: 'Blow the House Down', cost: 7, cardType: 'spell', isLegendary: false, status: 'active' },
    bridge_troll: { name: 'Bridge Troll', cost: 5, power: 1, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    bullseye: { name: 'Bullseye', cost: 2, cardType: 'spell', isLegendary: false, status: 'active' },
    card_soldier: { name: 'Card Soldier', cost: 2, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    cheshire: { name: 'Cheshire Cat', cost: 4, power: 4, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    christopher: { name: 'Christopher Robin', cost: 4, power: 5, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    concentrate: { name: 'Concentrate', cost: 2, cardType: 'spell', isLegendary: false, status: 'active' },
    cowardly_lion: { name: 'Cowardly Lion', cost: 3, power: 4, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    dark_omen: { name: 'Dark Omen', cost: 4, cardType: 'spell', isLegendary: false, status: 'active' },
    death: { name: 'Death', cost: 5, power: 1, defense: 1, cardType: 'minion', isLegendary: true, status: 'active' },
    defense_matrix: { name: 'Defense Matrix', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    don_quixote: { name: 'Don Quixote', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    dorothy: { name: 'Dorothy', cost: 5, power: 4, defense: 4, cardType: 'minion', isLegendary: true, status: 'active' },
    dr_frank: { name: 'Dr. Frankenstein', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    dracula: { name: 'Dracula', cost: 4, power: 3, defense: 3, cardType: 'minion', isLegendary: true, status: 'active' },
    en_passant: { name: 'En Passant', cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    fairy_godmother: { name: 'Fairy Godmother', cost: 5, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    flying_monkey: { name: 'Flying Monkey', cost: 3, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    franks_monster: { name: "Frank's Monster", cost: 2, power: 4, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    freeze: { name: 'Freeze', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    friar_tuck: { name: 'Friar Tuck', cost: 1, power: 1, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    galahad: { name: 'Sir Galahad', cost: 5, power: 4, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    genie: { name: 'Genie', cost: 5, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    giant: { name: 'Giant', cost: 6, power: 7, defense: 7, cardType: 'minion', isLegendary: false, status: 'active' },
    glinda: { name: 'Glinda', cost: 4, power: 2, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    golden_egg: { name: 'Golden Egg', cost: 3, power: 0, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    goldi: { name: 'Goldilocks', cost: 4, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    grendel: { name: 'Grendel', cost: 5, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    guy_of_gisborne: { name: 'Guy of Gisborne', cost: 2, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    hansel_gretel: { name: 'Hansel & Gretel', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    headless_horseman: { name: 'Headless Horseman', cost: 5, power: 0, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    heroic_charge: { name: 'Heroic Charge', cost: 6, cardType: 'spell', isLegendary: false, status: 'active' },
    huntsman: { name: 'Huntsman', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    hyde: { name: 'Hyde', cost: 4, power: 3, defense: 6, cardType: 'minion', isLegendary: false, status: 'active' },
    imhotep: { name: 'Imhotep', cost: 4, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    its_alive: { name: "It's Alive!", cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    jack: { name: 'Jack', cost: 3, power: 4, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    jack_in_the_box: { name: 'Jack in the Box', cost: 3, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    jekyll: { name: 'Dr. Jekyll', cost: 4, power: 3, defense: 6, cardType: 'minion', isLegendary: false, status: 'active' },
    kanga: { name: 'Kanga', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    king_arthur: { name: 'King Arthur', cost: 7, power: 5, defense: 5, cardType: 'minion', isLegendary: true, status: 'active' },
    king_shahryar: { name: 'King Shahryar', cost: 3, power: 1, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    lady_of_the_lake: { name: 'Lady of the Lake', cost: 4, power: 3, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    lancelot: { name: 'Sir Lancelot', cost: 4, power: 3, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    legion_of_the_dead: { name: 'Legion of the Dead', cost: 7, cardType: 'spell', isLegendary: true, status: 'active' },
    lightning_strike: { name: 'Lightning Strike', cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    little_john: { name: 'Little John', cost: 4, power: 4, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    mad_hatter: { name: 'Mad Hatter', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    marian: { name: 'Marian', cost: 4, power: 3, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    merlin: { name: 'Merlin', cost: 6, power: 3, defense: 5, cardType: 'minion', isLegendary: true, status: 'active' },
    moby: { name: 'Moby Dick', cost: 4, power: 4, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    morgiana: { name: 'Morgiana', cost: 2, power: 1, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    moriarty: { name: 'Professor Moriarty', cost: 7, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    mowgli: { name: 'Mowgli', cost: 6, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    mummy: { name: 'Mummy', cost: 3, power: 3, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    musketeer: { name: 'Musketeer', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    ogre: { name: 'Ogre', cost: 2, power: 4, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    paul_bunyan: { name: 'Paul Bunyan', cost: 7, power: 10, defense: 10, cardType: 'minion', isLegendary: false, status: 'active' },
    pegasus: { name: 'Pegasus', cost: 2, power: 1, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    phantom_coachman: { name: 'Phantom Coachman', cost: 10, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    piggy_bank: { name: 'Piggy Bank', cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    prince_charming: { name: 'Prince Charming', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    princess_aurora: { name: 'Princess Aurora', cost: 3, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    quasimodo: { name: 'Quasimodo', cost: 2, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    queen_guinevere: { name: 'Queen Guinevere', cost: 4, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    rain_of_arrows: { name: 'Rain of Arrows', cost: 4, cardType: 'spell', isLegendary: false, status: 'active' },
    red: { name: 'Little Red Riding Hood', cost: 3, power: 4, defense: 3, cardType: 'minion', isLegendary: true, status: 'active' },
    red_cap: { name: 'Redcap', cost: 2, power: 5, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    reinforcements: { name: 'Reinforcements', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    robinhood: { name: 'Robin Hood', cost: 5, power: 4, defense: 4, cardType: 'minion', isLegendary: true, status: 'active' },
    roo: { name: 'Roo', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    rumple: { name: 'Rumpelstiltskin', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    scarecrow: { name: 'Scarecrow', cost: 2, power: 1, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    scorpion: { name: 'Scorpion', cost: 3, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    sea_witch: { name: 'Sea Witch', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    searing_light: { name: 'Searing Light', cost: 0, cardType: 'spell', isLegendary: false, status: 'active' },
    sheriff_of_nottingham: { name: 'Sheriff of Nottingham', cost: 3, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    sherlock: { name: 'Sherlock Holmes', cost: 4, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    shield_maiden: { name: 'Shield Maiden', cost: 3, power: 3, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    siren: { name: 'Siren', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    snow_white: { name: 'Snow White', cost: 7, power: 5, defense: 4, cardType: 'minion', isLegendary: true, status: 'active' },
    soldier: { name: 'Soldier', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    soul_surge: { name: 'Soul Surge', cost: 2, cardType: 'spell', isLegendary: false, status: 'active' },
    stryga: { name: 'Stryga', cost: 3, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    the_green_knight: { name: 'The Green Knight', cost: 5, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    the_kraken: { name: 'The Kraken', cost: 8, power: 8, defense: 8, cardType: 'minion', isLegendary: true, status: 'active' },
    the_white_queen: { name: 'The White Queen', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    three_blind_mice: { name: 'Three Blind Mice', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    three_musketeers: { name: 'Three Musketeers', cost: 5, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    three_not_so_little_pigs: { name: 'Three Not So Little Pigs', cost: 7, power: 4, defense: 4, cardType: 'minion', isLegendary: true, status: 'active' },
    tin_soldier: { name: 'Tin Soldier', cost: 1, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    tin_woodman: { name: 'Tin Woodman', cost: 4, power: 3, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    trash_for_treasure: { name: 'Trash for Treasure', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    trojan_horse: { name: 'Trojan Horse', cost: 4, power: 0, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    twister_toss: { name: 'Twister Toss', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    ugly_duckling: { name: 'Ugly Duckling', cost: 1, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    underworld_flare: { name: 'Underworld Flare', cost: 2, cardType: 'spell', isLegendary: false, status: 'active' },
    watson: { name: 'Watson', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    wendy: { name: 'Wendy Darling', cost: 3, power: 4, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    white_rabbit: { name: 'White Rabbit', cost: 1, power: 1, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    wicked_witch_of_the_west: { name: 'Wicked Witch of the West', cost: 4, power: 2, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    wukong: { name: 'Sun Wukong', cost: 4, power: 3, defense: 3, cardType: 'minion', isLegendary: true, status: 'active' },
    zorro: { name: 'Zorro', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
  },

  'winter-2025': {
    ali_baba: { name: 'Ali Baba', cost: 1, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    alice: { name: 'Alice', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    animated_broomstick: { name: 'Animated Broomstick', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    axe_throw: { name: 'Axe Throw', cost: 2, cardType: 'spell', isLegendary: false, status: 'active' },
    baba_yaga: { name: 'Baba Yaga', cost: 4, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    babe_the_blue_ox: { name: 'Babe the Blue Ox', cost: 7, power: 6, defense: 6, cardType: 'minion', isLegendary: false, status: 'active' },
    baby_bear: { name: 'Baby Bear', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    bagheera: { name: 'Bagheera', cost: 1, power: 1, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    baker: { name: 'Baker', cost: 3, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    baloo: { name: 'Baloo', cost: 5, power: 6, defense: 6, cardType: 'minion', isLegendary: false, status: 'active' },
    bandersnatch: { name: 'Bandersnatch', cost: 8, power: 9, defense: 9, cardType: 'minion', isLegendary: false, status: 'active' },
    banshee: { name: 'Banshee', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    beast: { name: 'Beast', cost: 3, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    beauty: { name: 'Beauty', cost: 4, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    big_bad_wolf: { name: 'Big Bad Wolf', cost: 3, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    bigfoot: { name: 'Bigfoot', cost: 5, power: 5, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    billy: { name: 'Billy', cost: 2, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    black_knight: { name: 'Black Knight', cost: 3, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    blow_the_house_down: { name: 'Blow the House Down', cost: 7, cardType: 'spell', isLegendary: false, status: 'active' },
    brandy: { name: 'Brandy', cost: 10, power: 8, defense: 10, cardType: 'minion', isLegendary: true, status: 'active' },
    bridge_troll: { name: 'Bridge Troll', cost: 5, power: 4, defense: 6, cardType: 'minion', isLegendary: false, status: 'active' },
    bullseye: { name: 'Bullseye', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    butcher: { name: 'Butcher', cost: 3, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    cake: { name: 'Cake', cost: 2, cardType: 'item', isLegendary: false, status: 'active' },
    captain_ahab: { name: 'Captain Ahab', cost: 4, power: 3, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    card_soldier: { name: 'Card Soldier', cost: 2, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    cerberus: { name: 'Cerberus', cost: 6, power: 3, defense: 6, cardType: 'minion', isLegendary: false, status: 'active' },
    cheshire: { name: 'Cheshire Cat', cost: 3, power: 4, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    chimera: { name: 'Chimera', cost: 6, power: 6, defense: 6, cardType: 'minion', isLegendary: false, status: 'active' },
    christopher: { name: 'Christopher Robin', cost: 4, power: 5, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    concentrate: { name: 'Concentrate', cost: 2, cardType: 'spell', isLegendary: false, status: 'active' },
    cowardly_lion: { name: 'Cowardly Lion', cost: 3, power: 2, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    dark_omen: { name: 'Dark Omen', cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    death: { name: 'Death', cost: 5, power: 1, defense: 1, cardType: 'minion', isLegendary: true, status: 'active' },
    defense_matrix: { name: 'Defense Matrix', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    don_quixote: { name: 'Don Quixote', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    dorothy: { name: 'Dorothy', cost: 5, power: 4, defense: 4, cardType: 'minion', isLegendary: true, status: 'active' },
    dr_frank: { name: 'Dr. Frankenstein', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    dracula: { name: 'Dracula', cost: 4, power: 3, defense: 3, cardType: 'minion', isLegendary: true, status: 'active' },
    drop_bear: { name: 'Drop Bear', cost: 4, power: 3, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    en_passant: { name: 'En Passant', cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    fairy_godmother: { name: 'Fairy Godmother', cost: 5, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    first_aid: { name: 'First Aid', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    flying_dutchman: { name: 'The Flying Dutchman', cost: 5, power: 0, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    flying_monkey: { name: 'Flying Monkey', cost: 3, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    franks_monster: { name: "Frank's Monster", cost: 2, power: 4, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    freeze: { name: 'Freeze', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    galahad: { name: 'Sir Galahad', cost: 5, power: 4, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    genie: { name: 'Genie', cost: 5, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    glinda: { name: 'Glinda', cost: 4, power: 2, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    golden_egg: { name: 'Golden Egg', cost: 3, power: 0, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    goldi: { name: 'Goldilocks', cost: 4, power: 2, defense: 4, cardType: 'minion', isLegendary: true, status: 'active' },
    grendel: { name: 'Grendel', cost: 5, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    guy_of_gisborne: { name: 'Guy of Gisborne', cost: 2, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    hansel_gretel: { name: 'Hansel & Gretel', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    hare: { name: 'Hare', cost: 5, power: 4, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    headless_horseman: { name: 'Headless Horseman', cost: 5, power: 0, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    hercules: { name: 'Hercules', cost: 10, power: 20, defense: 20, cardType: 'minion', isLegendary: true, status: 'active' },
    heroic_charge: { name: 'Heroic Charge', cost: 6, cardType: 'spell', isLegendary: false, status: 'active' },
    huck_finn: { name: 'Huck Finn', cost: 1, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    huntsman: { name: 'Huntsman', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    hyde: { name: 'Hyde', cost: 4, power: 3, defense: 6, cardType: 'minion', isLegendary: false, status: 'active' },
    imhotep: { name: 'Imhotep', cost: 4, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    impundulu: { name: 'Impundulu', cost: 6, power: 3, defense: 6, cardType: 'minion', isLegendary: false, status: 'active' },
    its_alive: { name: "It's Alive!", cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    jack: { name: 'Jack', cost: 3, power: 4, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    jack_in_the_box: { name: 'Jack in the Box', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    jacks_giant: { name: "Jack's Giant", cost: 7, power: 8, defense: 8, cardType: 'minion', isLegendary: false, status: 'active', formerName: 'Giant' },
    jekyll: { name: 'Dr. Jekyll', cost: 4, power: 3, defense: 6, cardType: 'minion', isLegendary: false, status: 'active' },
    kanga: { name: 'Kanga', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    king_arthur: { name: 'King Arthur', cost: 7, power: 5, defense: 5, cardType: 'minion', isLegendary: true, status: 'active' },
    king_shahryar: { name: 'King Shahryar', cost: 3, power: 1, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    koschei: { name: 'Koschei', cost: 6, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    lady_of_the_lake: { name: 'Lady of the Lake', cost: 2, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    lancelot: { name: 'Sir Lancelot', cost: 4, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    legion_of_the_dead: { name: 'Legion of the Dead', cost: 7, cardType: 'spell', isLegendary: true, status: 'active' },
    lightning_strike: { name: 'Lightning Strike', cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    little_john: { name: 'Little John', cost: 4, power: 4, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    mad_hatter: { name: 'Mad Hatter', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    marian: { name: 'Marian', cost: 4, power: 3, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    mary: { name: 'Mary', cost: 3, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    merlin: { name: 'Merlin', cost: 6, power: 3, defense: 5, cardType: 'minion', isLegendary: true, status: 'active' },
    moby: { name: 'Moby Dick', cost: 4, power: 4, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    momotaro: { name: 'Momotaro', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    morgan_le_fay: { name: 'Morgan le Fay', cost: 4, power: 4, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    morgiana: { name: 'Morgiana', cost: 2, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    moriarty: { name: 'Professor Moriarty', cost: 7, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    mortal_coil: { name: 'Mortal Coil', cost: 1, cardType: 'item', isLegendary: false, status: 'active' },
    mothman: { name: 'Mothman', cost: 2, power: 3, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    mowgli: { name: 'Mowgli', cost: 6, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    mummy: { name: 'Mummy', cost: 1, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    musketeer: { name: 'Musketeer', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    obliterate: { name: 'Obliterate', cost: 10, cardType: 'spell', isLegendary: false, status: 'active' },
    // ogre removed in winter-2025
    paul_bunyan: { name: 'Paul Bunyan', cost: 7, power: 10, defense: 10, cardType: 'minion', isLegendary: false, status: 'active' },
    pegasus: { name: 'Pegasus', cost: 2, power: 1, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    phantom_coachman: { name: 'Phantom Coachman', cost: 10, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    piggy_bank: { name: 'Piggy Bank', cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    piglet: { name: 'Piglet', cost: 1, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    popeye: { name: 'Popeye', cost: 2, power: 3, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    prince_charming: { name: 'Prince Charming', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    princess_aurora: { name: 'Princess Aurora', cost: 3, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    quasimodo: { name: 'Quasimodo', cost: 2, power: 3, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    queen_guinevere: { name: 'Queen Guinevere', cost: 4, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    rain_of_arrows: { name: 'Rain of Arrows', cost: 5, cardType: 'spell', isLegendary: false, status: 'active' },
    red: { name: 'Little Red Riding Hood', cost: 5, power: 5, defense: 4, cardType: 'minion', isLegendary: true, status: 'active' },
    red_cap: { name: 'Redcap', cost: 2, power: 4, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    reinforcements: { name: 'Reinforcements', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    robinhood: { name: 'Robin Hood', cost: 7, power: 4, defense: 4, cardType: 'minion', isLegendary: true, status: 'active' },
    roo: { name: 'Roo', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    rumple: { name: 'Rumpelstiltskin', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    run_over: { name: 'Run Over', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    sandman: { name: 'Sandman', cost: 6, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    scarecrow: { name: 'Scarecrow', cost: 2, power: 1, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    scorpion: { name: 'Scorpion', cost: 3, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    sea_witch: { name: 'Sea Witch', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    searing_light: { name: 'Searing Light', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    shahrazad: { name: 'Shahrazad', cost: 2, power: 1, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    sheriff_of_nottingham: { name: 'Sheriff of Nottingham', cost: 3, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    sherlock: { name: 'Sherlock Holmes', cost: 4, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    shield_maiden: { name: 'Shield Maiden', cost: 3, power: 3, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    sinbad: { name: 'Sinbad', cost: 5, power: 3, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    siren: { name: 'Siren', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    snow_white: { name: 'Snow White', cost: 7, power: 5, defense: 4, cardType: 'minion', isLegendary: true, status: 'active' },
    soldier: { name: 'Soldier', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    soul_surge: { name: 'Soul Surge', cost: 2, cardType: 'spell', isLegendary: false, status: 'active' },
    stryga: { name: 'Stryga', cost: 3, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    the_green_knight: { name: 'The Green Knight', cost: 5, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    the_kraken: { name: 'The Kraken', cost: 8, power: 8, defense: 8, cardType: 'minion', isLegendary: false, status: 'active' },
    the_white_queen: { name: 'The White Queen', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    three_blind_mice: { name: 'Three Blind Mice', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    three_musketeers: { name: 'Three Musketeers', cost: 5, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    three_not_so_little_pigs: { name: 'Three Not So Little Pigs', cost: 7, power: 4, defense: 4, cardType: 'minion', isLegendary: true, status: 'active' },
    thumbelina: { name: 'Thumbelina', cost: 0, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    tin_woodman: { name: 'Tin Woodman', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    tinker_bell: { name: 'Tinker Bell', cost: 1, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    tortoise: { name: 'Tortoise', cost: 6, power: 0, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    trash_for_treasure: { name: 'Trash for Treasure', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    trojan_horse: { name: 'Trojan Horse', cost: 4, power: 0, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    tuck: { name: 'Tuck', cost: 3, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', formerName: 'Friar Tuck' },
    twister_toss: { name: 'Twister Toss', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    ugly_duckling: { name: 'Ugly Duckling', cost: 1, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    underworld_flare: { name: 'Underworld Flare', cost: 2, cardType: 'spell', isLegendary: false, status: 'active' },
    watson: { name: 'Watson', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    wendy: { name: 'Wendy Darling', cost: 3, power: 4, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    white_rabbit: { name: 'White Rabbit', cost: 1, power: 1, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    wicked_stepmother: { name: 'Wicked Stepmother', cost: 4, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    wicked_witch_of_the_west: { name: 'Wicked Witch of the West', cost: 4, power: 2, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    winnie_the_pooh: { name: 'Winnie the Pooh', cost: 5, power: 5, defense: 5, cardType: 'minion', isLegendary: true, status: 'active' },
    wukong: { name: 'Sun Wukong', cost: 4, power: 3, defense: 3, cardType: 'minion', isLegendary: true, status: 'active' },
    yuki_onna: { name: 'Yuki-onna', cost: 2, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    zorro: { name: 'Zorro', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
  },

  'gdc-2026': {
    aladdin: { name: 'Aladdin', cost: 3, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    alice: { name: 'Alice', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    asanbosam: { name: 'Asanbosam', cost: 3, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil', formerName: 'Stryga' },
    axe_throw: { name: 'Axe Throw', cost: 2, cardType: 'spell', isLegendary: false, status: 'active' },
    baba_yaga: { name: 'Baba Yaga', cost: 4, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    babe: { name: 'Babe', cost: 7, power: 6, defense: 6, cardType: 'minion', isLegendary: false, status: 'active', formerName: 'Babe the Blue Ox' },
    baby_bear: { name: 'Baby Bear', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    bagheera: { name: 'Bagheera', cost: 1, power: 1, defense: 2, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    baker: { name: 'Baker', cost: 3, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    baloo: { name: 'Baloo', cost: 5, power: 6, defense: 6, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    bandersnatch: { name: 'Bandersnatch', cost: 8, power: 9, defense: 9, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    banshee: { name: 'Banshee', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    beast: { name: 'Beast', cost: 3, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    beauty: { name: 'Beauty', cost: 4, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    beowulf: { name: 'Beowulf', cost: 4, power: 2, defense: 5, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    big_bad_wolf: { name: 'Big Bad Wolf', cost: 3, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    bigfoot: { name: 'Bigfoot', cost: 5, power: 6, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    billy: { name: 'Billy', cost: 2, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    black_knight: { name: 'Black Knight', cost: 3, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    boogeyman: { name: 'Boogeyman', cost: 4, power: 7, defense: 7, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    bridge_troll: { name: 'Bridge Troll', cost: 5, power: 4, defense: 6, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    bullseye: { name: 'Bullseye', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    butcher: { name: 'Butcher', cost: 3, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    captain_ahab: { name: 'Captain Ahab', cost: 4, power: 3, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    card_soldier: { name: 'Card Soldier', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    cheshire: { name: 'Cheshire', cost: 3, power: 4, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    christopher: { name: 'Christopher Robin', cost: 4, power: 5, defense: 4, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    cockatrice: { name: 'Cockatrice', cost: 6, power: 6, defense: 6, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    cowardly_lion: { name: 'Cowardly Lion', cost: 3, power: 2, defense: 5, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    dark_omen: { name: 'Dark Omen', cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    death: { name: 'Death', cost: 5, power: 1, defense: 1, cardType: 'minion', isLegendary: true, status: 'active', alignment: 'evil' },
    defense_matrix: { name: 'Defense Matrix', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    don_quixote: { name: 'Don Quixote', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    dorothy: { name: 'Dorothy', cost: 5, power: 4, defense: 4, cardType: 'minion', isLegendary: true, status: 'active', alignment: 'good' },
    dr_frank: { name: 'Dr. Frankenstein', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    dracula: { name: 'Dracula', cost: 4, power: 3, defense: 3, cardType: 'minion', isLegendary: true, status: 'active', alignment: 'evil' },
    el_charro_negro: { name: 'El Charro Negro', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil', formerName: 'Zorro' },
    en_passant: { name: 'En Passant', cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    fairy_godmother: { name: 'Fairy Godmother', cost: 5, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    first_aid: { name: 'First Aid', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    flying_monkey: { name: 'Flying Monkey', cost: 3, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    franks_monster: { name: "Frank's Monster", cost: 6, power: 5, defense: 4, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    freeze: { name: 'Freeze', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    galahad: { name: 'Sir Galahad', cost: 5, power: 4, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    genie: { name: 'Genie', cost: 5, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    glinda: { name: 'Glinda', cost: 4, power: 2, defense: 5, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    golden_egg: { name: 'Golden Egg', cost: 3, power: 0, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    grendel: { name: 'Grendel', cost: 5, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    guy_of_gisborne: { name: 'Guy of Gisborne', cost: 6, power: 4, defense: 5, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    hansel_gretel: { name: 'Hansel & Gretel', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    hare: { name: 'Hare', cost: 5, power: 4, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    heroic_charge: { name: 'Heroic Charge', cost: 6, cardType: 'spell', isLegendary: false, status: 'active' },
    huck_finn: { name: 'Huck Finn', cost: 1, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    humpty: { name: 'Humpty', cost: 3, power: 3, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    huntsman: { name: 'Huntsman', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    hyde: { name: 'Hyde', cost: 4, power: 3, defense: 6, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    imhotep: { name: 'Imhotep', cost: 4, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    its_alive: { name: "It's Alive!", cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    jack: { name: 'Jack', cost: 3, power: 4, defense: 2, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    jack_in_the_box: { name: 'Jack in the Box', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    jacks_giant: { name: "Jack's Giant", cost: 7, power: 8, defense: 8, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    jekyll: { name: 'Dr. Jekyll', cost: 4, power: 3, defense: 5, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    kanga: { name: 'Kanga', cost: 3, power: 2, defense: 4, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    king_arthur: { name: 'King Arthur', cost: 7, power: 5, defense: 5, cardType: 'minion', isLegendary: true, status: 'active', alignment: 'good' },
    king_shahryar: { name: 'King Shahryar', cost: 3, power: 1, defense: 4, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    koschei: { name: 'Koschei', cost: 6, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    lady_of_the_lake: { name: 'Lady of the Lake', cost: 2, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    lancelot: { name: 'Sir Lancelot', cost: 4, power: 2, defense: 2, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    legion_of_the_dead: { name: 'Legion of the Dead', cost: 7, cardType: 'spell', isLegendary: true, status: 'active' },
    lightning_strike: { name: 'Lightning Strike', cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    little_john: { name: 'Little John', cost: 4, power: 4, defense: 4, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    mad_hatter: { name: 'Mad Hatter', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    marian: { name: 'Marian', cost: 4, power: 3, defense: 4, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    mary: { name: 'Mary', cost: 3, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    mind_palace: { name: 'Mind Palace', cost: 2, cardType: 'spell', isLegendary: false, status: 'active', formerName: 'Concentrate' },
    moby: { name: 'Moby Dick', cost: 4, power: 4, defense: 4, cardType: 'minion', isLegendary: false, status: 'active' },
    morgan_le_fay: { name: 'Morgan le Fay', cost: 2, power: 1, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    moriarty: { name: 'Professor Moriarty', cost: 7, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    mothman: { name: 'Mothman', cost: 2, power: 3, defense: 2, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    mowgli: { name: 'Mowgli', cost: 5, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    mummy: { name: 'Mummy', cost: 1, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    musketeer: { name: 'Musketeer', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    obliterate: { name: 'Obliterate', cost: 10, cardType: 'spell', isLegendary: false, status: 'active' },
    paul_bunyan: { name: 'Paul Bunyan', cost: 7, power: 10, defense: 10, cardType: 'minion', isLegendary: false, status: 'active' },
    pegasus: { name: 'Pegasus', cost: 5, power: 2, defense: 5, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    phantom_coachman: { name: 'Phantom Coachman', cost: 10, power: 8, defense: 8, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    piggy_bank: { name: 'Piggy Bank', cost: 3, cardType: 'spell', isLegendary: false, status: 'active' },
    piglet: { name: 'Piglet', cost: 1, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    poison_apple: { name: 'Poison Apple', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    prince_charming: { name: 'Prince Charming', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    quasimodo: { name: 'Quasimodo', cost: 2, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    queen_guinevere: { name: 'Queen Guinevere', cost: 4, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    queen_of_hearts: { name: 'Queen of Hearts', cost: 5, power: 3, defense: 5, cardType: 'minion', isLegendary: true, status: 'active', alignment: 'evil' },
    queen_of_the_night: { name: 'Queen of the Night', cost: 3, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    rain_of_arrows: { name: 'Rain of Arrows', cost: 5, cardType: 'spell', isLegendary: false, status: 'active' },
    red: { name: 'Red', cost: 5, power: 5, defense: 4, cardType: 'minion', isLegendary: true, status: 'active', alignment: 'good', formerName: 'Little Red Riding Hood' },
    reinforcements: { name: 'Reinforcements', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    robinhood: { name: 'Robin Hood', cost: 8, power: 4, defense: 4, cardType: 'minion', isLegendary: true, status: 'active', alignment: 'good' },
    roo: { name: 'Roo', cost: 2, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    rumple: { name: 'Rumpelstiltskin', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    run_over: { name: 'Run Over', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    sandman: { name: 'Sandman', cost: 6, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    scarecrow: { name: 'Scarecrow', cost: 2, power: 1, defense: 2, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    searing_light: { name: 'Searing Light', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    shahrazad: { name: 'Shahrazad', cost: 2, power: 1, defense: 4, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    sheriff_of_nottingham: { name: 'Sheriff of Nottingham', cost: 3, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    shield_maiden: { name: 'Shield Maiden', cost: 3, power: 3, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    sinbad: { name: 'Sinbad', cost: 5, power: 3, defense: 5, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    sleeping_beauty: { name: 'Sleeping Beauty', cost: 3, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good', formerName: 'Princess Aurora' },
    soul_surge: { name: 'Soul Surge', cost: 2, cardType: 'spell', isLegendary: false, status: 'active' },
    stormalong: { name: 'Stormalong', cost: 2, power: 3, defense: 2, cardType: 'minion', isLegendary: false, status: 'active', formerName: 'Popeye' },
    stroke_of_midnight: { name: 'Stroke of Midnight', cost: 2, cardType: 'spell', isLegendary: false, status: 'active' },
    the_firebird: { name: 'The Firebird', cost: 1, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', formerName: 'Ali Baba' },
    the_green_knight: { name: 'The Green Knight', cost: 5, power: 5, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    the_white_queen: { name: 'White Queen', cost: 4, power: 2, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    three_blind_mice: { name: 'Three Blind Mice', cost: 2, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    three_musketeers: { name: 'Three Musketeers', cost: 5, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    three_not_so_little_pigs: { name: 'Three Not So Little Pigs', cost: 7, power: 4, defense: 4, cardType: 'minion', isLegendary: true, status: 'active' },
    thumbelina: { name: 'Thumbelina', cost: 0, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    tin_woodman: { name: 'Tin Woodman', cost: 2, power: 2, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    tortoise: { name: 'Tortoise', cost: 6, power: 0, defense: 5, cardType: 'minion', isLegendary: false, status: 'active' },
    toto: { name: 'Toto', cost: 1, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    trash_for_treasure: { name: 'Trash for Treasure', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    tuck: { name: 'Tuck', cost: 3, power: 3, defense: 3, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'good' },
    twister_toss: { name: 'Twister Toss', cost: 1, cardType: 'spell', isLegendary: false, status: 'active' },
    ugly_duckling: { name: 'Ugly Duckling', cost: 1, power: 1, defense: 1, cardType: 'minion', isLegendary: false, status: 'active' },
    wendy: { name: 'Wendy', cost: 3, power: 4, defense: 3, cardType: 'minion', isLegendary: false, status: 'active' },
    white_rabbit: { name: 'White Rabbit', cost: 1, power: 1, defense: 2, cardType: 'minion', isLegendary: false, status: 'active' },
    wicked_stepmother: { name: 'Wicked Stepmother', cost: 4, power: 2, defense: 4, cardType: 'minion', isLegendary: true, status: 'active', alignment: 'evil' },
    wicked_witch_of_the_west: { name: 'Wicked Witch of the West', cost: 4, power: 2, defense: 5, cardType: 'minion', isLegendary: false, status: 'active', alignment: 'evil' },
    winnie_the_pooh: { name: 'Winnie the Pooh', cost: 5, power: 5, defense: 5, cardType: 'minion', isLegendary: true, status: 'active', alignment: 'good' },
  },
}

/**
 * Compute the diff between two patches for a specific card
 */
export interface CardDiff {
  cardId: string
  cardName: string
  changes: Array<{
    field: string
    oldValue: any
    newValue: any
  }>
  changeType: 'added' | 'removed' | 'modified' | 'renamed'
  formerName?: string
  // Former card ID (for cards that were renamed and got a new ID)
  formerCardId?: string
}

/**
 * Name change mappings between patches.
 * Maps old cardId -> new cardId for cards that were renamed with a new ID.
 */
export const cardIdRenames: Record<string, Record<string, string>> = {
  'winter-2025': {
    'friar_tuck': 'tuck',
    'giant': 'jacks_giant',
  },
  'gdc-2026': {
    'stryga': 'asanbosam',
    'babe_the_blue_ox': 'babe',
    'zorro': 'el_charro_negro',
    'concentrate': 'mind_palace',
    'princess_aurora': 'sleeping_beauty',
    'popeye': 'stormalong',
    'ali_baba': 'the_firebird',
  },
}

export function computePatchDiff(oldPatchId: string, newPatchId: string): CardDiff[] {
  const oldStats = patchCardStats[oldPatchId] || {}
  const newStats = patchCardStats[newPatchId] || {}
  const renames = cardIdRenames[newPatchId] || {}
  const reverseRenames: Record<string, string> = {}
  for (const [oldId, newId] of Object.entries(renames)) {
    reverseRenames[newId] = oldId
  }
  const diffs: CardDiff[] = []
  const processedOldIds = new Set<string>()

  // Check renamed cards first
  for (const [oldId, newId] of Object.entries(renames)) {
    processedOldIds.add(oldId)
    const oldCard = oldStats[oldId]
    const newCard = newStats[newId]
    if (!oldCard || !newCard) continue

    const changes: CardDiff['changes'] = []
    if (oldCard.cost !== newCard.cost) changes.push({ field: 'cost', oldValue: oldCard.cost, newValue: newCard.cost })
    if (oldCard.power !== newCard.power) changes.push({ field: 'power', oldValue: oldCard.power, newValue: newCard.power })
    if (oldCard.defense !== newCard.defense) changes.push({ field: 'defense', oldValue: oldCard.defense, newValue: newCard.defense })
    if (oldCard.cardType !== newCard.cardType) changes.push({ field: 'type', oldValue: oldCard.cardType, newValue: newCard.cardType })
    if (oldCard.isLegendary !== newCard.isLegendary) changes.push({ field: 'legendary', oldValue: oldCard.isLegendary, newValue: newCard.isLegendary })

    diffs.push({
      cardId: newId,
      cardName: newCard.name,
      changes,
      changeType: 'renamed',
      formerName: oldCard.name,
      formerCardId: oldId,
    })
  }

  // Check for removed and modified cards
  for (const [cardId, oldCard] of Object.entries(oldStats)) {
    if (oldCard.status === 'removed') continue
    if (processedOldIds.has(cardId)) continue

    const newCard = newStats[cardId]
    if (!newCard || newCard.status === 'removed') {
      diffs.push({
        cardId,
        cardName: oldCard.name,
        changes: [],
        changeType: 'removed',
      })
      continue
    }

    // Check for modifications
    const changes: CardDiff['changes'] = []
    if (oldCard.cost !== newCard.cost) changes.push({ field: 'cost', oldValue: oldCard.cost, newValue: newCard.cost })
    if (oldCard.power !== newCard.power) changes.push({ field: 'power', oldValue: oldCard.power, newValue: newCard.power })
    if (oldCard.defense !== newCard.defense) changes.push({ field: 'defense', oldValue: oldCard.defense, newValue: newCard.defense })
    if (oldCard.cardType !== newCard.cardType) changes.push({ field: 'type', oldValue: oldCard.cardType, newValue: newCard.cardType })
    if (oldCard.isLegendary !== newCard.isLegendary) changes.push({ field: 'legendary', oldValue: oldCard.isLegendary, newValue: newCard.isLegendary })

    if (changes.length > 0) {
      diffs.push({
        cardId,
        cardName: newCard.name,
        changes,
        changeType: 'modified',
      })
    }
  }

  // Check for new cards (not in old patch and not a rename target)
  for (const [cardId, newCard] of Object.entries(newStats)) {
    if (newCard.status === 'removed') continue
    if (reverseRenames[cardId]) continue // handled as rename
    if (!oldStats[cardId] || oldStats[cardId].status === 'removed') {
      diffs.push({
        cardId,
        cardName: newCard.name,
        changes: [],
        changeType: 'added',
      })
    }
  }

  return diffs.sort((a, b) => a.cardName.localeCompare(b.cardName))
}

/**
 * Get the stats for a card at a specific patch.
 */
export function getCardStatsAtPatch(cardId: string, patchId: string): CardStats | undefined {
  const stats = patchCardStats[patchId]
  if (stats && stats[cardId]) return stats[cardId]
  return undefined
}
