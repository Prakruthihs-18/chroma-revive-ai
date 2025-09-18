import { useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { ChromaHeader, EditorMode } from "@/components/ChromaHeader";
import { ToolPanel, Tool } from "@/components/ToolPanel";
import { ChromaCanvas } from "@/components/ChromaCanvas";
import { EffectsPanel } from "@/components/EffectsPanel";
import { AIGenerationPanel } from "@/components/AIGenerationPanel";
import { VideoEditor } from "@/components/VideoEditor";
import { TransitionsPanel } from "@/components/TransitionsPanel";
import { toast } from "sonner";

const ChromaRevive = () => {
  const [mode, setMode] = useState<EditorMode>('image');
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [activeColor, setActiveColor] = useState("#8B5CF6");
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleCanvasReady = useCallback((canvas: FabricCanvas) => {
    setFabricCanvas(canvas);
    
    // Set up history tracking
    canvas.on('path:created', updateHistory);
    canvas.on('object:added', updateHistory);  
    canvas.on('object:modified', updateHistory);
    canvas.on('object:removed', updateHistory);
  }, []);

  const updateHistory = useCallback(() => {
    // This would be where you implement proper undo/redo history
    // For now, just placeholder state
    setCanUndo(true);
    setCanRedo(false);
  }, []);

  const handleUpload = useCallback(() => {
    if (fabricCanvas && (fabricCanvas as any).triggerUpload) {
      (fabricCanvas as any).triggerUpload();
    }
  }, [fabricCanvas]);

  const handleSave = useCallback(() => {
    if (!fabricCanvas) return;
    
    // Save project to localStorage for demo
    const canvasData = JSON.stringify(fabricCanvas.toJSON());
    localStorage.setItem('chroma-project', canvasData);
    toast.success("Project saved successfully!");
  }, [fabricCanvas]);

  const handleExport = useCallback(() => {
    if (!fabricCanvas) return;
    
    // Export as image
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2, // Higher resolution
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'chroma-creation.png';
    link.href = dataURL;
    link.click();
    
    toast.success("Image exported successfully!");
  }, [fabricCanvas]);

  const handleUndo = useCallback(() => {
    // Placeholder for undo functionality
    toast.info("Undo functionality coming soon!");
  }, []);

  const handleRedo = useCallback(() => {
    // Placeholder for redo functionality  
    toast.info("Redo functionality coming soon!");
  }, []);

  const handleToolChange = useCallback((tool: Tool) => {
    setActiveTool(tool);
    
    // Provide feedback for AI tools
    if (tool === "ai-remove-bg") {
      toast.info("Select an image to remove its background with AI");
    } else if (tool === "ai-enhance") {
      toast.info("AI Enhancement coming soon!");
    }
  }, []);

  const handleModeChange = useCallback((newMode: EditorMode) => {
    setMode(newMode);
    toast.success(`Switched to ${newMode} editing mode`);
  }, []);

  const handleEffectApply = useCallback((effect: any) => {
    console.log('Effect applied:', effect);
  }, []);

  const handleTransitionApply = useCallback((transition: any) => {
    console.log('Transition applied:', transition);
  }, []);

  const handleVideoProcessed = useCallback((videoUrl: string) => {
    console.log('Video processed:', videoUrl);
  }, []);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <ChromaHeader
        onUpload={handleUpload}
        onSave={handleSave}
        onExport={handleExport}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        mode={mode}
        onModeChange={handleModeChange}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Tools */}
        {mode === 'image' && (
          <ToolPanel
            activeTool={activeTool}
            onToolChange={handleToolChange}
            activeColor={activeColor}
            onColorChange={setActiveColor}
          />
        )}
        
        {/* Main Editor Area */}
        {mode === 'image' && (
          <ChromaCanvas
            activeTool={activeTool}
            activeColor={activeColor}
            onCanvasReady={handleCanvasReady}
          />
        )}
        
        {mode === 'video' && (
          <VideoEditor onVideoProcessed={handleVideoProcessed} />
        )}
        
        {mode === 'ai' && (
          <div className="flex-1 flex items-center justify-center bg-gradient-subtle">
            <AIGenerationPanel fabricCanvas={fabricCanvas} />
          </div>
        )}

        {/* Right Panel - Effects & AI */}
        {mode === 'image' && (
          <div className="flex">
            <EffectsPanel
              fabricCanvas={fabricCanvas}
              onEffectApply={handleEffectApply}
            />
          </div>
        )}
        
        {mode === 'video' && (
          <TransitionsPanel
            onTransitionApply={handleTransitionApply}
            onEffectApply={handleEffectApply}
          />
        )}
      </div>
    </div>
  );
};

export default ChromaRevive;