import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";
import Navigation from "@/components/Navigation";
import MeshBackground from "@/components/MeshBackground";
import ShaderBackground from "@/components/ui/shader-background";
import CustomCursor from "@/components/CustomCursor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HeroUIProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="overflow-x-hidden w-full">
            <ShaderBackground />
            <MeshBackground />
            <CustomCursor />
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/gallery" element={<Portfolio />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </HeroUIProvider>
  </QueryClientProvider>
);

export default App;
