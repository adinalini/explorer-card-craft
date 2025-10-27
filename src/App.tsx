import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Draft from "./pages/Draft";
import Room from "./pages/Room";
import RandomDeck from "./pages/RandomDeck";
import Cards from "./pages/Cards";
import Decks from "./pages/Decks";
import DeckBuilder from "./pages/DeckBuilder";
import DeckView from "./pages/DeckView";
import Patches from "./pages/Patches";
import Halloween from "./pages/Halloween";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

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
            <Route path="/halloween" element={<ProtectedRoute><Halloween /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </HelmetProvider>
  </QueryClientProvider>
);

export default App;
