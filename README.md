# DOM Ad Cleaner

A lightweight Chrome extension that removes intrusive DOM-based ads and
neutralizes media ads at runtime without blocking network requests.

## Features
- Removes popups, overlays, and scroll blockers
- Handles dynamically injected ads using MutationObserver
- Preserves site layouts (YouTube-safe)
- Automatically skips or fast-forwards YouTube ads

## How it Works
- DOM inspection + heuristic detection
- Runtime iframe removal
- UI state restoration (scroll & pointer events)
- Media player manipulation for YouTube

## Limitations
- Does not block server-side or DRM-based ads
- YouTube ads are skipped/neutralized, not removed
