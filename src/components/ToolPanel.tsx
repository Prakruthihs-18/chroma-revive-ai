import { Button } from "@/components/ui/enhanced-button";
import { 
  MousePointer, 
  Pencil, 
  Square, 
  Circle, 
  Type, 
  Eraser,
  Wand2,
  Scissors,
  Palette,
  Download
} from "lucide-react";

export type Tool = 
  | "select" 
  | "draw" 
  | "rectangle" 
  | "circle" 
  | "text" 
  | "eraser"
  | "ai-remove-bg"
  | "ai-enhance";

interface ToolPanelProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  activeColor: string;
  onColorChange: (color: string) => void;
}

const tools = [
  { id: "select" as Tool, icon: MousePointer, label: "Select" },
  { id: "draw" as Tool, icon: Pencil, label: "Draw" },
  { id: "rectangle" as Tool, icon: Square, label: "Rectangle" },
  { id: "circle" as Tool, icon: Circle, label: "Circle" },
  { id: "text" as Tool, icon: Type, label: "Text" },
  { id: "eraser" as Tool, icon: Eraser, label: "Eraser" },
] as const;

const aiTools = [
  { id: "ai-remove-bg" as Tool, icon: Scissors, label: "Remove BG" },
  { id: "ai-enhance" as Tool, icon: Wand2, label: "AI Enhance" },
] as const;

const colors = [
  "#8B5CF6", // Primary purple
  "#06B6D4", // Accent teal
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#000000", // Black
  "#FFFFFF", // White
];

export const ToolPanel = ({ 
  activeTool, 
  onToolChange, 
  activeColor, 
  onColorChange 
}: ToolPanelProps) => {
  return (
    <div className="w-20 bg-card border-r border-border flex flex-col items-center py-4 gap-6">
      {/* Basic Tools */}
      <div className="flex flex-col gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "tool-active" : "tool"}
              size="icon"
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
            >
              <Icon className="w-5 h-5" />
            </Button>
          );
        })}
      </div>

      {/* Separator */}
      <div className="w-8 h-px bg-border" />

      {/* AI Tools */}
      <div className="flex flex-col gap-2">
        {aiTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "tool-active" : "gradient"}
              size="icon"
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
              className="relative"
            >
              <Icon className="w-5 h-5" />
              {tool.id.startsWith('ai-') && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                  <Wand2 className="w-2 h-2 text-accent-foreground" />
                </div>
              )}
            </Button>
          );
        })}
      </div>

      {/* Color Palette */}
      <div className="flex flex-col gap-2 mt-4">
        <div className="flex items-center justify-center mb-2">
          <Palette className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-3 gap-1">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-5 h-5 rounded-sm border-2 transition-all ${
                activeColor === color 
                  ? "border-primary scale-110" 
                  : "border-border hover:border-accent"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};