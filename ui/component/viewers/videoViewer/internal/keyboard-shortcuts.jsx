import React, { useEffect, useRef, useState } from 'react';
import * as KEYCODES from 'constants/keycodes';
import isUserTyping from 'util/detect-typing';
import * as OVERLAY from './overlays';

const playerRef = useRef();
const containerRef = useRef();

const videoPlaybackRates = [0.25, 0.5, 0.75, 1, 1.1, 1.25, 1.5, 1.75, 2];

function handleKeyDown(e: KeyboardEvent) {
  const player = playerRef.current;
  const videoNode = containerRef.current && containerRef.current.querySelector('video, audio');
  if (!videoNode || !player || isUserTyping()) return;
  handleSingleKeyActions(e);
  handleShiftKeyActions(e);
}

function handleShiftKeyActions(e: KeyboardEvent, playNext, playPrevious) {
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
  if (e.keyCode === KEYCODES.UP) volumeUp();
  if (e.keyCode === KEYCODES.DOWN) volumeDown();
  if (e.keyCode === KEYCODES.T) toggleTheaterMode();
  if (e.keyCode === KEYCODES.L) seekVideo(SEEK_STEP);
  if (e.keyCode === KEYCODES.J) seekVideo(-SEEK_STEP);
  if (e.keyCode === KEYCODES.RIGHT) seekVideo(SEEK_STEP_5);
  if (e.keyCode === KEYCODES.LEFT) seekVideo(-SEEK_STEP_5);
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

module.exports = {
  handleKeyDown,
  handleShiftKeyActions,
  handleSingleKeyActions,
};

export default useVideoKeyboardHandler;
