import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  onVideoComplete: () => void;
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Check if URL is a direct video file
 */
const isDirectVideo = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
};

export const VideoPlayer = ({ videoUrl, onVideoComplete }: VideoPlayerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const youtubeId = extractYouTubeId(videoUrl);
  const isDirect = isDirectVideo(videoUrl);

  useEffect(() => {
    // Reset completion state when video URL changes
    setHasCompleted(false);
    setError(null);
  }, [videoUrl]);

  useEffect(() => {
    // For YouTube videos, listen for postMessage events
    if (youtubeId && !hasCompleted) {
      const handleMessage = (event: MessageEvent) => {
        // YouTube iframe API sends messages from youtube.com
        if (event.origin !== 'https://www.youtube.com') {
          return;
        }

        try {
          // YouTube sends data as string, need to parse it
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          
          console.log('📺 [VideoPlayer] YouTube message received:', data);
          
          // YouTube player state: 0 = ended, 1 = playing, 2 = paused
          if (data.event === 'onStateChange' && data.info === 0) {
            console.log('✅ [VideoPlayer] YouTube video completed');
            setHasCompleted(true);
            onVideoComplete();
          }
        } catch (e) {
          // Ignore parse errors from other messages
          console.debug('🔇 [VideoPlayer] Ignored non-JSON message:', e);
        }
      };

      window.addEventListener('message', handleMessage);
      
      console.log('🎬 [VideoPlayer] YouTube player initialized, listening for completion');
      
      return () => {
        console.log('🔌 [VideoPlayer] Removing YouTube message listener');
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [youtubeId, hasCompleted, onVideoComplete]);

  const handleDirectVideoEnd = () => {
    if (!hasCompleted) {
      console.log('✅ [VideoPlayer] Direct video completed');
      setHasCompleted(true);
      onVideoComplete();
    }
  };

  const handleManualComplete = () => {
    console.log('👆 [VideoPlayer] Manual completion triggered');
    setHasCompleted(true);
    onVideoComplete();
  };

  const handleVideoError = () => {
    setError('Failed to load video. Please check the video URL.');
    console.error('❌ [VideoPlayer] Video failed to load:', videoUrl);
  };

  // YouTube video
  if (youtubeId) {
    return (
      <Card className="w-full mb-6 py-0 border-0">
        <CardContent className="p-0">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              ref={iframeRef}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&rel=0&modestbranding=1`}
              title="Video content"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={handleVideoError}
            />
          </div>
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!hasCompleted && (
            <div className="p-4 border-t border-border">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Watch the full video to show question, or click the button when finished
                </p>
                <Button
                  onClick={handleManualComplete}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  I've Watched It
                </Button>
              </div>
            </div>
          )}
          {hasCompleted && (
            <div className="p-4 border-t border-border bg-primary/5">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-4 h-4" />
                <p className="text-sm font-medium">Video completed ✓</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Direct video file
  if (isDirect) {
    return (
      <Card className="w-full mb-6 py-0 border-0">
        <CardContent className="p-0">
          <div className="relative w-full">
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              controls
              onEnded={handleDirectVideoEnd}
              onError={handleVideoError}
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          </div>
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!hasCompleted && (
            <div className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Watch the full video to show question, or click the button when finished
                </p>
                <Button
                  onClick={handleManualComplete}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  I've Watched It
                </Button>
              </div>
            </div>
          )}
          {hasCompleted && (
            <div className="p-4  bg-primary/5">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-4 h-4" />
                <p className="text-sm font-medium">Video complete</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Unsupported video format
  return (
    <Card className="w-full mb-6">
      <CardContent className="p-6">
        <div className="bg-destructive/10 text-destructive flex items-center gap-2 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Unsupported Video Format</p>
            <p className="text-sm mt-1">
              Please provide a YouTube URL or direct video file link (.mp4, .webm, .ogg)
            </p>
            <p className="text-xs mt-2 text-muted-foreground">URL: {videoUrl}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
