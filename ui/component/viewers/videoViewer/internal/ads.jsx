import videojs from 'video.js';

function hitsFiftyPercent() {
  // from 0 - 999
  const rand = Math.floor(Math.random() * (1000 + 1));

  // 499 is 50% chance of running
  if (rand > 499) {
    return true;
  } else {
    return false;
  }
}

const timestamp = new Date().toISOString();

const videoElement = document.getElementsByClassName('vjs-tech')[0];

const height = videoElement.offsetHeight;
const width = videoElement.offsetWidth;

const macroUrl1 =
  'https://gov.aniview.com/api/adserver/vast3/' +
  '?AV_PUBLISHERID=60afcbc58cfdb065440d2426' +
  '&AV_CHANNELID=60b354389c7adb506d0bd9a4' +
  `&AV_URL=${encodeURIComponent(window.location.href)}` +
  `&cb=${encodeURIComponent(timestamp)}` +
  `&AV_WIDTH=${width}` +
  `&AV_HEIGHT=${height}` +
  // '&AV_SCHAIN=[SCHAIN_MACRO]' +
  // '&AV_CCPA=[CCPA_MACRO]' +
  // '&AV_GDPR=[GDPR_MACRO]' +
  // '&AV_CONSENT=[CONSENT_MACRO]' +
  `&skip=true` +
  `&skiptimer=5` +
  `&logo=true` +
  `&usevslot=true` +
  `&vastretry=2` +
  `&hidecontrols=false`;

// always have ads on if internal feature is on,
// otherwise if not authed, roll for 20% to see an ad
const shouldShowAnAd = internalFeatureEnabled || (allowPreRoll && hitsFiftyPercent());

// only run on chrome (brave included) and don't run on mobile for time being
const browserIsChrome = videojs.browser.IS_CHROME;
const IS_IOS = videojs.browser.IS_IOS;
const IS_ANDROID = videojs.browser.IS_ANDROID;
const IS_MOBILE = IS_IOS || IS_ANDROID;

if (shouldShowAnAd && browserIsChrome && !IS_MOBILE) {
  // fire up ima integration via module
  player.ima({
    adTagUrl: macroUrl1,
    vpaidMode: 2,
  });
}
