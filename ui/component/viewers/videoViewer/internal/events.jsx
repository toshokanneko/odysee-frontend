// kick player in the butt, sometimes it doesn't always autoplay when it should
player.on('loadstart', function (event) {
  if (autoplay) {
    player.play();
  }
});

// Add various event listeners to player
player.one('play', onInitialPlay);
player.on('play', resolveCtrlText);
player.on('pause', resolveCtrlText);
player.on('loadstart', resolveCtrlText);
player.on('fullscreenchange', resolveCtrlText);
player.on('volumechange', resolveCtrlText);
player.on('volumechange', onVolumeChange);
player.on('error', onError);
player.on('ended', onEnded);
