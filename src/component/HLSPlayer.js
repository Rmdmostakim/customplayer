import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Class from "../css/hlsplayer.module.css";

const HLSPlayer = ({ url }) => {
  const videoRef = useRef(null);
  const bitrateSelectRef = useRef(null);
  const [hls, setHls] = useState(null);

  const handleBitrateChange = () => {
    const newLevel = parseInt(bitrateSelectRef.current.value);
    hls.levels.forEach((level, levelIndex) => {
      if (level.bitrate === newLevel) {
        hls.currentLevel = levelIndex;
      }
    });
  };

  useEffect(() => {
    if (Hls.isSupported()) {
      const newHls = new Hls();
      setHls(newHls);

      newHls.loadSource(url);
      newHls.attachMedia(videoRef.current);
      newHls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
        // Populate the bitrate selector with available levels
        newHls.levels.forEach((level) => {
          const option = document.createElement("option");
          option.text = `${(level.bitrate / 1000).toFixed(0)} kbps`;
          option.value = level.bitrate;
          bitrateSelectRef.current.appendChild(option);
        });
        // Set default level
        newHls.currentLevel = 0;
      });

      return () => {
        newHls.destroy();
      };
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = url;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play();
      });
    }
  }, [url]);

  return (
    <>
      <video
        ref={videoRef}
        controls
        loop
        autoPlay
        muted
        className={Class.player}
      />
      <select
        ref={bitrateSelectRef}
        onChange={handleBitrateChange}
        className={Class.bitRate}
      />
    </>
  );
};

export default HLSPlayer;
