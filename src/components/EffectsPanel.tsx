import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Sun, 
  Moon, 
  Contrast, 
  Gauge, 
  Droplets,
  Zap,
  Sparkles,
  Wind,
  Eye,
  Target
} from "lucide-react";
import { Canvas as FabricCanvas } from "fabric";

interface Effect {
  name: string;
  icon: any;
  type: 'filter' | 'adjustment';
  values?: { [key: string]: number };
}

interface EffectsPanelProps {
  fabricCanvas: FabricCanvas | null;
  onEffectApply: (effect: Effect) => void;
}

const filters: Effect[] = [
  { name: "Vintage", icon: Sparkles, type: 'filter' },
  { name: "Noir", icon: Moon, type: 'filter' },
  { name: "Vibrant", icon: Zap, type: 'filter' },
  { name: "Soft", icon: Wind, type: 'filter' },
  { name: "Sharp", icon: Target, type: 'filter' },
  { name: "Blur", icon: Droplets, type: 'filter' },
];

export const EffectsPanel = ({ fabricCanvas, onEffectApply }: EffectsPanelProps) => {
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [brightness, setBrightness] = useState([0]);
  const [contrast, setContrast] = useState([0]);
  const [saturation, setSaturation] = useState([0]);
  const [hue, setHue] = useState([0]);

  const applyImageFilter = (filterName: string) => {
    if (!fabricCanvas) return;

    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') return;

    let filters: any[] = [];

    switch (filterName) {
      case 'Vintage':
        filters = [
          new (window as any).fabric.Image.filters.Sepia(),
          new (window as any).fabric.Image.filters.Brightness({ brightness: 0.1 }),
          new (window as any).fabric.Image.filters.Contrast({ contrast: 0.2 })
        ];
        break;
      case 'Noir':
        filters = [
          new (window as any).fabric.Image.filters.Grayscale(),
          new (window as any).fabric.Image.filters.Contrast({ contrast: 0.3 })
        ];
        break;
      case 'Vibrant':
        filters = [
          new (window as any).fabric.Image.filters.Saturation({ saturation: 0.5 }),
          new (window as any).fabric.Image.filters.Brightness({ brightness: 0.1 })
        ];
        break;
      case 'Soft':
        filters = [new (window as any).fabric.Image.filters.Blur({ blur: 0.2 })];
        break;
      case 'Sharp':
        filters = [new (window as any).fabric.Image.filters.Convolute({
          matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0]
        })];
        break;
      case 'Blur':
        filters = [new (window as any).fabric.Image.filters.Blur({ blur: 0.5 })];
        break;
    }

    (activeObject as any).filters = filters;
    (activeObject as any).applyFilters();
    fabricCanvas.renderAll();

    onEffectApply({ name: filterName, icon: filters, type: 'filter' });
    setActiveEffect(filterName);
  };

  const applyAdjustment = (type: string, value: number) => {
    if (!fabricCanvas) return;

    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') return;

    let filter: any;

    switch (type) {
      case 'brightness':
        filter = new (window as any).fabric.Image.filters.Brightness({ brightness: value / 100 });
        break;
      case 'contrast':
        filter = new (window as any).fabric.Image.filters.Contrast({ contrast: value / 100 });
        break;
      case 'saturation':
        filter = new (window as any).fabric.Image.filters.Saturation({ saturation: value / 100 });
        break;
      case 'hue':
        filter = new (window as any).fabric.Image.filters.HueRotation({ rotation: value / 100 });
        break;
    }

    const existingFilters = (activeObject as any).filters || [];
    const filterIndex = existingFilters.findIndex((f: any) => f.type === filter.type);
    
    if (filterIndex >= 0) {
      existingFilters[filterIndex] = filter;
    } else {
      existingFilters.push(filter);
    }

    (activeObject as any).filters = existingFilters;
    (activeObject as any).applyFilters();
    fabricCanvas.renderAll();
  };

  const resetEffects = () => {
    if (!fabricCanvas) return;

    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') return;

    (activeObject as any).filters = [];
    (activeObject as any).applyFilters();
    fabricCanvas.renderAll();

    setActiveEffect(null);
    setBrightness([0]);
    setContrast([0]);
    setSaturation([0]);
    setHue([0]);
  };

  return (
    <Card className="w-80 h-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Effects & Adjustments
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
        <Tabs defaultValue="filters" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
          </TabsList>

          <TabsContent value="filters" className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter.name}
                  variant={activeEffect === filter.name ? "tool-active" : "tool"}
                  size="sm"
                  onClick={() => applyImageFilter(filter.name)}
                  className="flex flex-col items-center gap-1 h-auto p-3"
                >
                  <filter.icon className="w-4 h-4" />
                  <span className="text-xs">{filter.name}</span>
                </Button>
              ))}
            </div>

            {activeEffect && (
              <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {activeEffect} Applied
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetEffects}
                    className="text-xs h-6 px-2"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="adjustments" className="space-y-4 mt-4">
            <div className="space-y-4">
              {/* Brightness */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Brightness</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {brightness[0]}
                  </span>
                </div>
                <Slider
                  value={brightness}
                  onValueChange={(value) => {
                    setBrightness(value);
                    applyAdjustment('brightness', value[0]);
                  }}
                  max={100}
                  min={-100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Contrast className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Contrast</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {contrast[0]}
                  </span>
                </div>
                <Slider
                  value={contrast}
                  onValueChange={(value) => {
                    setContrast(value);
                    applyAdjustment('contrast', value[0]);
                  }}
                  max={100}
                  min={-100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Saturation</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {saturation[0]}
                  </span>
                </div>
                <Slider
                  value={saturation}
                  onValueChange={(value) => {
                    setSaturation(value);
                    applyAdjustment('saturation', value[0]);
                  }}
                  max={100}
                  min={-100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Hue */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Hue</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {hue[0]}°
                  </span>
                </div>
                <Slider
                  value={hue}
                  onValueChange={(value) => {
                    setHue(value);
                    applyAdjustment('hue', value[0]);
                  }}
                  max={180}
                  min={-180}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              variant="outline"
              onClick={resetEffects}
              className="w-full"
            >
              Reset All Adjustments
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};