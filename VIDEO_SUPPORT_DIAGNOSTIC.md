# Video File Support - Diagnostic and Fix Report

## Issue Diagnosed
Video file at `/videos/computers1.mp4` was being treated as audio-only instead of displaying video content.

## Root Causes Identified

### 1. **Extension Conflict with .ogg Files**
- The `.ogg` extension was listed in BOTH video and audio extension arrays
- `.ogg` is primarily an audio format (Ogg Vorbis)
- Video OGG files use `.ogv` extension (Ogg Theora)

### 2. **Missing Query Parameter Handling**
- Extension detection didn't strip query parameters from URLs
- URLs like `/video.mp4?v=123` would fail detection

### 3. **Insufficient Video Element Attributes**
- Missing `preload="metadata"` to load video metadata
- No `playsInline` for mobile compatibility
- No error handling to detect audio-only files

### 4. **Lack of Diagnostic Logging**
- No way to detect if file has video track vs audio-only
- No error messages for troubleshooting

## Fixes Implemented

### 1. **Enhanced Media Detection (`src/lib/media-utils.ts`)**

#### Video File Detection
```typescript
export const isVideoFile = (url: string): boolean => {
  if (!url) return false;
  
  const videoExtensions = ['.mp4', '.webm', '.ogv', '.mov', '.avi', '.m4v'];
  const lowerUrl = url.toLowerCase();
  
  // Remove query parameters before checking extension
  const urlWithoutQuery = lowerUrl.split('?')[0];
  
  return videoExtensions.some(ext => urlWithoutQuery.endsWith(ext));
};
```

**Changes:**
- ✅ Removed `.ogg` (audio format)
- ✅ Added `.ogv` (video OGG format)
- ✅ Added `.m4v` (MPEG-4 video)
- ✅ Strip query parameters before checking extension

#### Audio File Detection
```typescript
export const isAudioFile = (url: string): boolean => {
  if (!url) return false;
  
  const audioExtensions = ['.mp3', '.wav', '.ogg', '.oga', '.m4a', '.aac', '.flac'];
  const lowerUrl = url.toLowerCase();
  
  // Remove query parameters before checking extension
  const urlWithoutQuery = lowerUrl.split('?')[0];
  
  return audioExtensions.some(ext => urlWithoutQuery.endsWith(ext));
};
```

**Changes:**
- ✅ Added `.oga` (Ogg Audio)
- ✅ Strip query parameters

#### MIME Type Detection
```typescript
export const getMediaMimeType = (url: string): string | undefined => {
  if (!url) return undefined;
  
  const lowerUrl = url.toLowerCase();
  const urlWithoutQuery = lowerUrl.split('?')[0];
  
  // Video MIME types
  if (urlWithoutQuery.endsWith('.mp4') || urlWithoutQuery.endsWith('.m4v')) 
    return 'video/mp4';
  if (urlWithoutQuery.endsWith('.webm')) return 'video/webm';
  if (urlWithoutQuery.endsWith('.ogv')) return 'video/ogg';
  if (urlWithoutQuery.endsWith('.mov')) return 'video/quicktime';
  if (urlWithoutQuery.endsWith('.avi')) return 'video/x-msvideo';
  
  // Audio MIME types
  if (urlWithoutQuery.endsWith('.mp3')) return 'audio/mpeg';
  if (urlWithoutQuery.endsWith('.wav')) return 'audio/wav';
  if (urlWithoutQuery.endsWith('.ogg') || urlWithoutQuery.endsWith('.oga')) 
    return 'audio/ogg';
  if (urlWithoutQuery.endsWith('.m4a')) return 'audio/mp4';
  if (urlWithoutQuery.endsWith('.aac')) return 'audio/aac';
  if (urlWithoutQuery.endsWith('.flac')) return 'audio/flac';
  
  return undefined;
};
```

**Changes:**
- ✅ Proper MIME types for all formats
- ✅ Separate `.ogv` (video/ogg) from `.ogg` (audio/ogg)
- ✅ Strip query parameters

### 2. **Enhanced Video Element (`src/components/practice/question-display.tsx`)**

#### Added Video Ref and Error State
```typescript
const [mediaError, setMediaError] = useState<string | null>(null);
const videoRef = useRef<HTMLVideoElement | null>(null);
```

#### Enhanced Video Element
```tsx
<video
  ref={videoRef}
  controls
  controlsList="nodownload"
  playsInline
  preload="metadata"
  className="w-full h-auto"
  style={{ maxHeight: '500px' }}
  onLoadedMetadata={(e) => {
    const video = e.currentTarget;
    console.log('📊 [QuestionDisplay] Video metadata loaded:', {
      duration: video.duration,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      hasVideo: video.videoWidth > 0 && video.videoHeight > 0,
    });
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setMediaError('This file appears to be audio-only. No video track detected.');
    }
  }}
  onError={(e) => {
    const video = e.currentTarget;
    const error = video.error;
    console.error('❌ [QuestionDisplay] Video error:', {
      code: error?.code,
      message: error?.message,
      src: question.media,
    });
    setMediaError(`Video error: ${error?.message || 'Failed to load video'}`);
  }}
>
  <source src={question.media} type={getMediaMimeType(question.media)} />
  Your browser does not support the video element.
</video>
```

**New Features:**
- ✅ `preload="metadata"` - Loads video metadata to detect video dimensions
- ✅ `playsInline` - Better mobile compatibility
- ✅ `controlsList="nodownload"` - Cleaner controls
- ✅ `onLoadedMetadata` - Detects if file has video track (checks videoWidth/videoHeight)
- ✅ `onError` - Comprehensive error logging
- ✅ Error message display for users
- ✅ Black background container for better video visibility

#### Enhanced Logging
```typescript
console.log('✅ [QuestionDisplay] Video file detected:', question.media);
console.log('📹 [QuestionDisplay] MIME type:', getMediaMimeType(question.media));
```

## How to Use Video Files

### 1. Place Video in Public Folder
```
/workspace/app-7mwz1usnv1fl/public/videos/computers1.mp4
```

### 2. Reference in Question Bank
```typescript
{
  id: 'tech1',
  type: QuestionType.Part1,
  text: 'How often do you use technology in your daily life?',
  media: '/videos/computers1.mp4', // ✅ Correct path
  speakingDuration: 20,
}
```

### 3. Supported Video Formats
- ✅ `.mp4` (H.264/AAC) - **Recommended** (best browser support)
- ✅ `.webm` (VP8/VP9/Vorbis)
- ✅ `.ogv` (Theora/Vorbis)
- ✅ `.mov` (QuickTime)
- ✅ `.m4v` (MPEG-4 Video)
- ✅ `.avi` (limited browser support)

## Diagnostic Tools

### Browser Console Logs
When a video file is loaded, you'll see:
```
🔍 [QuestionDisplay] Checking media: /videos/computers1.mp4
✅ [QuestionDisplay] Video file detected: /videos/computers1.mp4
📹 [QuestionDisplay] MIME type: video/mp4
📊 [QuestionDisplay] Video metadata loaded: {
  duration: 120.5,
  videoWidth: 1920,
  videoHeight: 1080,
  hasVideo: true
}
```

### If File is Audio-Only
```
⚠️ This file appears to be audio-only. No video track detected.
```

### If File Fails to Load
```
❌ [QuestionDisplay] Video error: {
  code: 4,
  message: "MEDIA_ERR_SRC_NOT_SUPPORTED",
  src: "/videos/computers1.mp4"
}
```

## Troubleshooting Guide

### Issue: Video shows only audio controls
**Diagnosis:** File may be audio-only or have no video track
**Solution:** 
1. Check browser console for metadata logs
2. Verify file has video track: `ffprobe /path/to/video.mp4`
3. Re-encode with video track if needed

### Issue: Video not detected
**Diagnosis:** Extension not recognized or query parameters
**Solution:**
1. Ensure file has supported extension (.mp4, .webm, etc.)
2. Check console logs for detection status
3. Remove query parameters or use supported format

### Issue: Video won't play
**Diagnosis:** Browser codec support or file corruption
**Solution:**
1. Check browser console for error code
2. Try different browser
3. Re-encode to H.264/AAC MP4 (most compatible)

### Issue: Video plays but no visual
**Diagnosis:** CSS or container issue
**Solution:**
1. Check if `videoWidth` and `videoHeight` are > 0 in console
2. Verify black background container is visible
3. Check for CSS conflicts

## Testing Checklist

- [ ] Place test video in `/public/videos/test.mp4`
- [ ] Update question bank with `media: '/videos/test.mp4'`
- [ ] Open browser console
- [ ] Load the question
- [ ] Verify console shows "✅ Video file detected"
- [ ] Verify console shows video dimensions
- [ ] Verify video player displays with controls
- [ ] Play video and confirm visual content appears
- [ ] Verify video ends trigger recording start

## Browser Compatibility

| Format | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| MP4 (H.264) | ✅ | ✅ | ✅ | ✅ |
| WebM (VP8/VP9) | ✅ | ✅ | ⚠️ | ✅ |
| OGV (Theora) | ⚠️ | ✅ | ❌ | ⚠️ |

**Recommendation:** Use MP4 with H.264 video and AAC audio for maximum compatibility.

## Summary

The video support has been significantly enhanced with:
1. ✅ Proper video/audio format detection
2. ✅ Query parameter handling
3. ✅ Audio-only file detection
4. ✅ Comprehensive error handling
5. ✅ Detailed diagnostic logging
6. ✅ Better video element attributes
7. ✅ User-friendly error messages

Your `/videos/computers1.mp4` file should now:
- Be correctly detected as a video file
- Display in a proper video player with controls
- Show video content (not just audio)
- Provide clear error messages if issues occur
