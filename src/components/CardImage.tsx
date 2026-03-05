import { useState } from "react";

// Import all card images from winter-2025 folder
import alibabaImg from "@/assets/cards/winter-2025/ali_baba.png";
import aliceImg from "@/assets/cards/winter-2025/alice.png";
import axethrowImg from "@/assets/cards/winter-2025/axe_throw.png";
import balooImg from "@/assets/cards/winter-2025/baloo.png";
import bandersnatchImg from "@/assets/cards/winter-2025/bandersnatch.png";
import bansheeImg from "@/assets/cards/winter-2025/banshee.png";
import beastImg from "@/assets/cards/winter-2025/beast.png";
import beautifulswanImg from "@/assets/cards/winter-2025/beautiful_swan.png";
import bigbadwolfImg from "@/assets/cards/winter-2025/big_bad_wolf.png";
import billyImg from "@/assets/cards/winter-2025/billy.png";
import blackknightImg from "@/assets/cards/winter-2025/black_knight.png";
import blowthehousedownImg from "@/assets/cards/winter-2025/blow_the_house_down.png";
import bridgetrollImg from "@/assets/cards/winter-2025/bridge_troll.png";
import bullseyeImg from "@/assets/cards/winter-2025/bullseye.png";
import cardsoldierImg from "@/assets/cards/winter-2025/card_soldier.png";
import cheshireImg from "@/assets/cards/winter-2025/cheshire.png";
import concentrateImg from "@/assets/cards/winter-2025/concentrate.png";
import cowardlylionImg from "@/assets/cards/winter-2025/cowardly_lion.png";
import darkomenImg from "@/assets/cards/winter-2025/Dark_Omen.png";
import deathImg from "@/assets/cards/winter-2025/death.png";
import defensematrixImg from "@/assets/cards/winter-2025/defense_matrix.png";
import donquixoteImg from "@/assets/cards/winter-2025/don_quixote.png";
import dorothyImg from "@/assets/cards/winter-2025/dorothy.png";
import drfrankImg from "@/assets/cards/winter-2025/dr_frank.png";
import draculaImg from "@/assets/cards/winter-2025/dracula.png";
import enpassantImg from "@/assets/cards/winter-2025/en_passant.png";
import fairygodmotherImg from "@/assets/cards/winter-2025/fairy_godmother.png";
import flyingmonkeyImg from "@/assets/cards/winter-2025/flying_monkey.png";
import franksmonsterImg from "@/assets/cards/winter-2025/franks_monster.png";
import freezeImg from "@/assets/cards/winter-2025/freeze.png";
import tuckImg from "@/assets/cards/winter-2025/Tuck.png";
import galahadImg from "@/assets/cards/winter-2025/galahad.png";
import jacksgiantImg from "@/assets/cards/winter-2025/jacks_giant.png";
import glindaImg from "@/assets/cards/winter-2025/glinda.png";
import goldeneggImg from "@/assets/cards/winter-2025/golden_egg.png";
import goldengooseImg from "@/assets/cards/winter-2025/golden_goose.png";
import goldiImg from "@/assets/cards/winter-2025/Goldi.png";
import grendelImg from "@/assets/cards/winter-2025/grendel.png";
import guyofgisborneImg from "@/assets/cards/winter-2025/guy_of_gisborne.png";
import headlesshorsmanImg from "@/assets/cards/winter-2025/headless_horseman.png";
import heroicchargeImg from "@/assets/cards/winter-2025/heroic_charge.png";
import huntsmanImg from "@/assets/cards/winter-2025/huntsman.png";
import hydeImg from "@/assets/cards/winter-2025/hyde.png";
import imhotepImg from "@/assets/cards/winter-2025/imhotep.png";
import itsaliveImg from "@/assets/cards/winter-2025/its_alive.png";
import jackImg from "@/assets/cards/winter-2025/jack.png";
import jackintheboxImg from "@/assets/cards/winter-2025/jack_in_the_box.png";
import jekyllImg from "@/assets/cards/winter-2025/jekyll.png";
import kangaImg from "@/assets/cards/winter-2025/kanga.png";
import kingarthurImg from "@/assets/cards/winter-2025/king_arthur.png";
import kingshahryarImg from "@/assets/cards/winter-2025/king_shahryar.png";
import ladyofthelakeImg from "@/assets/cards/winter-2025/lady_of_the_lake.png";
import lancelotImg from "@/assets/cards/winter-2025/lancelot.png";
import legionofthedeadImg from "@/assets/cards/winter-2025/legion_of_the_dead.png";
import lightningstrikeImg from "@/assets/cards/winter-2025/lightning_strike.png";
import littlejohnImg from "@/assets/cards/winter-2025/little_john.png";
import madhatterImg from "@/assets/cards/winter-2025/mad_hatter.png";
import marianImg from "@/assets/cards/winter-2025/marian.png";
import merlinImg from "@/assets/cards/winter-2025/merlin.png";
import mobyImg from "@/assets/cards/winter-2025/moby.png";
import morgianaImg from "@/assets/cards/winter-2025/morgiana.png";
import moriartyImg from "@/assets/cards/winter-2025/moriarty.png";
import mouseImg from "@/assets/cards/winter-2025/mouse.png";
import mowgliImg from "@/assets/cards/winter-2025/mowgli.png";
import mummyImg from "@/assets/cards/winter-2025/mummy.png";
import musketeerImg from "@/assets/cards/winter-2025/musketeer.png";
import notsolitlepigImg from "@/assets/cards/winter-2025/not_so_little_pig.png";
import ogreImg from "@/assets/cards/summer-2025/ogre.png";
import pegasusImg from "@/assets/cards/winter-2025/pegasus.png";
import phantomcoachmanImg from "@/assets/cards/winter-2025/phantom_coachman.png";
import piggybankImg from "@/assets/cards/winter-2025/piggy_bank.png";
import princecharmingImg from "@/assets/cards/winter-2025/prince_charming.png";
import princessauroraImg from "@/assets/cards/winter-2025/princess_aurora.png";
import quasimodoImg from "@/assets/cards/winter-2025/quasimodo.png";
import queenguinevereImg from "@/assets/cards/winter-2025/queen_guinevere.png";
import rainofarrowsImg from "@/assets/cards/winter-2025/Rai_of_arrows.png";
import redImg from "@/assets/cards/winter-2025/red.png";
import redcapImg from "@/assets/cards/winter-2025/Red_cap.png";
import reinforcementsImg from "@/assets/cards/winter-2025/reinforcements.png";
import robinhoodImg from "@/assets/cards/winter-2025/Robinhood.png";
import rooImg from "@/assets/cards/winter-2025/roo.png";
import rumpleImg from "@/assets/cards/winter-2025/rumple.png";
import scarecrowImg from "@/assets/cards/winter-2025/scarecrow.png";
import scorpionImg from "@/assets/cards/winter-2025/scorpion.png";
import seawitchImg from "@/assets/cards/winter-2025/sea_witch.png";
import searinglightImg from "@/assets/cards/winter-2025/searing_light.png";
import sheriffofnottinghamImg from "@/assets/cards/winter-2025/sheriff_of_nottingham.png";
import sherlockImg from "@/assets/cards/winter-2025/sherlock.png";
import shieldmaidenImg from "@/assets/cards/winter-2025/shield_maiden.png";
import sirenImg from "@/assets/cards/winter-2025/siren.png";
import snowwhiteImg from "@/assets/cards/winter-2025/snow_white.png";
import soldierImg from "@/assets/cards/winter-2025/soldier.png";
import soulsurgeImg from "@/assets/cards/winter-2025/soul_surge.png";
import strygaImg from "@/assets/cards/winter-2025/stryga.png";
import thegreenknightImg from "@/assets/cards/winter-2025/the_green_knight.png";
import thekrakenImg from "@/assets/cards/winter-2025/the_kraken.png";
import thewhitequeenImg from "@/assets/cards/winter-2025/the_white_queen.png";
import threeblindmiceImg from "@/assets/cards/winter-2025/three_blind_mice.png";
import threemusketeersImg from "@/assets/cards/winter-2025/three_musketeers.png";
import threenotsolitlepigImg from "@/assets/cards/winter-2025/three_not_so_little_pigs.png";
import tinwoodmanImg from "@/assets/cards/winter-2025/tin_woodman.png";
import trashfortreasureImg from "@/assets/cards/winter-2025/trash_for_treasure.png";
import trojanhorse from "@/assets/cards/winter-2025/trojan_horse.png";
import twistertossImg from "@/assets/cards/winter-2025/twister_toss.png";
import uglyducklingImg from "@/assets/cards/winter-2025/ugly_duckling.png";
import underworldflareImg from "@/assets/cards/winter-2025/underworld_flare.png";
import watsonImg from "@/assets/cards/winter-2025/watson.png";
import whiterabbitImg from "@/assets/cards/winter-2025/white_rabbit.png";
import wickedwitchofthewestImg from "@/assets/cards/winter-2025/wicked_witch_of_the_west.png";
import zorroImg from "@/assets/cards/winter-2025/zorro.png";
import tinsoldierImg from "@/assets/cards/summer-2025/tin_soldier.png";
import hanselgretelImg from "@/assets/cards/winter-2025/hansel_gretel.png";
import beautyImg from "@/assets/cards/winter-2025/beauty.png";
import wendyImg from "@/assets/cards/winter-2025/wendy.png";
import babayagaImg from "@/assets/cards/winter-2025/baba_yaga.png";
import christopherImg from "@/assets/cards/winter-2025/christopher.png";
import wukongImg from "@/assets/cards/winter-2025/wukong.png";
import genieImg from "@/assets/cards/winter-2025/genie.png";
import paulbunyanImg from "@/assets/cards/winter-2025/paul_bunyan.png";

// New cards from October 2025 patch
import animatedBroomstickImg from "@/assets/cards/winter-2025/Animated_Broomstick.png";
import babeTheBlueOxImg from "@/assets/cards/winter-2025/Babe_the_blue_ox.png";
import babyBearImg from "@/assets/cards/winter-2025/Baby_Bear.png";
import bagheeraImg from "@/assets/cards/winter-2025/Bagheera.png";
import bakerImg from "@/assets/cards/winter-2025/Baker.png";
import bigfootImg from "@/assets/cards/winter-2025/Bigfoot.png";
import brandyImg from "@/assets/cards/winter-2025/Brandy.png";
import butcherImg from "@/assets/cards/winter-2025/Butcher.png";
import cakeImg from "@/assets/cards/winter-2025/Cake.png";
import captainAhabImg from "@/assets/cards/winter-2025/Captain_Ahab.png";
import cerberusImg from "@/assets/cards/winter-2025/Cerberus.png";
import herculesImg from "@/assets/cards/winter-2025/Hercules.png";
import chimeraImg from "@/assets/cards/winter-2025/Chimera.png";
import dropBearImg from "@/assets/cards/winter-2025/Drop_Bear.png";
import firstAidImg from "@/assets/cards/winter-2025/First_Aid.png";
import flyingDutchmanImg from "@/assets/cards/winter-2025/Flying_Dutchman.png";
import hareImg from "@/assets/cards/winter-2025/Hare.png";
import huckFinnImg from "@/assets/cards/winter-2025/Huck_Finn.png";
import impunduluImg from "@/assets/cards/winter-2025/Impundulu.png";
import koscheiImg from "@/assets/cards/winter-2025/KOschei.png";
import maryImg from "@/assets/cards/winter-2025/Mary.png";
import momotaroImg from "@/assets/cards/winter-2025/Momotaro.png";
import morganLeFayImg from "@/assets/cards/winter-2025/Morgan_le_Fay.png";
import mortalCoilImg from "@/assets/cards/winter-2025/Mortal_Coil.png";
import mothmanImg from "@/assets/cards/winter-2025/Mothman.png";
import obliterateImg from "@/assets/cards/winter-2025/Obliterate.png";
import pigletImg from "@/assets/cards/winter-2025/Piglet.png";
import popeyeImg from "@/assets/cards/winter-2025/Popeye.png";
import runOverImg from "@/assets/cards/winter-2025/Run_Over.png";
import sandmanImg from "@/assets/cards/winter-2025/Sandman.png";
import sinbadImg from "@/assets/cards/winter-2025/Sinbad.png";
import thumbelinaImg from "@/assets/cards/winter-2025/Thumbelina.png";
import tinkerBellImg from "@/assets/cards/winter-2025/Tinker_Bell.png";
import tortoiseImg from "@/assets/cards/winter-2025/Tortoise.png";
import wickedStepmotherImg from "@/assets/cards/winter-2025/Wicked_Stepmother.png";
import winnieThePoohImg from "@/assets/cards/winter-2025/Winnie_the_pooh.png";
import yukiOnnaImg from "@/assets/cards/winter-2025/Yuki_onna.png";
import shahrazadImg from "@/assets/cards/winter-2025/shahrazad.png";

const cardImages: Record<string, string> = {
  ali_baba: alibabaImg,
  alice: aliceImg,
  axe_throw: axethrowImg,
  baloo: balooImg,
  bandersnatch: bandersnatchImg,
  banshee: bansheeImg,
  beast: beastImg,
  beautiful_swan: beautifulswanImg,
  big_bad_wolf: bigbadwolfImg,
  billy: billyImg,
  black_knight: blackknightImg,
  blow_the_house_down: blowthehousedownImg,
  bridge_troll: bridgetrollImg,
  bullseye: bullseyeImg,
  card_soldier: cardsoldierImg,
  cheshire: cheshireImg,
  concentrate: concentrateImg,
  cowardly_lion: cowardlylionImg,
  dark_omen: darkomenImg,
  death: deathImg,
  defense_matrix: defensematrixImg,
  don_quixote: donquixoteImg,
  dorothy: dorothyImg,
  dr_frank: drfrankImg,
  dracula: draculaImg,
  en_passant: enpassantImg,
  fairy_godmother: fairygodmotherImg,
  flying_monkey: flyingmonkeyImg,
  franks_monster: franksmonsterImg,
  freeze: freezeImg,
  tuck: tuckImg,
  friar_tuck: tuckImg, // Alternate key for old name
  galahad: galahadImg,
  jacks_giant: jacksgiantImg,
  giant: jacksgiantImg, // Alternate key for old name
  glinda: glindaImg,
  golden_egg: goldeneggImg,
  golden_goose: goldengooseImg,
  goldi: goldiImg,
  goldilocks: goldiImg, // Alternate key for old name
  grendel: grendelImg,
  guy_of_gisborne: guyofgisborneImg,
  headless_horseman: headlesshorsmanImg,
  heroic_charge: heroicchargeImg,
  huntsman: huntsmanImg,
  hyde: hydeImg,
  imhotep: imhotepImg,
  its_alive: itsaliveImg,
  jack: jackImg,
  jack_in_the_box: jackintheboxImg,
  jekyll: jekyllImg,
  kanga: kangaImg,
  king_arthur: kingarthurImg,
  king_shahryar: kingshahryarImg,
  lady_of_the_lake: ladyofthelakeImg,
  lancelot: lancelotImg,
  legion_of_the_dead: legionofthedeadImg,
  lightning_strike: lightningstrikeImg,
  little_john: littlejohnImg,
  mad_hatter: madhatterImg,
  marian: marianImg,
  merlin: merlinImg,
  moby: mobyImg,
  morgiana: morgianaImg,
  moriarty: moriartyImg,
  mouse: mouseImg,
  mowgli: mowgliImg,
  mummy: mummyImg,
  musketeer: musketeerImg,
  not_so_little_pig: notsolitlepigImg,
  ogre: ogreImg,
  pegasus: pegasusImg,
  phantom_coachman: phantomcoachmanImg,
  piggy_bank: piggybankImg,
  prince_charming: princecharmingImg,
  princess_aurora: princessauroraImg,
  quasimodo: quasimodoImg,
  queen_guinevere: queenguinevereImg,
  rain_of_arrows: rainofarrowsImg,
  rai_of_arrows: rainofarrowsImg, // Alternate key matching file name
  red: redImg,
  red_cap: redcapImg,
  redcap: redcapImg, // Alternate key without underscore
  reinforcements: reinforcementsImg,
  robinhood: robinhoodImg,
  robin_hood: robinhoodImg, // Alternate key with underscore for backward compatibility
  roo: rooImg,
  rumple: rumpleImg,
  scarecrow: scarecrowImg,
  scorpion: scorpionImg,
  sea_witch: seawitchImg,
  searing_light: searinglightImg,
  sheriff_of_nottingham: sheriffofnottinghamImg,
  sherlock: sherlockImg,
  shield_maiden: shieldmaidenImg,
  siren: sirenImg,
  snow_white: snowwhiteImg,
  soldier: soldierImg,
  soul_surge: soulsurgeImg,
  stryga: strygaImg,
  the_green_knight: thegreenknightImg,
  the_kraken: thekrakenImg,
  the_white_queen: thewhitequeenImg,
  three_blind_mice: threeblindmiceImg,
  three_musketeers: threemusketeersImg,
  three_not_so_little_pigs: threenotsolitlepigImg,
  tin_woodman: tinwoodmanImg,
  trash_for_treasure: trashfortreasureImg,
  trojan_horse: trojanhorse,
  twister_toss: twistertossImg,
  ugly_duckling: uglyducklingImg,
  underworld_flare: underworldflareImg,
  watson: watsonImg,
  white_rabbit: whiterabbitImg,
  wicked_witch_of_the_west: wickedwitchofthewestImg,
  zorro: zorroImg,
  tin_soldier: tinsoldierImg,
  hansel_gretel: hanselgretelImg,
  beauty: beautyImg,
  wendy: wendyImg,
  baba_yaga: babayagaImg,
  christopher: christopherImg,
  wukong: wukongImg,
  genie: genieImg,
  paul_bunyan: paulbunyanImg,
  animated_broomstick: animatedBroomstickImg,
  babe_the_blue_ox: babeTheBlueOxImg,
  baby_bear: babyBearImg,
  bagheera: bagheeraImg,
  baker: bakerImg,
  bigfoot: bigfootImg,
  brandy: brandyImg,
  butcher: butcherImg,
  cake: cakeImg,
  captain_ahab: captainAhabImg,
  cerberus: cerberusImg,
  hercules: herculesImg,
  chimera: chimeraImg,
  drop_bear: dropBearImg,
  first_aid: firstAidImg,
  flying_dutchman: flyingDutchmanImg,
  hare: hareImg,
  huck_finn: huckFinnImg,
  impundulu: impunduluImg,
  koschei: koscheiImg,
  mary: maryImg,
  momotaro: momotaroImg,
  morgan_le_fay: morganLeFayImg,
  mortal_coil: mortalCoilImg,
  mothman: mothmanImg,
  obliterate: obliterateImg,
  piglet: pigletImg,
  popeye: popeyeImg,
  run_over: runOverImg,
  sandman: sandmanImg,
  sinbad: sinbadImg,
  thumbelina: thumbelinaImg,
  tinker_bell: tinkerBellImg,
  tortoise: tortoiseImg,
  wicked_stepmother: wickedStepmotherImg,
  winnie_the_pooh: winnieThePoohImg,
  yuki_onna: yukiOnnaImg,
  shahrazad: shahrazadImg,
};

interface CardImageProps {
  cardId: string;
  cardName: string;
  className?: string;
  onError?: () => void;
}

export function CardImage({ cardId, cardName, className, onError }: CardImageProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  // Try to find the image with the given cardId, or try with underscores replaced
  let imageSrc = cardImages[cardId];
  
  // If not found, try alternate naming conventions
  if (!imageSrc) {
    // Try replacing underscores with nothing (e.g., red_cap -> redcap)
    const withoutUnderscores = cardId.replace(/_/g, '');
    imageSrc = cardImages[withoutUnderscores];
    
    // If still not found, try adding underscores to camelCase (e.g., redcap -> red_cap)
    if (!imageSrc) {
      const withUnderscores = cardId.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
      imageSrc = cardImages[withUnderscores];
    }
  }
  
  imageSrc = imageSrc || "/placeholder.svg";

  return (
    <img
      src={imageError ? "/placeholder.svg" : imageSrc}
      alt={cardName}
      className={className}
      onError={handleImageError}
      loading="eager"
      decoding="async"
      fetchPriority="high"
    />
  );
}

export { cardImages };
