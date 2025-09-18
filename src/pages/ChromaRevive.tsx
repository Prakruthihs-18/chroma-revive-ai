import { useState, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { ChromaHeader } from "@/components/ChromaHeader";
import { ToolPanel, Tool } from "@/components/ToolPanel";
import { ChromaCanvas } from "@/components/ChromaCanvas";
import { toast } from "sonner";

const ChromaRevive = () => {
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
      />
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Tool Panel */}
        <ToolPanel
          activeTool={activeTool}
          onToolChange={handleToolChange}
          activeColor={activeColor}
          onColorChange={setActiveColor}
        />
        
        {/* Canvas Area */}
        <ChromaCanvas
          activeTool={activeTool}
          activeColor={activeColor}
          onCanvasReady={handleCanvasReady}
        />
      </div>
    </div>
  );
};

export default ChromaRevive;