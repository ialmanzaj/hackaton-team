import { useState, useEffect } from "react";
import CardCanvas from "@/components/CardCanvas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeName } from "@/lib/theme";

// Simple hook for media query (replace with robust library if needed)
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Use deprecated addListener/removeListener for broader compatibility
    try {
      mediaQueryList.addEventListener('change', listener);
    } catch (e) {
      mediaQueryList.addListener(listener); // Fallback for older browsers
    }

    return () => {
      try {
        mediaQueryList.removeEventListener('change', listener);
      } catch (e) {
        mediaQueryList.removeListener(listener); // Fallback for older browsers
      }
    };
  }, [query]);

  return matches;
};

function App() {
  const [theme, setTheme] = useState<ThemeName>('latamWhite');
  const [teamName, setTeamName] = useState('Team Name');
  const [idea, setIdea] = useState('Your Big Idea Headline Here - Keep it Punchy!');
  const [lookingFor, setLookingFor] = useState('Designers, Devs, PMs');

  const isMobile = useMediaQuery('(max-width: 480px)');
  const headlineFont = isMobile ? 72 : 96;
  const lookingForFont = 48; // Fixed size as per PRD

  const handleExport = () => {
    const canvas = document.querySelector('canvas'); // Simple selector, improve if multiple canvases exist
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `social-card-${theme}-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
      // TODO: Implement scaleAndCrop logic for different sizes (X, LinkedIn, IG)
      console.log("Basic PNG export initiated. Need to add specific sizes.")
    }
  };

  return (
    <main className="container mx-auto p-4 flex flex-col lg:flex-row gap-8">
      <div className="flex-1 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4">Social Card Generator</h1>
        
        <div>
          <Label htmlFor="theme">Theme</Label>
          <Select value={theme} onValueChange={(value) => setTheme(value as ThemeName)}>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latamWhite">LATAM White</SelectItem>
              <SelectItem value="default">Default (Dark)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="teamName">Team Name</Label>
          <Input id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="idea">Idea Headline</Label>
          <Input id="idea" value={idea} onChange={(e) => setIdea(e.target.value)} />
        </div>

        <div>
          <Label htmlFor="lookingFor">Looking For</Label>
          <Input id="lookingFor" value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} />
        </div>

        <Button onClick={handleExport} className="mt-4">Export as PNG (Base)</Button>
      </div>

      <div className="flex-1 flex items-center justify-center lg:p-8">
        {/* Preview Area */}
        <div className="w-full max-w-xl aspect-[16/9] border rounded-lg overflow-hidden shadow-lg">
          <CardCanvas 
            theme={theme}
            teamName={teamName}
            idea={idea}
            lookingFor={lookingFor}
            fontSizes={{ headline: headlineFont, lookingFor: lookingForFont }}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
