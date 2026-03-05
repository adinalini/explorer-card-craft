import { useState } from "react";

// Import all card images
import alibabaImg from "@/assets/cards/ali_baba.png";
import aliceImg from "@/assets/cards/alice.png";
import axethrowImg from "@/assets/cards/axe_throw.png";
import balooImg from "@/assets/cards/baloo.png";
import bandersnatchImg from "@/assets/cards/bandersnatch.png";
import bansheeImg from "@/assets/cards/banshee.png";
import beastImg from "@/assets/cards/beast.png";
import beautifulswanImg from "@/assets/cards/beautiful_swan.png";
import bigbadwolfImg from "@/assets/cards/big_bad_wolf.png";
import billyImg from "@/assets/cards/billy.png";
import blackknightImg from "@/assets/cards/black_knight.png";
import blowthehousedownImg from "@/assets/cards/blow_the_house_down.png";
import bridgetrollImg from "@/assets/cards/bridge_troll.png";
import bullseyeImg from "@/assets/cards/bullseye.png";
import cardsoldierImg from "@/assets/cards/card_soldier.png";
import cheshireImg from "@/assets/cards/cheshire.png";
import concentrateImg from "@/assets/cards/concentrate.png";
import cowardlylionImg from "@/assets/cards/cowardly_lion.png";
import darkomenImg from "@/assets/cards/Dark_Omen.png";
import deathImg from "@/assets/cards/death.png";
import defensematrixImg from "@/assets/cards/defense_matrix.png";
import donquixoteImg from "@/assets/cards/don_quixote.png";
import dorothyImg from "@/assets/cards/dorothy.png";
import drfrankImg from "@/assets/cards/dr_frank.png";
import draculaImg from "@/assets/cards/dracula.png";
import enpassantImg from "@/assets/cards/en_passant.png";
import fairygodmotherImg from "@/assets/cards/fairy_godmother.png";
import flyingmonkeyImg from "@/assets/cards/flying_monkey.png";
import franksmonsterImg from "@/assets/cards/franks_monster.png";
import freezeImg from "@/assets/cards/freeze.png";
import tuckImg from "@/assets/cards/Tuck.png";
import galahadImg from "@/assets/cards/galahad.png";
import jacksgiantImg from "@/assets/cards/jacks_giant.png";
import glindaImg from "@/assets/cards/glinda.png";
import goldeneggImg from "@/assets/cards/golden_egg.png";
import goldengooseImg from "@/assets/cards/golden_goose.png";
import goldiImg from "@/assets/cards/Goldi.png";
import grendelImg from "@/assets/cards/grendel.png";
import guyofgisborneImg from "@/assets/cards/guy_of_gisborne.png";
import headlesshorsmanImg from "@/assets/cards/headless_horseman.png";
import heroicchargeImg from "@/assets/cards/heroic_charge.png";
import huntsmanImg from "@/assets/cards/huntsman.png";
import hydeImg from "@/assets/cards/hyde.png";
import imhotepImg from "@/assets/cards/imhotep.png";
import itsaliveImg from "@/assets/cards/its_alive.png";
import jackImg from "@/assets/cards/jack.png";
import jackintheboxImg from "@/assets/cards/jack_in_the_box.png";
import jekyllImg from "@/assets/cards/jekyll.png";
import kangaImg from "@/assets/cards/kanga.png";
import kingarthurImg from "@/assets/cards/king_arthur.png";
import kingshahryarImg from "@/assets/cards/king_shahryar.png";
import ladyofthelakeImg from "@/assets/cards/lady_of_the_lake.png";
import lancelotImg from "@/assets/cards/lancelot.png";
import legionofthedeadImg from "@/assets/cards/legion_of_the_dead.png";
import lightningstrikeImg from "@/assets/cards/lightning_strike.png";
import littlejohnImg from "@/assets/cards/little_john.png";
import madhatterImg from "@/assets/cards/mad_hatter.png";
import marianImg from "@/assets/cards/marian.png";
import merlinImg from "@/assets/cards/merlin.png";
import mobyImg from "@/assets/cards/moby.png";
import morgianaImg from "@/assets/cards/morgiana.png";
import moriartyImg from "@/assets/cards/moriarty.png";
import mouseImg from "@/assets/cards/mouse.png";
import mowgliImg from "@/assets/cards/mowgli.png";
import mummyImg from "@/assets/cards/mummy.png";
import musketeerImg from "@/assets/cards/musketeer.png";
import notsolitlepigImg from "@/assets/cards/not_so_little_pig.png";
import ogreImg from "@/assets/cards/Old/v1.0.0.40/ogre.png";
import pegasusImg from "@/assets/cards/pegasus.png";
import phantomcoachmanImg from "@/assets/cards/phantom_coachman.png";
import piggybankImg from "@/assets/cards/piggy_bank.png";
import princecharmingImg from "@/assets/cards/prince_charming.png";
import princessauroraImg from "@/assets/cards/princess_aurora.png";
import quasimodoImg from "@/assets/cards/quasimodo.png";
import queenguinevereImg from "@/assets/cards/queen_guinevere.png";
import rainofarrowsImg from "@/assets/cards/Rai_of_arrows.png";
import redImg from "@/assets/cards/red.png";
import redcapImg from "@/assets/cards/Red_cap.png";
import reinforcementsImg from "@/assets/cards/reinforcements.png";
import robinhoodImg from "@/assets/cards/Robinhood.png";
import rooImg from "@/assets/cards/roo.png";
import rumpleImg from "@/assets/cards/rumple.png";
import scarecrowImg from "@/assets/cards/scarecrow.png";
import scorpionImg from "@/assets/cards/scorpion.png";
import seawitchImg from "@/assets/cards/sea_witch.png";
import searinglightImg from "@/assets/cards/searing_light.png";
import sheriffofnottinghamImg from "@/assets/cards/sheriff_of_nottingham.png";
import sherlockImg from "@/assets/cards/sherlock.png";
import shieldmaidenImg from "@/assets/cards/shield_maiden.png";
import sirenImg from "@/assets/cards/siren.png";
import snowwhiteImg from "@/assets/cards/snow_white.png";
import soldierImg from "@/assets/cards/soldier.png";
import soulsurgeImg from "@/assets/cards/soul_surge.png";
import strygaImg from "@/assets/cards/stryga.png";
import thegreenknightImg from "@/assets/cards/the_green_knight.png";
import thekrakenImg from "@/assets/cards/the_kraken.png";
import thewhitequeenImg from "@/assets/cards/the_white_queen.png";
import threeblindmiceImg from "@/assets/cards/three_blind_mice.png";
import threemusketeersImg from "@/assets/cards/three_musketeers.png";
import threenotsolitlepigImg from "@/assets/cards/three_not_so_little_pigs.png";
import tinwoodmanImg from "@/assets/cards/tin_woodman.png";
import trashfortreasureImg from "@/assets/cards/trash_for_treasure.png";
import trojanhorse from "@/assets/cards/trojan_horse.png";
import twistertossImg from "@/assets/cards/twister_toss.png";
import uglyducklingImg from "@/assets/cards/ugly_duckling.png";
import underworldflareImg from "@/assets/cards/underworld_flare.png";
import watsonImg from "@/assets/cards/watson.png";
import whiterabbitImg from "@/assets/cards/white_rabbit.png";
import wickedwitchofthewestImg from "@/assets/cards/wicked_witch_of_the_west.png";
import zorroImg from "@/assets/cards/zorro.png";
import tinsoldierImg from "@/assets/cards/Old/v1.0.0.40/tin_soldier.png";
import hanselgretelImg from "@/assets/cards/hansel_gretel.png";
import beautyImg from "@/assets/cards/beauty.png";
import wendyImg from "@/assets/cards/wendy.png";
import babayagaImg from "@/assets/cards/baba_yaga.png";
import christopherImg from "@/assets/cards/christopher.png";
import wukongImg from "@/assets/cards/wukong.png";
import genieImg from "@/assets/cards/genie.png";
import paulbunyanImg from "@/assets/cards/paul_bunyan.png";

// New cards from October 2025 patch
import animatedBroomstickImg from "@/assets/cards/Animated_Broomstick.png";
import babeTheBlueOxImg from "@/assets/cards/Babe_the_blue_ox.png";
import babyBearImg from "@/assets/cards/Baby_Bear.png";
import bagheeraImg from "@/assets/cards/Bagheera.png";
import bakerImg from "@/assets/cards/Baker.png";
import bigfootImg from "@/assets/cards/Bigfoot.png";
import brandyImg from "@/assets/cards/Brandy.png";
import butcherImg from "@/assets/cards/Butcher.png";
import cakeImg from "@/assets/cards/Cake.png";
import captainAhabImg from "@/assets/cards/Captain_Ahab.png";
import cerberusImg from "@/assets/cards/Cerberus.png";
import herculesImg from "@/assets/cards/Hercules.png";
import chimeraImg from "@/assets/cards/Chimera.png";
import dropBearImg from "@/assets/cards/Drop_Bear.png";
import firstAidImg from "@/assets/cards/First_Aid.png";
import flyingDutchmanImg from "@/assets/cards/Flying_Dutchman.png";
import hareImg from "@/assets/cards/Hare.png";
import huckFinnImg from "@/assets/cards/Huck_Finn.png";
import impunduluImg from "@/assets/cards/Impundulu.png";
import koscheiImg from "@/assets/cards/KOschei.png";
import maryImg from "@/assets/cards/Mary.png";
import momotaroImg from "@/assets/cards/Momotaro.png";
import morganLeFayImg from "@/assets/cards/Morgan_le_Fay.png";
import mortalCoilImg from "@/assets/cards/Mortal_Coil.png";
import mothmanImg from "@/assets/cards/Mothman.png";
import obliterateImg from "@/assets/cards/Obliterate.png";
import pigletImg from "@/assets/cards/Piglet.png";
import popeyeImg from "@/assets/cards/Popeye.png";
import runOverImg from "@/assets/cards/Run_Over.png";
import sandmanImg from "@/assets/cards/Sandman.png";
import sinbadImg from "@/assets/cards/Sinbad.png";
import thumbelinaImg from "@/assets/cards/Thumbelina.png";
import tinkerBellImg from "@/assets/cards/Tinker_Bell.png";
import tortoiseImg from "@/assets/cards/Tortoise.png";
import wickedStepmotherImg from "@/assets/cards/Wicked_Stepmother.png";
import winnieThePoohImg from "@/assets/cards/Winnie_the_pooh.png";
import yukiOnnaImg from "@/assets/cards/Yuki_onna.png";
import shahrazadImg from "@/assets/cards/shahrazad.png";

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
