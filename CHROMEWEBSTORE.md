# Chrome Web Store Listing — StayActive

> Last Updated: 2026-11-05 · Manifest version: 1.0.3

Single source of truth for the Chrome Developer Dashboard. Full per-language copy
(EN / FR) lives in `store/listings/en.md` and `store/listings/fr.md`; assets in
`store/assets/`. This file is excluded from the ZIP by `build.sh` (explicit file list).

## Store Listing

**Extension Name**
StayActive  <!-- from _locales/*/messages.json → extName -->

**Short Description** (103 / 132 chars)
Keep websites convinced your tab is always active. Videos and lessons won't pause when you switch tabs.

FR (111 / 132): Empêchez les sites de remarquer que vous avez quitté l'onglet. Vos vidéos et cours ne se mettent plus en pause.

**Detailed Description** (EN, user-facing — no implementation details)

```
StayActive stops websites from noticing when you switch to another tab or window, so videos, online lessons and live sessions keep going in the background.

Features
• One-click on/off toggle from the toolbar
• Works on every site, including embedded players
• No tracking, no analytics, no remote servers
• Fully open source

How to use it
1. Install StayActive — it is on by default.
2. Reload any tabs that were already open.
3. Click the toolbar icon to pause or resume it at any time.

Good to know
Chrome may still slow down timers and animations in background tabs to save battery; StayActive only changes whether the site thinks you are looking at it.

Privacy
StayActive does not collect, store or transmit any data. The only thing it saves is your on/off preference, kept locally in your browser.

Support
Report issues at https://github.com/yoann54/stayactive/issues
```

> ⚠️ `store/listings/en.md` and `fr.md` still contain a "How it works" paragraph naming
> `document.hidden`, `visibilitychange`, etc. The store guidance is to describe user
> benefit only — prefer the text above (and translate it for FR) when pasting.

**Category**
Productivity

**Single Purpose**
Keeps websites from detecting that the user switched away from their tab, so pages do not pause or change behaviour when the tab is in the background.

**Primary Language**
English (additional listing: French)

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon | 128×128 PNG | ✅ Ready | `store/assets/icon-128.png` |
| Screenshot 1 | 1280×800 | ✅ Ready (generated mock) | `store/assets/screenshot-1280x800.png` |
| Screenshot 2 | 1280×800 | 🟡 Needs update | `Image collée-1280x800.png` (untracked, repo root) |
| Screenshot 3 | 1280×800 or 640×400 | ⬜ Not created | |
| Small Promo Tile | 440×280 | ✅ Ready | `store/assets/promo-440x280.png` |
| Marquee Promo Tile | 1400×560 | ✅ Ready | `store/assets/promo-1400x560.png` |

### Screenshot Notes
- Screenshot 1 is a generated mock (`store/generate_assets.py`). Its caption mentions
  `document.hidden = false` — consider rewording to a user benefit.
- Screenshot 2 (real capture) needs a retake before use: the popup is cut off on the
  right, the hint text is from an older build, and it shows a third-party site
  (L'Équipe branding) plus personal bookmarks/extensions. Retake on a neutral page
  with the full popup visible.
- Idea for screenshot 3: popup in "Paused" state, or a video still playing in a
  background tab.

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `storage` | permissions | Saves the user's on/off choice from the toolbar popup so it is remembered across browser restarts and applied to every tab. Nothing else is stored. |
| `<all_urls>` | content_scripts matches | The feature must apply on whichever site the user is watching or studying on (video platforms, course sites, embedded players in iframes), which cannot be known in advance. The scripts only change what the page sees about tab visibility/focus; they do not read page content, and nothing is transmitted. No `host_permissions` are requested. |

<!-- No remote code: all scripts are bundled in the package. -->

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|-----------|-----------|------------------------|---------|---------------------------|
| Personally identifiable info | No | No | — | No |
| Health info | No | No | — | No |
| Financial info | No | No | — | No |
| Authentication info | No | No | — | No |
| Personal communications | No | No | — | No |
| Location | No | No | — | No |
| Web history | No | No | — | No |
| User activity | No | No | — | No |
| Website content | No | No | — | No |

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL**
https://yoann54.github.io/stayactive/  (source: `docs/index.html`, bilingual EN/FR — live, HTTP 200 on 2026-11-05)

## Distribution

**Visibility**: Public  <!-- to confirm -->
**Regions**: All regions  <!-- to confirm -->

## Developer Info

**Publisher Name**: <!-- TODO -->

**Contact Email**: <!-- TODO: shown publicly on the listing -->

**Support URL**: https://github.com/yoann54/stayactive/issues

**Homepage URL**: https://github.com/yoann54/stayactive

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.3 | 2026-11-05 | Fixed pages staying paused in background tabs after StayActive was switched back on; toolbar badge now restored when the extension is re-enabled; popup no longer flashes "Active" before loading the saved state. | Draft |
| 1.0.2 | 2026-10-07 | Private per-page state channel (pages can no longer turn the extension off); pages resync when switched off; dropped redundant host_permissions; requires Chrome 111. | <!-- to confirm --> |
| 1.0.1 | 2026-10-05 | Fixed event blocking that broke some sites; popup accessibility (labelled switch, screen-reader announcements, reduced motion); removed ad wording from listing. | <!-- to confirm --> |
| 1.0.0 | 2026-05-25 | Initial release. | <!-- to confirm --> |

## Review Notes

### Known Issues / Limitations
- Tabs open before installation must be reloaded to be covered.
- Does not run on `chrome://` pages or the Chrome Web Store (Chrome restriction).
- Chrome's own background-tab throttling of timers/animations still applies.
- Reviewers may question `<all_urls>`: the justification above explains why the
  feature cannot be limited to a fixed list of sites.

### Rejection History
None recorded.
