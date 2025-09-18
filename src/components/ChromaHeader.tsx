import { Button } from "@/components/ui/enhanced-button";
import { Sparkles, Download, Upload, Undo, Redo, Save } from "lucide-react";

interface ChromaHeaderProps {
  onUpload: () => void;
  onSave: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export const ChromaHeader = ({
  onUpload,
  onSave,
  onExport,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: ChromaHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            ChromaRevive
          </h1>
        </div>
      </div>

      {/* Main Actions */}
      <div className="flex items-center gap-3">
        <Button variant="creator" size="sm" onClick={onUpload}>
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="tool" 
            size="icon-sm" 
            disabled={!canUndo}
            onClick={onUndo}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button 
            variant="tool" 
            size="icon-sm" 
            disabled={!canRedo}
            onClick={onRedo}
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>

        <Button variant="floating" size="sm" onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Button variant="gradient" size="sm" onClick={onExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </header>
  );
};