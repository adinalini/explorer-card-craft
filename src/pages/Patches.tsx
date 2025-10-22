import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft } from "lucide-react";

// Old card images (from v1.0.0.40 folder)
import oldAxeThrow from "@/assets/cards/Old/v1.0.0.40/axe_throw.png";
import oldBeast from "@/assets/cards/Old/v1.0.0.40/beast.png";
import oldBeauty from "@/assets/cards/Old/v1.0.0.40/beauty.png";
import oldBlowTheHouseDown from "@/assets/cards/Old/v1.0.0.40/blow_the_house_down.png";
import oldBridgeTroll from "@/assets/cards/Old/v1.0.0.40/bridge_troll.png";
import oldBullseye from "@/assets/cards/Old/v1.0.0.40/bullseye.png";
import oldCheshire from "@/assets/cards/Old/v1.0.0.40/cheshire.png";
import oldCowardlyLion from "@/assets/cards/Old/v1.0.0.40/cowardly_lion.png";
import oldDarkOmen from "@/assets/cards/Old/v1.0.0.40/dark_omen.png";
import oldFlyingMonkey from "@/assets/cards/Old/v1.0.0.40/flying_monkey.png";
import oldFriarTuck from "@/assets/cards/Old/v1.0.0.40/friar_tuck.png";
import oldGiant from "@/assets/cards/Old/v1.0.0.40/giant.png";
import oldGoldilocks from "@/assets/cards/Old/v1.0.0.40/goldilocks.png";
import oldJackInTheBox from "@/assets/cards/Old/v1.0.0.40/jack_in_the_box.png";
import oldLadyOfTheLake from "@/assets/cards/Old/v1.0.0.40/lady_of_the_lake.png";
import oldMorgiana from "@/assets/cards/Old/v1.0.0.40/morgiana.png";
import oldMummy from "@/assets/cards/Old/v1.0.0.40/mummy.png";
import oldPhantomCoachman from "@/assets/cards/Old/v1.0.0.40/phantom_coachman.png";
import oldQuasimodo from "@/assets/cards/Old/v1.0.0.40/quasimodo.png";
import oldRainOfArrows from "@/assets/cards/Old/v1.0.0.40/rain_of_arrows.png";
import oldRed from "@/assets/cards/Old/v1.0.0.40/red.png";
import oldRedcap from "@/assets/cards/Old/v1.0.0.40/redcap.png";
import oldRobinHood from "@/assets/cards/Old/v1.0.0.40/robin_hood.png";
import oldSheriffOfNottingham from "@/assets/cards/Old/v1.0.0.40/sheriff_of_nottingham.png";
import oldTheKraken from "@/assets/cards/Old/v1.0.0.40/the_kraken.png";
import oldThreeMusketeers from "@/assets/cards/Old/v1.0.0.40/three_musketeers.png";
import oldTinWoodman from "@/assets/cards/Old/v1.0.0.40/tin_woodman.png";
import oldTinSoldier from "@/assets/cards/Old/v1.0.0.40/tin_soldier.png";
import oldOgre from "@/assets/cards/Old/v1.0.0.40/ogre.png";

// New card images
import newAxeThrow from "@/assets/cards/axe_throw.png";
import newBeast from "@/assets/cards/beast.png";
import newBeauty from "@/assets/cards/beauty.png";
import newBlowTheHouseDown from "@/assets/cards/blow_the_house_down.png";
import newBridgeTroll from "@/assets/cards/bridge_troll.png";
import newBullseye from "@/assets/cards/bullseye.png";
import newCheshire from "@/assets/cards/cheshire.png";
import newCowardlyLion from "@/assets/cards/cowardly_lion.png";
import newDarkOmen from "@/assets/cards/Dark_Omen.png";
import newFlyingMonkey from "@/assets/cards/flying_monkey.png";
import newTuck from "@/assets/cards/Tuck.png";
import newJacksGiant from "@/assets/cards/jacks_giant.png";
import newGoldi from "@/assets/cards/Goldi.png";
import newJackInTheBox from "@/assets/cards/jack_in_the_box.png";
import newLadyOfTheLake from "@/assets/cards/lady_of_the_lake.png";
import newMorgiana from "@/assets/cards/morgiana.png";
import newMummy from "@/assets/cards/mummy.png";
import newPhantomCoachman from "@/assets/cards/phantom_coachman.png";
import newQuasimodo from "@/assets/cards/quasimodo.png";
import newRainOfArrows from "@/assets/cards/Rai_of_arrows.png";
import newRed from "@/assets/cards/red.png";
import newRedcap from "@/assets/cards/Red_cap.png";
import newRobinhood from "@/assets/cards/Robinhood.png";
import newSheriffOfNottingham from "@/assets/cards/sheriff_of_nottingham.png";
import newTheKraken from "@/assets/cards/the_kraken.png";
import newThreeMusketeers from "@/assets/cards/three_musketeers.png";
import newTinWoodman from "@/assets/cards/tin_woodman.png";

// Import all new cards (added in this patch)
import animatedBroomstick from "@/assets/cards/Animated_Broomstick.png";
import babeTheBlueOx from "@/assets/cards/Babe_the_blue_ox.png";
import babyBear from "@/assets/cards/Baby_Bear.png";
import bagheera from "@/assets/cards/Bagheera.png";
import baker from "@/assets/cards/Baker.png";
import bigfoot from "@/assets/cards/Bigfoot.png";
import brandy from "@/assets/cards/Brandy.png";
import butcher from "@/assets/cards/Butcher.png";
import cake from "@/assets/cards/Cake.png";
import captainAhab from "@/assets/cards/Captain_Ahab.png";
import cerberus from "@/assets/cards/Cerberus.png";
import chimera from "@/assets/cards/Chimera.png";
import dropBear from "@/assets/cards/Drop_Bear.png";
import firstAid from "@/assets/cards/First_Aid.png";
import flyingDutchman from "@/assets/cards/Flying_Dutchman.png";
import hare from "@/assets/cards/Hare.png";
import hercules from "@/assets/cards/Hercules.png";
import huckFinn from "@/assets/cards/Huck_Finn.png";
import impundulu from "@/assets/cards/Impundulu.png";
import koschei from "@/assets/cards/KOschei.png";
import mary from "@/assets/cards/Mary.png";
import momotaro from "@/assets/cards/Momotaro.png";
import morganLeFay from "@/assets/cards/Morgan_le_Fay.png";
import mortalCoil from "@/assets/cards/Mortal_Coil.png";
import mothman from "@/assets/cards/Mothman.png";
import obliterate from "@/assets/cards/Obliterate.png";
import piglet from "@/assets/cards/Piglet.png";
import popeye from "@/assets/cards/Popeye.png";
import runOver from "@/assets/cards/Run_Over.png";
import sandman from "@/assets/cards/Sandman.png";
import sinbad from "@/assets/cards/Sinbad.png";
import thumbelina from "@/assets/cards/Thumbelina.png";
import tinkerBell from "@/assets/cards/Tinker_Bell.png";
import tortoise from "@/assets/cards/Tortoise.png";
import wickedStepmother from "@/assets/cards/Wicked_Stepmother.png";
import winnieThePooh from "@/assets/cards/Winnie_the_pooh.png";
import yukiOnna from "@/assets/cards/Yuki_onna.png";

const Patches = () => {
  const [selectedPatch, setSelectedPatch] = useState("october-2025");
  const navigate = useNavigate();

  const cardUpdates = [
    { name: "Axe Throw", old: oldAxeThrow, new: newAxeThrow },
    { name: "Beast", old: oldBeast, new: newBeast },
    { name: "Beauty", old: oldBeauty, new: newBeauty },
    { name: "Blow the House Down", old: oldBlowTheHouseDown, new: newBlowTheHouseDown },
    { name: "Bridge Troll", old: oldBridgeTroll, new: newBridgeTroll },
    { name: "Bullseye", old: oldBullseye, new: newBullseye },
    { name: "Cheshire", old: oldCheshire, new: newCheshire },
    { name: "Cowardly Lion", old: oldCowardlyLion, new: newCowardlyLion },
    { name: "Dark Omen", old: oldDarkOmen, new: newDarkOmen },
    { name: "Flying Monkey", old: oldFlyingMonkey, new: newFlyingMonkey },
    { name: "Tuck (formerly Friar Tuck)", old: oldFriarTuck, new: newTuck },
    { name: "Jack's Giant (formerly Giant)", old: oldGiant, new: newJacksGiant },
    { name: "Goldi (formerly Goldilocks)", old: oldGoldilocks, new: newGoldi },
    { name: "Jack in the Box", old: oldJackInTheBox, new: newJackInTheBox },
    { name: "Lady of the Lake", old: oldLadyOfTheLake, new: newLadyOfTheLake },
    { name: "Morgiana", old: oldMorgiana, new: newMorgiana },
    { name: "Mummy", old: oldMummy, new: newMummy },
    { name: "Phantom Coachman", old: oldPhantomCoachman, new: newPhantomCoachman },
    { name: "Quasimodo", old: oldQuasimodo, new: newQuasimodo },
    { name: "Rain of Arrows", old: oldRainOfArrows, new: newRainOfArrows },
    { name: "Red", old: oldRed, new: newRed },
    { name: "Redcap", old: oldRedcap, new: newRedcap },
    { name: "Robin Hood", old: oldRobinHood, new: newRobinhood },
    { name: "Sheriff of Nottingham", old: oldSheriffOfNottingham, new: newSheriffOfNottingham },
    { name: "The Kraken", old: oldTheKraken, new: newTheKraken },
    { name: "Three Musketeers", old: oldThreeMusketeers, new: newThreeMusketeers },
    { name: "Tin Woodman", old: oldTinWoodman, new: newTinWoodman },
  ];

  const removedCards = [
    { name: "Tin Soldier", image: oldTinSoldier },
    { name: "Ogre", image: oldOgre },
  ];

  const newCards = [
    { name: "Animated Broomstick", image: animatedBroomstick },
    { name: "Babe the Blue Ox", image: babeTheBlueOx },
    { name: "Baby Bear", image: babyBear },
    { name: "Bagheera", image: bagheera },
    { name: "Baker", image: baker },
    { name: "Bigfoot", image: bigfoot },
    { name: "Brandy", image: brandy },
    { name: "Butcher", image: butcher },
    { name: "Cake", image: cake },
    { name: "Captain Ahab", image: captainAhab },
    { name: "Cerberus", image: cerberus },
    { name: "Chimera", image: chimera },
    { name: "Drop Bear", image: dropBear },
    { name: "First Aid", image: firstAid },
    { name: "Flying Dutchman", image: flyingDutchman },
    { name: "Hare", image: hare },
    { name: "Hercules", image: hercules },
    { name: "Huck Finn", image: huckFinn },
    { name: "Impundulu", image: impundulu },
    { name: "Koschei", image: koschei },
    { name: "Mary", image: mary },
    { name: "Momotaro", image: momotaro },
    { name: "Morgan le Fay", image: morganLeFay },
    { name: "Mortal Coil", image: mortalCoil },
    { name: "Mothman", image: mothman },
    { name: "Obliterate", image: obliterate },
    { name: "Piglet", image: piglet },
    { name: "Popeye", image: popeye },
    { name: "Run Over", image: runOver },
    { name: "Sandman", image: sandman },
    { name: "Sinbad", image: sinbad },
    { name: "Thumbelina", image: thumbelina },
    { name: "Tinker Bell", image: tinkerBell },
    { name: "Tortoise", image: tortoise },
    { name: "Wicked Stepmother", image: wickedStepmother },
    { name: "Winnie the Pooh", image: winnieThePooh },
    { name: "Yuki-onna", image: yukiOnna },
  ];

  return (
    <>
      <SEOHead
        title="Patch Notes - Project O Zone"
        description="View all patch notes and updates for Project O Zone card game"
      />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
        {/* Header */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 relative">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <ThemeToggle />
            </div>
            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl font-bold text-foreground">Patch Notes</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Patch selector buttons */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <Button
              variant={selectedPatch === "october-2025" ? "default" : "outline"}
              onClick={() => setSelectedPatch("october-2025")}
            >
              October 2025 (latest)
            </Button>
          </div>

          {/* October 2025 Patch Content */}
          {selectedPatch === "october-2025" && (
            <div className="space-y-12">
              {/* Card Updates Section */}
              <section>
                <h2 className="text-3xl font-bold mb-6 text-foreground">Card Updates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cardUpdates.map((card, index) => (
                    <div key={index} className="bg-card rounded-lg p-4 border border-border">
                      <h3 className="text-lg font-semibold mb-3 text-center text-card-foreground">{card.name}</h3>
                      <div className="flex items-center justify-center gap-3">
                        <img
                          src={card.old}
                          alt={`Old ${card.name}`}
                          className="w-40 sm:w-48 h-auto rounded-lg border-2 border-border"
                        />
                        <div className="text-2xl text-primary">→</div>
                        <img
                          src={card.new}
                          alt={`New ${card.name}`}
                          className="w-40 sm:w-48 h-auto rounded-lg border-2 border-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Removed Cards Section */}
              <section>
                <h2 className="text-3xl font-bold mb-6 text-foreground">Removed Cards</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {removedCards.map((card, index) => (
                    <div key={index} className="bg-card rounded-lg p-4 border border-destructive text-center">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-auto rounded-lg border-2 border-destructive mb-2 opacity-60"
                      />
                      <p className="text-sm font-medium text-card-foreground">{card.name}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* New Cards Section */}
              <section>
                <h2 className="text-3xl font-bold mb-6 text-foreground">New Cards</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {newCards.map((card, index) => (
                    <div key={index} className="bg-card rounded-lg p-4 border border-border text-center">
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-auto rounded-lg border-2 border-primary mb-2"
                      />
                      <p className="text-sm font-medium text-card-foreground">{card.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Patches;
