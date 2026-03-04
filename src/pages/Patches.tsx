import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ArrowLeft } from "lucide-react";
import { generatedPatchNotes } from "@/utils/generatedPatchNotes";
import { patchNotesData } from "@/utils/patchNotes";
import { CardImage, cardImages } from "@/components/CardImage";
import { oldCardImages } from "@/utils/oldCardImages";

const PATCH_TABS = [
  { id: 'gdc-2026', label: 'GDC 2026 (latest)' },
  { id: 'winter-2025', label: 'Winter 2025' },
];

const Patches = () => {
  const [selectedPatch, setSelectedPatch] = useState("winter-2025");
  const navigate = useNavigate();

  const patchData = generatedPatchNotes[selectedPatch];
  const miscData = patchNotesData[selectedPatch]?.miscellaneous;

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
              <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
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
          {/* Patch selector */}
          <div className="mb-8 flex items-center justify-center gap-4">
            {PATCH_TABS.map(tab => (
              <Button
                key={tab.id}
                variant={selectedPatch === tab.id ? "default" : "outline"}
                onClick={() => setSelectedPatch(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* GDC 2026 - placeholder */}
          {selectedPatch === "gdc-2026" && (
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold mb-4 text-foreground">GDC 2026</h2>
              <p className="text-muted-foreground text-lg">Patch notes coming soon...</p>
            </div>
          )}

          {/* Winter 2025 (or any patch with data) */}
          {selectedPatch !== "gdc-2026" && patchData && (
            <div className="space-y-12">
              {/* Card Updates */}
              {patchData.cardUpdates.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">Card Updates</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {patchData.cardUpdates.map((card) => {
                      // For renamed cards, use the old card ID's old image
                      const oldImageCardId = card.changeType === 'renamed' && card.formerName
                        ? card.cardId  // the new ID maps to old image in oldCardImages
                        : card.cardId;
                      const oldImage = oldCardImages[oldImageCardId];
                      const newImage = cardImages[card.cardId];
                      
                      if (!oldImage || !newImage) return null;

                      const displayName = card.formerName
                        ? `${card.name} (formerly ${card.formerName})`
                        : card.name;

                      return (
                        <div key={card.cardId} className="bg-card rounded-lg p-4 border border-border">
                          <h3 className="text-lg font-semibold mb-3 text-center text-card-foreground">{displayName}</h3>
                          <div className="flex items-center justify-center gap-3">
                            <img src={oldImage} alt={`Old ${card.name}`} className="w-40 sm:w-48 h-auto rounded-lg border-2 border-border" loading="lazy" />
                            <div className="text-2xl text-primary">→</div>
                            <img src={newImage} alt={`New ${card.name}`} className="w-40 sm:w-48 h-auto rounded-lg border-2 border-primary" loading="lazy" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}


              {/* Removed Cards */}
              {patchData.removedCards.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">Removed Cards</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {patchData.removedCards.map((card) => (
                      <div key={card.cardId} className="bg-card rounded-lg p-4 border border-border text-center">
                        <CardImage cardId={card.cardId} cardName={card.name} className="w-full h-auto rounded-lg border-2 border-destructive mb-2" />
                        <p className="text-sm font-medium text-card-foreground">{card.name}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* New Cards */}
              {patchData.newCards.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">New Cards</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {patchData.newCards.map((card) => (
                      <div key={card.cardId} className="bg-card rounded-lg p-4 border border-border text-center">
                        <CardImage cardId={card.cardId} cardName={card.name} className="w-full h-auto rounded-lg border-2 border-primary mb-2" />
                        <p className="text-sm font-medium text-card-foreground">{card.name}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Miscellaneous Updates (manual content from patchNotes.ts) */}
              {miscData && (
                <section>
                  <h2 className="text-3xl font-bold mb-6 text-foreground">Miscellaneous Updates</h2>
                  <div className="space-y-6">
                    {miscData.bulletPoints.length > 0 && (
                      <ul className="list-disc list-inside space-y-3 text-foreground text-lg">
                        {miscData.bulletPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    )}

                    {miscData.sections?.map((section, i) => (
                      <div key={i} className="mt-8">
                        <h3 className="text-2xl font-semibold mb-4 text-foreground">{section.title}</h3>
                        {section.content && section.content.split('\n\n').map((paragraph, pi) => (
                          <p key={pi} className="text-foreground text-lg mb-6">{paragraph}</p>
                        ))}
                        {section.images && section.images.length > 0 && (
                          <div className="space-y-4">
                            {section.images.map((img, ii) => (
                              <img key={ii} src={img.src} alt={img.alt} className="w-full max-w-4xl mx-auto rounded-lg border-2 border-primary" loading="lazy" />
                            ))}
                          </div>
                        )}
                        {section.videos && section.videos.length > 0 && (
                          <div className="space-y-4">
                            {section.videos.map((vid, vi) => (
                              <video key={vi} autoPlay loop muted playsInline className="w-full max-w-4xl mx-auto rounded-lg border-2 border-primary" poster={vid.poster}>
                                <source src={vid.src} type="video/mp4" />
                              </video>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Legendary Powers section — specific to Winter 2025 */}
                    {selectedPatch === 'winter-2025' && (
                      <div className="mt-8">
                        <h3 className="text-2xl font-semibold mb-4 text-foreground">New Mechanic (Legendary Powers)</h3>
                        <p className="text-foreground text-lg mb-6">
                          Legendaries now have a one time effect at the start of the game, all legendaries will eventually have one.
                        </p>
                        <p className="text-foreground text-lg mb-6">
                          In the first batch, these 5 legendaries got a power:
                        </p>
                        <div className="grid grid-cols-1 gap-8">
                          {[
                            { name: 'Death', num: 1 },
                            { name: 'Dorothy', num: 2 },
                            { name: 'Dracula', num: 3 },
                            { name: 'Red', num: 4 },
                            { name: 'Robin Hood', num: 5, folder: 'robinhood' },
                          ].map(({ name, num, folder }) => {
                            const key = folder || name.toLowerCase();
                            return (
                              <div key={key}>
                                <h4 className="text-2xl font-semibold mb-4 text-foreground">{num}. {name}</h4>
                                <div className="flex flex-col lg:flex-row gap-6 items-center">
                                  <img
                                    src={`/patches/october/miscellaneous/${key}.png`}
                                    alt={`${name} Legendary Power`}
                                    className="w-full lg:w-[21rem] rounded-lg border-2 border-primary"
                                    loading="lazy"
                                  />
                                  <video autoPlay loop muted playsInline className="w-full lg:w-[37rem] rounded-lg border-2 border-primary">
                                    <source src={`/patches/october/miscellaneous/${key}.mp4`} type="video/mp4" />
                                  </video>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Patches;
