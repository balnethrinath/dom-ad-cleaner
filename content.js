(function () {
  'use strict';

  // ---------------- Utilities ----------------
  const isAdIframe = (iframe) =>
    iframe.src &&
    /googleads|doubleclick|adsystem|adservice|googlesyndication/i.test(iframe.src);

  const isBlockingElement = (el) => {
    // Never touch YouTube layout
    if (location.hostname.includes('youtube.com')) return false;

    const s = getComputedStyle(el);

    const isFullScreen =
      el.offsetWidth > window.innerWidth * 0.9 &&
      el.offsetHeight > window.innerHeight * 0.9;

    return (
      s.position === 'fixed' &&
      parseInt(s.zIndex || '0', 10) > 1000 &&
      isFullScreen
    );
  };

  // ---------------- Core Cleaner ----------------
  function cleanPage() {
    // Remove ad iframes
    document.querySelectorAll('iframe').forEach((iframe) => {
      if (isAdIframe(iframe)) iframe.remove();
    });

    // Remove blocking overlays (divs only for performance)
    document.querySelectorAll('div').forEach((el) => {
      try {
        if (isBlockingElement(el)) el.remove();
      } catch (_) {}
    });

    // Restore page interaction
    if (document.body) {
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
    }
    document.documentElement.style.overflow = 'auto';
  }

  // Initial run
  cleanPage();

  // Debounced MutationObserver
  let cleanTimeout;
  const observer = new MutationObserver(() => {
    clearTimeout(cleanTimeout);
    cleanTimeout = setTimeout(cleanPage, 100);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();

// ---------------- YouTube Ad Handler ----------------
function handleYouTubeAdsClean() {
  if (!location.hostname.includes('youtube.com')) return;

  const video = document.querySelector('video');
  if (!video) return;

  // Auto-click skip button
  const skipBtn = document.querySelector(
    '.ytp-ad-skip-button, .ytp-skip-ad-button'
  );

  if (skipBtn && skipBtn.offsetParent !== null) {
    skipBtn.click();
    return;
  }

  // Detect unskippable ads
  const isAdPlaying =
    document.querySelector('.ad-showing') ||
    document.querySelector('.ytp-ad-player-overlay');

  if (isAdPlaying) {
    try {
      video.muted = true;
      video.playbackRate = 16;
      if (video.duration && video.currentTime < video.duration - 0.5) {
        video.currentTime = video.duration;
      }
    } catch (_) {}
  } else {
    if (video.playbackRate !== 1) video.playbackRate = 1;
    if (video.muted) video.muted = false;
  }
}

// YouTube is SPA → poll safely
if (location.hostname.includes('youtube.com')) {
  setInterval(handleYouTubeAdsClean, 300);
}
