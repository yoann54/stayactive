# StayActive — Chrome Web Store listing (EN)

## Name
StayActive

## Summary (short description, 132 chars max)
Keep websites convinced your tab is always active. Ads, videos and timers won't pause when you switch tabs.

## Category
Productivity

## Language
English

## Detailed description
StayActive keeps the current tab "in focus" from a website's point of view,
even when you switch to another tab or window.

Some sites pause videos, ads or timers as soon as you leave — StayActive
prevents that by spoofing the Page Visibility API and focus events the
browser exposes to the page.

Features
• One-click toggle from the toolbar
• Works on all sites, including iframes
• No tracking, no analytics, no remote servers
• Fully open source

How it works
The extension overrides document.hidden, document.visibilityState,
document.hasFocus() and silences visibilitychange / blur / pagehide events
so the page believes the tab remains active.

Privacy
StayActive does not collect, store or transmit any data. The only thing
it saves locally is your on/off preference.

## Keywords / tags
tab focus, page visibility, prevent pause, background tab, keep active,
no pause, always on, always active, ads keep playing

## Single purpose statement (for store review)
StayActive overrides the Page Visibility API and focus/blur events
inside web pages so that websites believe the current tab remains
visible and focused, preventing them from pausing playback or
suspending behaviour when the user switches tabs.

## Permission justifications
- storage: store the user's on/off preference locally.
- host_permissions <all_urls>: the visibility-spoofing script must be
  injected into every page where the user wants the feature to work;
  the extension does not read page content or transmit any data.

## Data usage disclosure (Chrome Web Store form)
- Personally identifiable information: No
- Health information: No
- Financial / payment information: No
- Authentication information: No
- Personal communications: No
- Location: No
- Web history: No
- User activity: No
- Website content: No

Certification:
I do not sell or transfer user data to third parties.
I do not use or transfer user data for purposes unrelated to the
extension's single purpose.
I do not use or transfer user data to determine creditworthiness or
for lending purposes.
