import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onEnded?: () => void;
}

export default function VideoPlayer({ src, poster, onEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Disable right-click context menu
    video.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable download
    video.controlsList.add('nodownload');

    return () => {
      video.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, []);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full"
        controls
        controlsList="nodownload"
        poster={poster}
        onEnded={onEnded}
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
