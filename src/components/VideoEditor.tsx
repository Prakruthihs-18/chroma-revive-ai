import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/enhanced-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Scissors,
  Copy,
  Download,
  Upload,
  Volume2,
  VolumeX,
  RotateCcw,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface VideoClip {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
}

interface VideoEditorProps {
  onVideoProcessed: (videoUrl: string) => void;
}

export const VideoEditor = ({ onVideoProcessed }: VideoEditorProps) => {
  const [videos, setVideos] = useState<VideoClip[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoClip | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([100]);
  const [isMuted, setIsMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedClips, setSelectedClips] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error("Please upload a valid video file");
      return;
    }

    try {
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement('video');
      
      video.onloadedmetadata = () => {
        const newClip: VideoClip = {
          id: Date.now().toString(),
          name: file.name,
          url: videoUrl,
          duration: video.duration,
          startTime: 0,
          endTime: video.duration
        };
        
        setVideos(prev => [...prev, newClip]);
        setCurrentVideo(newClip);
        toast.success(`Video "${file.name}" uploaded successfully!`);
      };
      
      video.src = videoUrl;
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video");
    }
  }, []);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (newTime: number[]) => {
    if (videoRef.current && currentVideo) {
      const time = newTime[0];
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    if (videoRef.current) {
      const vol = newVolume[0] / 100;
      videoRef.current.volume = vol;
      setVolume(newVolume);
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const cutVideo = async () => {
    if (!currentVideo) {
      toast.error("Please select a video to cut");
      return;
    }

    setIsProcessing(true);
    try {
      toast.loading("Cutting video...", { duration: 2000 });
      
      // Simulate video processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would use FFmpeg to cut the video
      const newClip: VideoClip = {
        id: Date.now().toString(),
        name: `${currentVideo.name}_cut`,
        url: currentVideo.url,
        duration: currentTime,
        startTime: 0,
        endTime: currentTime
      };
      
      setVideos(prev => [...prev, newClip]);
      toast.success("Video cut successfully!");
    } catch (error) {
      toast.error("Failed to cut video");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyClip = () => {
    if (!currentVideo) {
      toast.error("Please select a video to copy");
      return;
    }

    const newClip: VideoClip = {
      ...currentVideo,
      id: Date.now().toString(),
      name: `${currentVideo.name}_copy`
    };
    
    setVideos(prev => [...prev, newClip]);
    toast.success("Video clip copied!");
  };

  const deleteClip = (clipId: string) => {
    setVideos(prev => prev.filter(v => v.id !== clipId));
    if (currentVideo?.id === clipId) {
      setCurrentVideo(videos[0] || null);
    }
    toast.success("Clip deleted!");
  };

  const mergeClips = async () => {
    if (selectedClips.length < 2) {
      toast.error("Select at least 2 clips to merge");
      return;
    }

    setIsProcessing(true);
    try {
      toast.loading("Merging video clips...", { duration: 3000 });
      
      // Simulate video processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real app, this would use FFmpeg to merge videos
      const mergedDuration = selectedClips.reduce((total, clipId) => {
        const clip = videos.find(v => v.id === clipId);
        return total + (clip?.duration || 0);
      }, 0);
      
      const newClip: VideoClip = {
        id: Date.now().toString(),
        name: "Merged_Video",
        url: videos[0]?.url || "",
        duration: mergedDuration,
        startTime: 0,
        endTime: mergedDuration
      };
      
      setVideos(prev => [...prev, newClip]);
      setSelectedClips([]);
      toast.success("Videos merged successfully!");
    } catch (error) {
      toast.error("Failed to merge videos");
    } finally {
      setIsProcessing(false);
    }
  };

  const exportVideo = async () => {
    if (!currentVideo) {
      toast.error("No video to export");
      return;
    }

    setIsProcessing(true);
    try {
      toast.loading("Exporting video...", { duration: 2000 });
      
      // Simulate export processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create download link
      const link = document.createElement('a');
      link.href = currentVideo.url;
      link.download = currentVideo.name;
      link.click();
      
      toast.success("Video exported successfully!");
    } catch (error) {
      toast.error("Failed to export video");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-subtle">
      {/* Video Upload Area */}
      {!currentVideo && (
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-96 bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 text-center">
              <Video className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Upload Video</h3>
              <p className="text-muted-foreground mb-6">
                Start by uploading a video file to begin editing
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="gradient"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Video File
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Video Editor Interface */}
      {currentVideo && (
        <div className="flex-1 flex flex-col p-6">
          {/* Video Player */}
          <Card className="mb-6 bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  src={currentVideo.url}
                  className="w-full h-64 object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                />
                
                {/* Play/Pause Overlay */}
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={handlePlayPause}
                >
                  {!isPlaying && (
                    <div className="bg-black/50 rounded-full p-4">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-4">
                {/* Timeline */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(currentVideo.duration)}</span>
                  </div>
                  <Slider
                    value={[currentTime]}
                    onValueChange={handleSeek}
                    max={currentVideo.duration}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handlePlayPause}>
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <div className="w-20">
                      <Slider
                        value={volume}
                        onValueChange={handleVolumeChange}
                        max={100}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editing Tools */}
          <div className="flex gap-4 mb-6">
            <Button variant="tool" onClick={cutVideo} disabled={isProcessing}>
              <Scissors className="w-4 h-4 mr-2" />
              Cut at {formatTime(currentTime)}
            </Button>
            <Button variant="tool" onClick={copyClip} disabled={isProcessing}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Clip
            </Button>
            <Button 
              variant="tool" 
              onClick={mergeClips} 
              disabled={isProcessing || selectedClips.length < 2}
            >
              <Zap className="w-4 h-4 mr-2" />
              Merge Selected ({selectedClips.length})
            </Button>
            <Button variant="success" onClick={exportVideo} disabled={isProcessing}>
              <Download className="w-4 h-4 mr-2" />
              Export Video
            </Button>
          </div>

          {/* Video Clips Timeline */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video Clips ({videos.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                {videos.map((clip) => (
                  <div
                    key={clip.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      currentVideo?.id === clip.id 
                        ? 'bg-primary/20 border-primary' 
                        : 'bg-muted/30 border-border/50 hover:bg-muted/50'
                    }`}
                    onClick={() => setCurrentVideo(clip)}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedClips.includes(clip.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedClips(prev => [...prev, clip.id]);
                          } else {
                            setSelectedClips(prev => prev.filter(id => id !== clip.id));
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded"
                      />
                      <div>
                        <div className="font-medium text-sm">{clip.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Duration: {formatTime(clip.duration)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentVideo?.id === clip.id && (
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteClip(clip.id);
                        }}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="bg-card">
            <CardContent className="p-6 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Processing video...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};