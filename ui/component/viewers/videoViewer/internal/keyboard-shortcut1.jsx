const SEEK_STEP_5 = 5;
const SEEK_STEP = 10; // time to seek in seconds


// @flow
import React, { useEffect, useState, useMemo } from 'react';
import pushNotifications from '$web/src/push-notifications';
import { BrowserNotificationErrorModal } from '$web/component/browserNotificationHints';

// @todo: Once we are on Redux 7 we should have proper hooks we can use here for store access.
import { store } from '$ui/store';
import { selectUser } from 'redux/selectors/user';
import * as OVERLAY from './overlays';

export default () => {
  const [pushPermission, setPushPermission] = useState(window.Notification?.permission);
  const [subscribed, setSubscribed] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [encounteredError, setEncounteredError] = useState(false);

  const [user] = useState(selectUser(store.getState()));

  useEffect(() => {
    setPushSupported(pushNotifications.supported);
    if (pushNotifications.supported) {
      pushNotifications.subscribed(user.id).then((isSubscribed: boolean) => setSubscribed(isSubscribed));
    }
  }, [user]);

  useMemo(() => setPushEnabled(pushPermission === 'granted' && subscribed), [pushPermission, subscribed]);

  const subscribe = async () => {
    setEncounteredError(false);
    try {
      if (await pushNotifications.subscribe(user.id)) {
        setSubscribed(true);
        setPushPermission(window.Notification?.permission);
        return true;
      } else {
        setEncounteredError(true);
      }
    } catch {
      setEncounteredError(true);
    }
  };



  function handleKeyDown(e: KeyboardEvent) {
    const player = playerRef.current;
    const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
    if (!videoNode || !player || isUserTyping()) return;
    handleSingleKeyActions(e);
    handleShiftKeyActions(e);
  }

  function handleShiftKeyActions(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey || !e.shiftKey) return;
    if (e.keyCode === KEYCODES.PERIOD) changePlaybackSpeed(true);
    if (e.keyCode === KEYCODES.COMMA) changePlaybackSpeed(false);
    if (e.keyCode === KEYCODES.N) playNext();
    if (e.keyCode === KEYCODES.P) playPrevious();
  }

  function handleSingleKeyActions(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.keyCode === KEYCODES.SPACEBAR || e.keyCode === KEYCODES.K) togglePlay();
    if (e.keyCode === KEYCODES.F) toggleFullscreen();
    if (e.keyCode === KEYCODES.M) toggleMute();
    if (e.keyCode === KEYCODES.UP) volumeUp(e);
    if (e.keyCode === KEYCODES.DOWN) volumeDown(e);
    if (e.keyCode === KEYCODES.T) toggleTheaterMode();
    if (e.keyCode === KEYCODES.L) seekVideo(SEEK_STEP);
    if (e.keyCode === KEYCODES.J) seekVideo(-SEEK_STEP);
    if (e.keyCode === KEYCODES.RIGHT) seekVideo(SEEK_STEP_5);
    if (e.keyCode === KEYCODES.LEFT) seekVideo(-SEEK_STEP_5);
  }

  function seekVideo(stepSize: number) {
    const player = playerRef.current;
    const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
    if (!videoNode || !player) return;
    const duration = videoNode.duration;
    const currentTime = videoNode.currentTime;
    const newDuration = currentTime + stepSize;
    if (newDuration < 0) {
      videoNode.currentTime = 0;
    } else if (newDuration > duration) {
      videoNode.currentTime = duration;
    } else {
      videoNode.currentTime = newDuration;
    }
    OVERLAY.showSeekedOverlay(player, Math.abs(stepSize), stepSize > 0);
    player.userActive(true);
  }

  function changePlaybackSpeed(shouldSpeedUp: boolean) {
    const player = playerRef.current;
    if (!player) return;
    const isSpeedUp = shouldSpeedUp;
    const rate = player.playbackRate();
    let rateIndex = videoPlaybackRates.findIndex((x) => x === rate);
    if (rateIndex >= 0) {
      rateIndex = isSpeedUp ? Math.min(rateIndex + 1, videoPlaybackRates.length - 1) : Math.max(rateIndex - 1, 0);
      const nextRate = videoPlaybackRates[rateIndex];

      OVERLAY.showPlaybackRateOverlay(player, nextRate, isSpeedUp);
      player.userActive(true);
      player.playbackRate(nextRate);
    }
  }

  function toggleFullscreen() {
    const player = playerRef.current;
    if (!player) return;
    if (!player.isFullscreen()) {
      player.requestFullscreen();
    } else {
      player.exitFullscreen();
    }
  }

  function toggleTheaterMode() {
    const player = playerRef.current;
    if (!player) return;
    toggleVideoTheaterMode();
    if (player.isFullscreen()) {
      player.exitFullscreen();
    }
  }

  function toggleMute() {
    const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
    if (!videoNode) return;
    videoNode.muted = !videoNode.muted;
  }

  function togglePlay() {
    const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
    if (!videoNode) return;
    videoNode.paused ? videoNode.play() : videoNode.pause();
  }

  function volumeUp(event) {
    // dont run if video element is not active element (otherwise runs when scrolling using keypad)
    const videoElementIsActive = activeElementIsPartOfVideoElement();
    const player = playerRef.current;
    if (!player || !videoElementIsActive) return;
    event.preventDefault();
    player.volume(player.volume() + 0.05);
    OVERLAY.showVolumeverlay(player, Math.round(player.volume() * 100));
    player.userActive(true);
  }

  function volumeDown(event) {
    // dont run if video element is not active element (otherwise runs when scrolling using keypad)
    const videoElementIsActive = activeElementIsPartOfVideoElement();
    const player = playerRef.current;
    if (!player || !videoElementIsActive) return;
    event.preventDefault();
    player.volume(player.volume() - 0.05);
    OVERLAY.showVolumeverlay(player, Math.round(player.volume() * 100));
    player.userActive(true);
  }


  const unsubscribe = async () => {
    if (await pushNotifications.unsubscribe(user.id)) {
      setSubscribed(false);
    }
  };

  const pushToggle = async () => {
    return !pushEnabled ? subscribe() : unsubscribe();
  };

  return {
    pushSupported,
    pushEnabled,
    pushPermission,
    pushToggle,
    pushRequest,
    pushErrorModal,
  };
};
