"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HlsPlayerProps { 
  src: string
}

export function HlsPlayer(props: HlsPlayerProps) {
  const { src } = props;

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (Hls.isSupported()) {
      const hls = new Hls();

      hls.loadSource(src);
      hls.attachMedia(audio);

      return () => {
        hls.destroy();
      };
    }

    // Safari supports HLS natively
    if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      audio.src = src;
    }
  }, [src]);

  return (
    <audio
      ref={audioRef}
      controls
      autoPlay
      className="w-full"
    />
  );
}