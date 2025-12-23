/*************************************************
 * DOM AD CLEANER
 * Removes DOM-based ads, banners & overlays
 * Author: Balne Thrinath
 *************************************************/

(function () {
  'use strict';

  /***********************
   * CONFIG
   ***********************/
  const AD_IFRAME_REGEX =
    /googleads|doubleclick|adsystem|adservice|googlesyndication/i;

  const AD_CONTAINER_HINTS = [
    'google_ads_iframe_',
    'adsbygoogle',
    'ad-slot',
    'ad_container',
    'ad-unit',
    'adhesion',
    'banner-ad',
    'sponsored'
  ];

  /***********************
   * HELPERS
   ***********************/
  function isAdIframe(iframe) {
    return iframe.src && AD_IFRAME_REGEX.test(iframe.src);
  }

  function looksLikeAdContainer(el) {
    const id = el.id || '';
    const cls = el.className || '';
    return AD_CONTAINER_HINTS.some(
      key => id.includes(key) || cls.includes(key)
    );
  }

  function isBlockingOverlay(el) {
    const s = getComputedStyle(el);

    const isFullScreen =
      el.offsetWidth > window.innerWidth * 0.9 &&
      el.offsetHeight > window.innerHeight * 0.9;

    return (
      s.position === 'fixed' &&
      parseInt(s.zIndex || '0', 10) > 1000 &&
      isFullScreen
    );
  }

  /***********************
   * CORE CLEANER
   ***********************/
  function cleanDOMAds() {
    /* 1️⃣ Remove ad iframes */
    document.querySelectorAll('iframe').forEach(iframe => {
      if (isAdIframe(iframe)) {
        iframe.remove();
      }
    });

    /* 2️⃣ Collapse ad containers */
    document.querySelectorAll('div').forEach(div => {
      if (looksLikeAdContainer(div)) {
        div.style.setProperty('display', 'none', 'important');
        div.style.setProperty('height', '0px', 'important');
        div.style.setProperty('min-height', '0px', 'important');
        div.style.setProperty('pointer-events', 'none', 'important');
      }
    });

    /* 3️⃣ Remove blocking overlays (non-YouTube only) */
    if (!location.hostname.includes('youtube.com')) {
      document.querySelectorAll('div').forEach(el => {
        try {
          if (isBlockingOverlay(el)) {
            el.remove();
          }
        } catch (_) {}
      });
    }

    /* 4️⃣ Restore page interaction */
    if (document.body) {
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
    }
    document.documentElement.style.overflow = 'auto';
  }

  /***********************
   * INIT + OBSERVER
   ***********************/
  cleanDOMAds();

  const observer = new MutationObserver(() => {
    cleanDOMAds();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
