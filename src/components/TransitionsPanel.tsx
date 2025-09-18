import { useState } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Layers, 
  RotateCw,
  Shuffle,
  Sparkles,
  Wind,
  Waves,
  Sun,
  Moon,
  Star,
  Heart,
  Snowflake
} from "lucide-react";
import { toast } from "sonner";

interface Transition {
  id: string;
  name: string;
  icon: any;
  type: 'slide' | 'fade' | 'zoom' | 'rotate' | 'special';
  duration: number;
  preview: string;
}

interface Effect {
  id: string;
  name: string;
  icon: any;
  type: 'filter' | 'overlay' | 'animation';
  description: string;
}

interface TransitionsPanelProps {
  onTransitionApply: (transition: Transition) => void;
  onEffectApply: (effect: Effect) => void;
}

const transitions: Transition[] = [
  { id: 'fade', name: 'Fade', icon: Layers, type: 'fade', duration: 1, preview: 'Smooth fade in/out' },
  { id: 'slide-left', name: 'Slide Left', icon: Wind, type: 'slide', duration: 0.8, preview: 'Slide from right to left' },
  { id: 'slide-right', name: 'Slide Right', icon: Wind, type: 'slide', duration: 0.8, preview: 'Slide from left to right' },
  { id: 'zoom-in', name: 'Zoom In', icon: Zap, type: 'zoom', duration: 1.2, preview: 'Zoom into the scene' },
  { id: 'zoom-out', name: 'Zoom Out', icon: Zap, type: 'zoom', duration: 1.2, preview: 'Zoom out of scene' },
  { id: 'rotate', name: 'Rotate', icon: RotateCw, type: 'rotate', duration: 1.5, preview: 'Spinning transition' },
  { id: 'dissolve', name: 'Dissolve', icon: Sparkles, type: 'special', duration: 2, preview: 'Particle dissolve effect' },
  { id: 'wipe', name: 'Wipe', icon: Waves, type: 'special', duration: 1, preview: 'Wipe across screen' },
];

const videoEffects: Effect[] = [
  { id: 'glow', name: 'Glow', icon: Sun, type: 'filter', description: 'Add soft glow effect' },
  { id: 'vintage', name: 'Vintage', icon: Moon, type: 'filter', description: 'Retro film look' },
  { id: 'particles', name: 'Particles', icon: Star, type: 'overlay', description: 'Floating particles' },
  { id: 'hearts', name: 'Hearts', icon: Heart, type: 'overlay', description: 'Animated hearts' },
  { id: 'snow', name: 'Snow', icon: Snowflake, type: 'overlay', description: 'Falling snow effect' },
  { id: 'shake', name: 'Shake', icon: Shuffle, type: 'animation', description: 'Camera shake effect' },
];

export const TransitionsPanel = ({ onTransitionApply, onEffectApply }: TransitionsPanelProps) => {
  const [selectedTransition, setSelectedTransition] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [transitionDuration, setTransitionDuration] = useState([1]);
  const [effectIntensity, setEffectIntensity] = useState([50]);

  const applyTransition = (transition: Transition) => {
    const customTransition = {
      ...transition,
      duration: transitionDuration[0]
    };
    
    onTransitionApply(customTransition);
    setSelectedTransition(transition.id);
    toast.success(`${transition.name} transition applied!`);
  };

  const applyEffect = (effect: Effect) => {
    onEffectApply(effect);
    setSelectedEffect(effect.id);
    toast.success(`${effect.name} effect applied!`);
  };

  const previewTransition = (transition: Transition) => {
    toast.info(`Preview: ${transition.preview}`);
  };

  const removeTransition = () => {
    setSelectedTransition(null);
    toast.success("Transition removed");
  };

  const removeEffect = () => {
    setSelectedEffect(null);
    toast.success("Effect removed");
  };

  return (
    <Card className="w-80 h-full bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Transitions & Effects
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
        <Tabs defaultValue="transitions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transitions">Transitions</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
          </TabsList>

          <TabsContent value="transitions" className="space-y-4 mt-4">
            {/* Duration Control */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Duration</span>
                <span className="text-muted-foreground">{transitionDuration[0]}s</span>
              </div>
              <Slider
                value={transitionDuration}
                onValueChange={setTransitionDuration}
                max={5}
                min={0.2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Active Transition */}
            {selectedTransition && (
              <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="default" className="text-xs">
                    Active Transition
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeTransition}
                    className="text-xs h-6 px-2"
                  >
                    Remove
                  </Button>
                </div>
                <div className="text-sm font-medium">
                  {transitions.find(t => t.id === selectedTransition)?.name}
                </div>
              </div>
            )}

            {/* Transition Grid */}
            <div className="grid grid-cols-2 gap-2">
              {transitions.map((transition) => (
                <div key={transition.id} className="space-y-1">
                  <Button
                    variant={selectedTransition === transition.id ? "tool-active" : "tool"}
                    size="sm"
                    onClick={() => applyTransition(transition)}
                    className="w-full flex flex-col items-center gap-1 h-auto p-3"
                  >
                    <transition.icon className="w-4 h-4" />
                    <span className="text-xs">{transition.name}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => previewTransition(transition)}
                    className="w-full text-xs h-6 text-muted-foreground hover:text-foreground"
                  >
                    Preview
                  </Button>
                </div>
              ))}
            </div>

            {/* Transition Types */}
            <div className="space-y-3 border-t pt-4">
              <h4 className="text-sm font-medium">Quick Apply</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyTransition(transitions[0])} // Fade
                  className="text-xs"
                >
                  <Layers className="w-3 h-3 mr-1" />
                  Fade
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applyTransition(transitions[3])} // Zoom In
                  className="text-xs"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Zoom
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4 mt-4">
            {/* Effect Intensity */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Intensity</span>
                <span className="text-muted-foreground">{effectIntensity[0]}%</span>
              </div>
              <Slider
                value={effectIntensity}
                onValueChange={setEffectIntensity}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            {/* Active Effect */}
            {selectedEffect && (
              <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    Active Effect
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeEffect}
                    className="text-xs h-6 px-2"
                  >
                    Remove
                  </Button>
                </div>
                <div className="text-sm font-medium">
                  {videoEffects.find(e => e.id === selectedEffect)?.name}
                </div>
              </div>
            )}

            {/* Effects by Category */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Filters</h4>
                <div className="grid grid-cols-2 gap-2">
                  {videoEffects.filter(e => e.type === 'filter').map((effect) => (
                    <Button
                      key={effect.id}
                      variant={selectedEffect === effect.id ? "tool-active" : "tool"}
                      size="sm"
                      onClick={() => applyEffect(effect)}
                      className="flex flex-col items-center gap-1 h-auto p-3"
                      title={effect.description}
                    >
                      <effect.icon className="w-4 h-4" />
                      <span className="text-xs">{effect.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Overlays</h4>
                <div className="grid grid-cols-2 gap-2">
                  {videoEffects.filter(e => e.type === 'overlay').map((effect) => (
                    <Button
                      key={effect.id}
                      variant={selectedEffect === effect.id ? "tool-active" : "tool"}
                      size="sm"
                      onClick={() => applyEffect(effect)}
                      className="flex flex-col items-center gap-1 h-auto p-3"
                      title={effect.description}
                    >
                      <effect.icon className="w-4 h-4" />
                      <span className="text-xs">{effect.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Animations</h4>
                <div className="grid grid-cols-2 gap-2">
                  {videoEffects.filter(e => e.type === 'animation').map((effect) => (
                    <Button
                      key={effect.id}
                      variant={selectedEffect === effect.id ? "tool-active" : "tool"}
                      size="sm"
                      onClick={() => applyEffect(effect)}
                      className="flex flex-col items-center gap-1 h-auto p-3"
                      title={effect.description}
                    >
                      <effect.icon className="w-4 h-4" />
                      <span className="text-xs">{effect.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-3 border-t pt-4">
              <h4 className="text-sm font-medium">Quick Presets</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    applyEffect(videoEffects.find(e => e.id === 'vintage')!);
                    applyEffect(videoEffects.find(e => e.id === 'particles')!);
                  }}
                  className="w-full text-xs justify-start"
                >
                  <Sparkles className="w-3 h-3 mr-2" />
                  Vintage + Particles
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    applyEffect(videoEffects.find(e => e.id === 'glow')!);
                    applyEffect(videoEffects.find(e => e.id === 'hearts')!);
                  }}
                  className="w-full text-xs justify-start"
                >
                  <Heart className="w-3 h-3 mr-2" />
                  Romantic Glow
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};