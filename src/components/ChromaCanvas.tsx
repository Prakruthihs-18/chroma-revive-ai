import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Circle, Rect, FabricText, Image as FabricImage } from "fabric";
import { toast } from "sonner";
import { Tool } from "./ToolPanel";
import { removeBackground, loadImage } from "@/utils/backgroundRemoval";

interface ChromaCanvasProps {
  activeTool: Tool;
  activeColor: string;
  onCanvasReady: (canvas: FabricCanvas) => void;
}

export const ChromaCanvas = ({ activeTool, activeColor, onCanvasReady }: ChromaCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 1000,
      height: 700,
      backgroundColor: "#1a1a1a",
    });

    // Initialize the freeDrawingBrush
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = 3;

    setFabricCanvas(canvas);
    onCanvasReady(canvas);
    toast.success("Canvas ready! Start creating amazing visuals!");

    return canvas;
  }, [activeColor, onCanvasReady]);

  useEffect(() => {
    const canvas = initializeCanvas();
    return () => {
      canvas?.dispose();
    };
  }, [initializeCanvas]);

  useEffect(() => {
    if (!fabricCanvas) return;

    // Handle tool changes
    switch (activeTool) {
      case "draw":
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = activeColor;
        fabricCanvas.freeDrawingBrush.width = 3;
        break;
      
      case "select":
        fabricCanvas.isDrawingMode = false;
        break;
      
      case "rectangle":
        fabricCanvas.isDrawingMode = false;
        const rect = new Rect({
          left: 100,
          top: 100,
          fill: activeColor,
          width: 150,
          height: 100,
          rx: 8,
          ry: 8,
        });
        fabricCanvas.add(rect);
        fabricCanvas.setActiveObject(rect);
        break;
      
      case "circle":
        fabricCanvas.isDrawingMode = false;
        const circle = new Circle({
          left: 100,
          top: 100,
          fill: activeColor,
          radius: 75,
        });
        fabricCanvas.add(circle);
        fabricCanvas.setActiveObject(circle);
        break;
      
      case "text":
        fabricCanvas.isDrawingMode = false;
        const text = new FabricText("Edit this text", {
          left: 100,
          top: 100,
          fill: activeColor,
          fontSize: 24,
          fontFamily: "Inter, sans-serif",
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        break;
      
      case "eraser":
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.freeDrawingBrush.color = "#1a1a1a"; // Canvas background color
        fabricCanvas.freeDrawingBrush.width = 10;
        break;
    }
  }, [activeTool, activeColor, fabricCanvas]);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    try {
      const img = await loadImage(file);
      
      const fabricImage = new FabricImage(img, {
        left: 50,
        top: 50,
        scaleX: Math.min(500 / img.width, 1),
        scaleY: Math.min(500 / img.height, 1),
        cornerStyle: 'circle',
        cornerColor: '#8B5CF6',
        cornerSize: 8,
      });
      
      fabricCanvas.add(fabricImage);
      fabricCanvas.setActiveObject(fabricImage);
      fabricCanvas.renderAll();
      
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    }
  }, [fabricCanvas]);

  const handleAIBackgroundRemoval = useCallback(async () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') {
      toast.error("Please select an image to remove background");
      return;
    }

    setIsProcessing(true);
    try {
      toast.loading("AI is removing background...");
      
      // Get the image element from the fabric object
      const fabricImage = activeObject as FabricImage;
      const imgElement = fabricImage.getElement() as HTMLImageElement;
      
      // Remove background using AI
      const resultBlob = await removeBackground(imgElement);
      const processedImg = await loadImage(resultBlob);
      
      // Replace the original image with the processed one
      const newFabricImage = new FabricImage(processedImg, {
        left: fabricImage.left,
        top: fabricImage.top,
        scaleX: fabricImage.scaleX,
        scaleY: fabricImage.scaleY,
        cornerStyle: 'circle',
        cornerColor: '#8B5CF6',
      });
      
      fabricCanvas.remove(fabricImage);
      fabricCanvas.add(newFabricImage);
      fabricCanvas.setActiveObject(newFabricImage);
      fabricCanvas.renderAll();
      
      toast.success("Background removed successfully!");
    } catch (error) {
      console.error("Background removal failed:", error);
      toast.error("Failed to remove background. Please try again.");
    } finally {
      setIsProcessing(false);
      toast.dismiss();
    }
  }, [fabricCanvas]);

  // Handle AI tool activation
  useEffect(() => {
    if (activeTool === "ai-remove-bg") {
      handleAIBackgroundRemoval();
    }
  }, [activeTool, handleAIBackgroundRemoval]);

  // Trigger file input when upload is needed
  const triggerUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Expose upload function to parent
  useEffect(() => {
    if (fabricCanvas) {
      (fabricCanvas as any).triggerUpload = triggerUpload;
    }
  }, [fabricCanvas, triggerUpload]);

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-subtle p-8">
      <div className="relative">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {/* Canvas container */}
        <div className="bg-card rounded-lg shadow-elegant border border-border p-4 relative">
          <canvas 
            ref={canvasRef}
            className="max-w-full rounded-lg"
          />
          
          {/* Processing overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">AI Processing...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};