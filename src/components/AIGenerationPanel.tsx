import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Sparkles, 
  Wand2, 
  Image as ImageIcon, 
  Palette, 
  Settings,
  Download,
  RefreshCw,
  Zap
} from "lucide-react";
import { Canvas as FabricCanvas, Image as FabricImage } from "fabric";
import { toast } from "sonner";

interface AIGenerationPanelProps {
  fabricCanvas: FabricCanvas | null;
}

const artStyles = [
  "Photorealistic",
  "Digital Art", 
  "Oil Painting",
  "Watercolor",
  "Anime/Manga",
  "Cyberpunk",
  "Fantasy Art",
  "Abstract",
  "Pop Art",
  "Minimalist"
];

const aspectRatios = [
  { label: "Square (1:1)", value: "1:1", width: 512, height: 512 },
  { label: "Portrait (3:4)", value: "3:4", width: 384, height: 512 },
  { label: "Landscape (4:3)", value: "4:3", width: 512, height: 384 },
  { label: "Wide (16:9)", value: "16:9", width: 512, height: 288 }
];

export const AIGenerationPanel = ({ fabricCanvas }: AIGenerationPanelProps) => {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("blurry, low quality, distorted, ugly");
  const [selectedStyle, setSelectedStyle] = useState("Digital Art");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [steps, setSteps] = useState([20]);
  const [guidance, setGuidance] = useState([7.5]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  // Mock AI generation - in a real app, this would call an AI service
  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate an image");
      return;
    }

    setIsGenerating(true);
    
    try {
      toast.loading("AI is generating your image...", { duration: 3000 });
      
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo, we'll use a placeholder service that generates images
      const ratio = aspectRatios.find(r => r.value === selectedRatio);
      const mockImageUrl = `https://picsum.photos/${ratio?.width || 512}/${ratio?.height || 512}?random=${Date.now()}`;
      
      setGeneratedImages(prev => [mockImageUrl, ...prev.slice(0, 2)]);
      
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const addToCanvas = async (imageUrl: string) => {
    if (!fabricCanvas) return;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const fabricImage = new FabricImage(img, {
          left: 50,
          top: 50,
          scaleX: Math.min(400 / img.width, 1),
          scaleY: Math.min(400 / img.height, 1),
          cornerStyle: 'circle',
          cornerColor: '#8B5CF6',
        });
        
        fabricCanvas.add(fabricImage);
        fabricCanvas.setActiveObject(fabricImage);
        fabricCanvas.renderAll();
        
        toast.success("Image added to canvas!");
      };
      img.src = imageUrl;
    } catch (error) {
      toast.error("Failed to add image to canvas");
    }
  };

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-generated-${Date.now()}.jpg`;
    link.click();
    toast.success("Image downloaded!");
  };

  const enhancePrompt = () => {
    if (!prompt.trim()) return;
    
    const enhancedPrompt = `${prompt}, ${selectedStyle.toLowerCase()}, highly detailed, professional quality, trending on artstation, masterpiece`;
    setPrompt(enhancedPrompt);
    toast.info("Prompt enhanced with style keywords!");
  };

  return (
    <Card className="w-80 h-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Image Generation
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Prompt
          </label>
          <div className="relative">
            <Textarea
              placeholder="Describe what you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px] resize-none pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={enhancePrompt}
              className="absolute top-2 right-2 h-6 w-6 p-0"
              title="Enhance prompt"
            >
              <Zap className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Style Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Art Style
          </label>
          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {artStyles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Aspect Ratio
          </label>
          <Select value={selectedRatio} onValueChange={setSelectedRatio}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aspectRatios.map((ratio) => (
                <SelectItem key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Advanced Settings</span>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Quality Steps</span>
              <span className="text-muted-foreground">{steps[0]}</span>
            </div>
            <Slider
              value={steps}
              onValueChange={setSteps}
              max={50}
              min={10}
              step={1}
              className="w-full"
            />
          </div>

          {/* Guidance */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Creativity</span>
              <span className="text-muted-foreground">{guidance[0]}</span>
            </div>
            <Slider
              value={guidance}
              onValueChange={setGuidance}
              max={15}
              min={1}
              step={0.5}
              className="w-full"
            />
          </div>
        </div>

        {/* Negative Prompt */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Negative Prompt (Optional)</label>
          <Textarea
            placeholder="What to avoid in the image..."
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            className="min-h-[60px] resize-none text-xs"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateImage}
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
          variant="gradient"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-sm font-medium">Generated Images</h4>
            <div className="grid gap-2">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-border/50"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => addToCanvas(imageUrl)}
                      className="h-8"
                    >
                      <ImageIcon className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadImage(imageUrl)}
                      className="h-8"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  </div>
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 text-xs">Latest</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};