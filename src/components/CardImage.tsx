import { useState } from 'react'

// Import all card images
import alibabaImg from '@/assets/cards/ali_baba.png'
import aliceImg from '@/assets/cards/alice.png'
import axethrowImg from '@/assets/cards/axe_throw.png'

import bandersnatchImg from '@/assets/cards/bandersnatch.png'
import bansheeImg from '@/assets/cards/banshee.png'
import beastImg from '@/assets/cards/beast.png'
import beautifulswanImg from '@/assets/cards/beautiful_swan.png'
import bigbadwolfImg from '@/assets/cards/big_bad_wolf.png'
import billyImg from '@/assets/cards/billy.png'
import blackknightImg from '@/assets/cards/black_knight.png'
import blowthehousedownImg from '@/assets/cards/blow_the_house_down.png'
import bridgetrollImg from '@/assets/cards/bridge_troll.png'
import bullseyeImg from '@/assets/cards/bullseye.png'
import cardsoldierImg from '@/assets/cards/card_soldier.png'
import cheshireImg from '@/assets/cards/cheshire.png'
import concentrateImg from '@/assets/cards/concentrate.png'
import cowardlylionImg from '@/assets/cards/cowardly_lion.png'
import darkomenImg from '@/assets/cards/dark_omen.png'
import deathImg from '@/assets/cards/death.png'
import defensematrixImg from '@/assets/cards/defense_matrix.png'
import donquixoteImg from '@/assets/cards/don_quixote.png'
import dorothyImg from '@/assets/cards/dorothy.png'
import drfrankImg from '@/assets/cards/dr_frank.png'
import draculaImg from '@/assets/cards/dracula.png'
import enpassantImg from '@/assets/cards/en_passant.png'
import fairygodmotherImg from '@/assets/cards/fairy_godmother.png'
import flyingmonkeyImg from '@/assets/cards/flying_monkey.png'
import franksmonsterImg from '@/assets/cards/franks_monster.png'
import freezeImg from '@/assets/cards/freeze.png'
import friartuckImg from '@/assets/cards/friar_tuck.png'
import galahadImg from '@/assets/cards/galahad.png'
import giantImg from '@/assets/cards/giant.png'
import glindaImg from '@/assets/cards/glinda.png'
import goldeneggImg from '@/assets/cards/golden_egg.png'
import goldengooseImg from '@/assets/cards/golden_goose.png'
import goldilocksImg from '@/assets/cards/goldilocks.png'
import grendelImg from '@/assets/cards/grendel.png'
import guyofgisborneImg from '@/assets/cards/guy_of_gisborne.png'
import headlesshorsmanImg from '@/assets/cards/headless_horseman.png'
import heroicchargeImg from '@/assets/cards/heroic_charge.png'
import huntsmanImg from '@/assets/cards/huntsman.png'
import hydeImg from '@/assets/cards/hyde.png'
import imhotepImg from '@/assets/cards/imhotep.png'
import itsaliveImg from '@/assets/cards/its_alive.png'
import jackImg from '@/assets/cards/jack.png'
import jackintheboxImg from '@/assets/cards/jack_in_the_box.png'
import jekyllImg from '@/assets/cards/jekyll.png'
import kangaImg from '@/assets/cards/kanga.png'
import kingarthurImg from '@/assets/cards/king_arthur.png'
import kingshahryarImg from '@/assets/cards/king_shahryar.png'
import ladyofthelakeImg from '@/assets/cards/lady_of_the_lake.png'
import lancelotImg from '@/assets/cards/lancelot.png'
import legionofthedeadImg from '@/assets/cards/legion_of_the_dead.png'
import lightningstrikeImg from '@/assets/cards/lightning_strike.png'
import littlejohnImg from '@/assets/cards/little_john.png'
import madhatterImg from '@/assets/cards/mad_hatter.png'
import marianImg from '@/assets/cards/marian.png'
import merlinImg from '@/assets/cards/merlin.png'
import mobyImg from '@/assets/cards/moby.png'
import morgianaImg from '@/assets/cards/morgiana.png'
import moriartyImg from '@/assets/cards/moriarty.png'
import mouseImg from '@/assets/cards/mouse.png'
import mowgliImg from '@/assets/cards/mowgli.png'
import mummyImg from '@/assets/cards/mummy.png'
import musketeerImg from '@/assets/cards/musketeer.png'
import notsolitlepigImg from '@/assets/cards/not_so_little_pig.png'
import ogreImg from '@/assets/cards/ogre.png'
import pegasusImg from '@/assets/cards/pegasus.png'
import phantomcoachmanImg from '@/assets/cards/phantom_coachman.png'
import piggybankImg from '@/assets/cards/piggy_bank.png'
import princecharmingImg from '@/assets/cards/prince_charming.png'
import princessauroraImg from '@/assets/cards/princess_aurora.png'
import quasimodoImg from '@/assets/cards/quasimodo.png'
import queenguinevereImg from '@/assets/cards/queen_guinevere.png'
import rainofarrowsImg from '@/assets/cards/rain_of_arrows.png'
import redImg from '@/assets/cards/red.png'
import redcapImg from '@/assets/cards/redcap.png'
import reinforcementsImg from '@/assets/cards/reinforcements.png'
import robinhoodImg from '@/assets/cards/robin_hood.png'
import rooImg from '@/assets/cards/roo.png'
import rumpleImg from '@/assets/cards/rumple.png'
import scarecrowImg from '@/assets/cards/scarecrow.png'
import scorpionImg from '@/assets/cards/scorpion.png'
import seawitchImg from '@/assets/cards/sea_witch.png'
import searinglightImg from '@/assets/cards/searing_light.png'
import sheriffofnottinghamImg from '@/assets/cards/sheriff_of_nottingham.png'
import sherlockImg from '@/assets/cards/sherlock.png'
import shieldmaidenImg from '@/assets/cards/shield_maiden.png'
import sirenImg from '@/assets/cards/siren.png'
import snowwhiteImg from '@/assets/cards/snow_white.png'
import soldierImg from '@/assets/cards/soldier.png'
import soulsurgeImg from '@/assets/cards/soul_surge.png'
import strigaImg from '@/assets/cards/striga.png'
import thegreenknightImg from '@/assets/cards/the_green_knight.png'
import thekrakenImg from '@/assets/cards/the_kraken.png'
import thewhitequeenImg from '@/assets/cards/the_white_queen.png'
import threeblindmiceImg from '@/assets/cards/three_blind_mice.png'
import threemusketeersImg from '@/assets/cards/three_musketeers.png'
import threenotsolitlepigImg from '@/assets/cards/three_not_so_little_pigs.png'
import tinwoodmanImg from '@/assets/cards/tin_woodman.png'
import trashfortreasureImg from '@/assets/cards/trash_for_treasure.png'
import trojanhorse from '@/assets/cards/trojan_horse.png'
import twistertossImg from '@/assets/cards/twister_toss.png'
import uglyducklingImg from '@/assets/cards/ugly_duckling.png'
import underworldflareImg from '@/assets/cards/underworld_flare.png'
import watsonImg from '@/assets/cards/watson.png'
import whiterabbitImg from '@/assets/cards/white_rabbit.png'
import wickedwitchofthewestImg from '@/assets/cards/wicked_witch_of_the_west.png'
import zorroImg from '@/assets/cards/zorro.png'

const cardImages: Record<string, string> = {
  'ali_baba': alibabaImg,
  'alice': aliceImg,
  'axe_throw': axethrowImg,
  
  'bandersnatch': bandersnatchImg,
  'banshee': bansheeImg,
  'beast': beastImg,
  'beautiful_swan': beautifulswanImg,
  'big_bad_wolf': bigbadwolfImg,
  'billy': billyImg,
  'black_knight': blackknightImg,
  'blow_the_house_down': blowthehousedownImg,
  'bridge_troll': bridgetrollImg,
  'bullseye': bullseyeImg,
  'card_soldier': cardsoldierImg,
  'cheshire': cheshireImg,
  'concentrate': concentrateImg,
  'cowardly_lion': cowardlylionImg,
  'dark_omen': darkomenImg,
  'death': deathImg,
  'defense_matrix': defensematrixImg,
  'don_quixote': donquixoteImg,
  'dorothy': dorothyImg,
  'dr_frank': drfrankImg,
  'dracula': draculaImg,
  'en_passant': enpassantImg,
  'fairy_godmother': fairygodmotherImg,
  'flying_monkey': flyingmonkeyImg,
  'franks_monster': franksmonsterImg,
  'freeze': freezeImg,
  'friar_tuck': friartuckImg,
  'galahad': galahadImg,
  'giant': giantImg,
  'glinda': glindaImg,
  'golden_egg': goldeneggImg,
  'golden_goose': goldengooseImg,
  'goldilocks': goldilocksImg,
  'grendel': grendelImg,
  'guy_of_gisborne': guyofgisborneImg,
  'headless_horseman': headlesshorsmanImg,
  'heroic_charge': heroicchargeImg,
  'huntsman': huntsmanImg,
  'hyde': hydeImg,
  'imhotep': imhotepImg,
  'its_alive': itsaliveImg,
  'jack': jackImg,
  'jack_in_the_box': jackintheboxImg,
  'jekyll': jekyllImg,
  'kanga': kangaImg,
  'king_arthur': kingarthurImg,
  'king_shahryar': kingshahryarImg,
  'lady_of_the_lake': ladyofthelakeImg,
  'lancelot': lancelotImg,
  'legion_of_the_dead': legionofthedeadImg,
  'lightning_strike': lightningstrikeImg,
  'little_john': littlejohnImg,
  'mad_hatter': madhatterImg,
  'marian': marianImg,
  'merlin': merlinImg,
  'moby': mobyImg,
  'morgiana': morgianaImg,
  'moriarty': moriartyImg,
  'mouse': mouseImg,
  'mowgli': mowgliImg,
  'mummy': mummyImg,
  'musketeer': musketeerImg,
  'not_so_little_pig': notsolitlepigImg,
  'ogre': ogreImg,
  'pegasus': pegasusImg,
  'phantom_coachman': phantomcoachmanImg,
  'piggy_bank': piggybankImg,
  'prince_charming': princecharmingImg,
  'princess_aurora': princessauroraImg,
  'quasimodo': quasimodoImg,
  'queen_guinevere': queenguinevereImg,
  'rain_of_arrows': rainofarrowsImg,
  'red': redImg,
  'redcap': redcapImg,
  'reinforcements': reinforcementsImg,
  'robin_hood': robinhoodImg,
  'roo': rooImg,
  'rumple': rumpleImg,
  'scarecrow': scarecrowImg,
  'scorpion': scorpionImg,
  'sea_witch': seawitchImg,
  'searing_light': searinglightImg,
  'sheriff_of_nottingham': sheriffofnottinghamImg,
  'sherlock': sherlockImg,
  'shield_maiden': shieldmaidenImg,
  'siren': sirenImg,
  'snow_white': snowwhiteImg,
  'soldier': soldierImg,
  'soul_surge': soulsurgeImg,
  'striga': strigaImg,
  'the_green_knight': thegreenknightImg,
  'the_kraken': thekrakenImg,
  'the_white_queen': thewhitequeenImg,
  'three_blind_mice': threeblindmiceImg,
  'three_musketeers': threemusketeersImg,
  'three_not_so_little_pigs': threenotsolitlepigImg,
  'tin_woodman': tinwoodmanImg,
  'trash_for_treasure': trashfortreasureImg,
  'trojan_horse': trojanhorse,
  'twister_toss': twistertossImg,
  'ugly_duckling': uglyducklingImg,
  'underworld_flare': underworldflareImg,
  'watson': watsonImg,
  'white_rabbit': whiterabbitImg,
  'wicked_witch_of_the_west': wickedwitchofthewestImg,
  'zorro': zorroImg,
}

interface CardImageProps {
  cardId: string
  cardName: string
  className?: string
  onError?: () => void
}

export function CardImage({ cardId, cardName, className, onError }: CardImageProps) {
  const [imageError, setImageError] = useState(false)
  
  const handleImageError = () => {
    setImageError(true)
    onError?.()
  }

  const imageSrc = cardImages[cardId] || '/placeholder.svg'

  return (
    <img
      src={imageError ? '/placeholder.svg' : imageSrc}
      alt={cardName}
      className={className}
      onError={handleImageError}
      loading="eager"
      decoding="async"
      fetchPriority="high"
    />
  )
}

export { cardImages }