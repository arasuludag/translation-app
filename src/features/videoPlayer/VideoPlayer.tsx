import { useEffect, useRef, useState } from "react";
import { Player } from "react-tuby";
import "react-tuby/css/main.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setActiveSubtitle } from "../subtitleSection/subtitleSlice";

import "./videoPlayer.css";

import { selectVideoTime } from "./videoSlice";
import { Box } from "@mui/material";
import Subtitle from "./Subtitle";
import Settings from "../settings/Settings";
import VideoControl from "./controlGroup/VideoControl";

// @ts-ignore
import video from "./video.mp4"; // Will be fetched from the backend on the real thing.

function VideoPlayer(): JSX.Element {
  const dispatch = useAppDispatch();
  const videoTime = useAppSelector(selectVideoTime);

  const player = useRef<HTMLVideoElement>(null);

  // Set video time if VideoTime updates.
  useEffect(() => {
    if (player.current) player.current.currentTime = videoTime.seconds;
  }, [player, videoTime]);

  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    // Updates when video is progressing.
    player.current?.addEventListener("timeupdate", () => {
      setCurrentTime(Math.round(player.current!.currentTime * 1000));
    });

    // Prevent right click.
    // document.addEventListener("contextmenu", (e) => {
    //   e.preventDefault();
    // });
  }, []);

  useEffect(() => {
    dispatch(setActiveSubtitle(currentTime));
  }, [currentTime, dispatch]);

  // Forward or backward time.
  function onSeek(direction: boolean, howMuch: number) {
    if (player.current) {
      direction
        ? (player.current.currentTime += howMuch)
        : (player.current.currentTime -= howMuch);
    }
  }

  return (
    <div className="container">
      <Box
        sx={{
          position: "absolute",
          top: 10,
          zIndex: 3,
          left: 0,
          margin: 1,
        }}
      >
        <Settings />
      </Box>
      <VideoControl
        currentTime={currentTime}
        onSeek={(direction, howMuch) => onSeek(direction, howMuch)}
      />

      <Player
        src={video}
        playerRef={player}
        pictureInPicture={false}
        primaryColor={"#FFFFFF"}
        seekDuration={0.03}
        keyboardShortcut={false}
      />

      <Subtitle playerWidth={player.current?.offsetWidth || 32} />
    </div>
  );
}

export default VideoPlayer;