import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Lazy load page components for code splitting
const Index = lazy(() => import("./pages/Index"));
const Draft = lazy(() => import("./pages/Draft"));
const Room = lazy(() => import("./pages/Room"));
const RandomDeck = lazy(() => import("./pages/RandomDeck"));
const Cards = lazy(() => import("./pages/Cards"));
const Decks = lazy(() => import("./pages/Decks"));
const DeckBuilder = lazy(() => import("./pages/DeckBuilder"));
const DeckView = lazy(() => import("./pages/DeckView"));
const Patches = lazy(() => import("./pages/Patches"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="dark" 
        enableSystem={false} 
        storageKey="project-o-zone-theme"
        disableTransitionOnChange={false}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/draft" element={<ProtectedRoute><Draft /></ProtectedRoute>} />
                <Route path="/room/:roomId" element={<ProtectedRoute><Room /></ProtectedRoute>} />
                <Route path="/random" element={<ProtectedRoute><RandomDeck /></ProtectedRoute>} />
                <Route path="/cards" element={<ProtectedRoute><Cards /></ProtectedRoute>} />
                <Route path="/decks" element={<ProtectedRoute><Decks /></ProtectedRoute>} />
                <Route path="/deck-builder" element={<ProtectedRoute><DeckBuilder /></ProtectedRoute>} />
                <Route path="/deck/:id" element={<ProtectedRoute><DeckView /></ProtectedRoute>} />
                <Route path="/patches" element={<ProtectedRoute><Patches /></ProtectedRoute>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </HelmetProvider>
  </QueryClientProvider>
);

export default App;
