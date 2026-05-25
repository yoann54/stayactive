# Chrome Web Store assets

This folder contains everything you need to submit StayActive to the
Chrome Web Store.

## Folder layout

```
store/
├── listings/
│   ├── en.md            English store listing (name, descriptions, justifications)
│   └── fr.md            Same, French
└── assets/
    ├── icon-16.png       Extension icon (toolbar small)
    ├── icon-32.png       Extension icon (Windows tray)
    ├── icon-48.png       Extension management page
    ├── icon-128.png      Store listing icon (REQUIRED, 128×128)
    ├── promo-440x280.png Small promo tile (REQUIRED for featuring)
    ├── promo-1400x560.png Marquee promo tile (optional, recommended)
    └── screenshot-1280x800.png Screenshot (REQUIRED, at least one)
```

## Required uploads (Chrome Web Store dashboard)

| Asset                          | Where in the dashboard            | Required |
| ------------------------------ | --------------------------------- | -------- |
| `assets/icon-128.png`          | "Store icon"                      | Yes      |
| `assets/screenshot-1280x800.png` | "Screenshots" (1 to 5)          | Yes (≥1) |
| `assets/promo-440x280.png`     | "Small promo tile"                | Yes      |
| `assets/promo-1400x560.png`    | "Marquee promo tile"              | Optional |

## Listing text

Copy the relevant fields from `listings/en.md` and `listings/fr.md`
into the Chrome Web Store dashboard. Add a translated listing for
each supported language.

## Privacy policy

The store requires a public URL for the privacy policy. A minimal
template:

> StayActive does not collect, store or transmit any personal data.
> The only state stored locally is the on/off preference, via the
> chrome.storage.local API. No data ever leaves the user's browser.

Host this text on a public URL (GitHub Pages, your own site, a Gist)
and paste the link into the "Privacy practices" section.
