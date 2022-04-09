import React from "react";
import VideoJS from './VideoJs' // point to where the functional component is stored

const PlayerWrapper: React.FC<any> = (props) => {
  const playerRef = React.useRef(null);

  const videoJsOptions: any = { // lookup the options in the docs for more options
    autoplay: true,
    controls: true,
    // height: '100%',
    // width: '100%',
    class: 'videojs-el',
    // responsive: true,
    // fluid: true,
    sources: [{
      src: props.url,
      type: 'application/x-mpegURL',
    }],
    vhs: {
        overrideNative: true
      },
  }

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;
    
    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting');
    });

    player.on('dispose', () => {
      console.log('player will dispose');
    });

    console.log(player)
  };

  // const changePlayerOptions = () => {
  //   // you can update the player through the Video.js player instance
  //   if (!playerRef.current) {
  //     return;
  //   }
  //   // [update player through instance's api]
  //   playerRef.current.src([{src: 'http://ex.com/video.mp4', type: 'video/mp4'}]);
  //   playerRef.current.autoplay(false);
  // };

  return (
    <div className="video-wrapper2">

      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />

    </div>
  );
}

export default PlayerWrapper;