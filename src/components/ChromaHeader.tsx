import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Download, 
  Upload, 
  Undo2, 
  Redo2,
  Menu,
  Palette,
  Image as ImageIcon,
  Video,
  Sparkles,
  Wand2
} from "lucide-react";

export type EditorMode = 'image' | 'video' | 'ai';

interface ChromaHeaderProps {
  onUpload: () => void;
  onSave: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
}

export const ChromaHeader = ({
  onUpload,
  onSave,
  onExport,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  mode,
  onModeChange,
}: ChromaHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
          <Palette className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            ChromaRevive
          </h1>
          <p className="text-xs text-muted-foreground">
            {mode === 'image' && 'Image Editor'}
            {mode === 'video' && 'Video Editor'} 
            {mode === 'ai' && 'AI Studio'}
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg">
        <Button
          variant={mode === 'image' ? 'tool-active' : 'tool'}
          size="sm"
          onClick={() => onModeChange('image')}
          className="h-8 px-3"
        >
          <ImageIcon className="w-4 h-4 mr-1" />
          Image
        </Button>
        <Button
          variant={mode === 'video' ? 'tool-active' : 'tool'}
          size="sm"
          onClick={() => onModeChange('video')}
          className="h-8 px-3"
        >
          <Video className="w-4 h-4 mr-1" />
          Video
        </Button>
        <Button
          variant={mode === 'ai' ? 'tool-active' : 'tool'}
          size="sm"
          onClick={() => onModeChange('ai')}
          className="h-8 px-3"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          AI Studio
        </Button>
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
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button 
            variant="tool" 
            size="icon-sm" 
            disabled={!canRedo}
            onClick={onRedo}
          >
            <Redo2 className="w-4 h-4" />
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