<img alt="logo" align="left" width="200" height="200" src="https://raw.githubusercontent.com/commander-Z3R0/Bypass-perplexity-popup/refs/heads/main/extension/icon128.png">
<h1>Bypass Perplexity Popup</h1>

A tiny Chrome/Edge/Brave extension that removes the login/signup modal that
Perplexity.ai shows on top of the page — on demand, with a single click.

No auto-injection, no background scripts running on every page load: the
extension only acts when **you** click its icon and press the button.

## What it does

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)](https://github.com/commander-z3r0) 
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)

Perplexity periodically shows a full-screen "Sign up to unlock the full
potential of Perplexity" modal with a blurred backdrop that blocks reading
and clicking on the page behind it. This extension gives you a manual
escape hatch: click the extension icon, press **Remove DOM/Login**, and the
modal disappears.

- **Popup-based, not automatic** — nothing runs until you open the
  extension and click the button. No content script silently watching every
  page you visit.
- **Safe DOM handling** — the modal, its centering wrapper, and the
  blurred backdrop are hidden (`display: none`), not deleted from the DOM.
  Deleting React-managed nodes directly can crash the page with an
  `Internal Error`; hiding them keeps React's virtual DOM in sync.
- **Minimal permissions** — only `activeTab` and `scripting`, scoped to
  `perplexity.ai` and `perplexity.com`. No always-on host permissions, no
  tracking, no network requests.

## Known issues

- **Mouse-wheel scrolling stays blocked.** Perplexity locks scrolling with
  [`react-remove-scroll`](https://github.com/theKashey/react-remove-scroll),
  which attaches its own `wheel`/`touchmove` listeners directly to the
  document at the JavaScript level — independent of any CSS, so this
  extension can't reliably undo it.
  - **Workaround:** drag the browser's scrollbar, or use the arrow keys,
    Page Up/Page Down, Home/End, or spacebar to scroll — those still work.

## Download

### Latest release (recommended)

Download the packaged zip directly from the
[**Releases**](../../releases/latest) page, or grab it from the terminal:

```bash
wget https://github.com/commander-Z3R0/bypass-perplexity-popup/releases/latest/download/bypass-perplexity-popup.zip
unzip bypass-perplexity-popup.zip -d bypass-perplexity-popup
```

> Replace the filename above with whatever `.zip` name is listed on the
> [Releases](../../releases/latest) page if it includes a version number
> (e.g. `bypass-perplexity-popup-v2.4.0.zip`).


## Installation in the browser

Works the same way in Chrome, Edge, and Brave.

1. Unzip the download from above if you haven't already.
2. Open your browser's extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked**.
5. Select the folder that directly contains `manifest.json`:
   - That's the folder you just unzipped.
6. (Optional) Click the puzzle-piece icon in the toolbar and pin the
   extension for quick access.

## Usage

1. Go to [perplexity.ai](https://www.perplexity.ai) and wait for the
   login/signup modal to appear.
2. Click the extension's icon in your toolbar.
3. Press **Remove DOM/Login**.
4. The modal and backdrop disappear, and the page becomes clickable and
   readable again. Mouse-wheel scrolling stays blocked (see
   [Known issues](#known-issues)) — drag the scrollbar or use the arrow
   keys / Page Up / Page Down to scroll instead.

The popup shows a short status message after each run (e.g. *"Hidden 3
element(s)."* or *"No modal found on this page."*).

## Permissions explained

| Permission | Why it's needed |
|---|---|
| `activeTab` | Lets the extension act on the tab you're currently viewing, only after you click the extension icon. |
| `scripting` | Required to inject the removal function into the page via `chrome.scripting.executeScript`. |
| `host_permissions` (`*.perplexity.ai`, `*.perplexity.com`) | Scopes script injection to Perplexity's domains only. |

## Disclaimer

- This is a client-side visual/UX workaround, not a way to bypass
  authentication, paywalls, or usage limits — it only hides a UI element on
  your own browser.
- Perplexity may change its markup/class names at any time, which could
  break the extension.
- Not affiliated with or endorsed by Perplexity AI.
- I AM NOT RESPONSIBLE FOR YOUR USE OF THIS !

