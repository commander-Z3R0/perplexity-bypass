/**
 * Bypass Perplexity Popup - popup script
 * Runs only when the user clicks "Remove DOM/Login".
 * Injects removeLoginModal() into the active tab via chrome.scripting.
 */

const removeBtn = document.getElementById("removeBtn");
const statusEl = document.getElementById("status");

function setStatus(text, isError) {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", Boolean(isError));
}

/**
 * This function is injected and executed inside the page context.
 * It must be self-contained (no closures over outer variables).
 *
 * IMPORTANT: We do NOT touch the <div data-type="portal"> wrapper itself,
 * since React manages that container and removing it can break React's
 * reconciliation and trigger an "Internal Error" on the page.
 * Instead, we hide (display:none) the pieces that visually and functionally
 * block the page:
 *   1. The role="dialog" box itself (the login/signup UI).
 *   2. The "fixed inset-0" wrapper that centers the dialog (it still
 *      intercepts clicks/scroll even when the dialog inside is hidden).
 *   3. The blurred backdrop overlay (class contains "backdrop-blur").
 * All nodes stay in the DOM for React to find, they're just visually gone
 * and no longer capture pointer events.
 */
function removeLoginModalInPage() {
  let hiddenCount = 0;

  const hide = (el) => {
    if (!el || el.style.display === "none") return;
    el.style.setProperty("display", "none", "important");
    hiddenCount++;
  };

  // 1. The dialog box itself.
  const dialog = document.querySelector('div[role="dialog"][aria-modal="true"]');
  hide(dialog);

  // 2. The fixed, full-screen wrapper that centers the dialog.
  //    Still blocks clicks/scroll across the whole page even if empty.
  if (dialog) {
    const wrapper = dialog.closest(".fixed.inset-0");
    hide(wrapper);
  }

  // 3. The blurred backdrop overlay behind everything.
  document.querySelectorAll('[class*="backdrop-blur"]').forEach(hide);

  if (hiddenCount === 0) {
    return { removed: false, reason: "not-found" };
  }

  // Unlock scrolling. Many component libraries (this page uses Radix UI,
  // visible from the "radix-_r_..." ids) lock scroll by setting an
  // attribute like data-scroll-locked on <html>/<body> and pairing it
  // with an injected CSS rule such as:
  //   body[data-scroll-locked] { overflow: hidden !important; }
  // A plain style.removeProperty("overflow") loses to that !important
  // rule, so we both strip the lock attributes AND force overflow back
  // with !important ourselves.
  [document.documentElement, document.body].forEach((el) => {
    if (!el) return;

    // Remove any scroll-lock style/data attributes some UI libs add.
    el.removeAttribute("data-scroll-locked");
    el.removeAttribute("data-lenis-prevent");
    el.style.removeProperty("padding-right");
    el.style.removeProperty("margin-right");

    // Force scrolling back on, beating any !important rule tied to the
    // attributes above.
    el.style.setProperty("overflow", "auto", "important");
    el.style.setProperty("pointer-events", "auto", "important");
  });

  return { removed: true, hiddenCount };
}

removeBtn.addEventListener("click", async () => {
  setStatus("Working...", false);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id) {
      setStatus("No active tab found.", true);
      return;
    }

    const [{ result } = {}] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: removeLoginModalInPage,
    });

    if (result && result.removed) {
      setStatus(`Hidden ${result.hiddenCount} element(s).`, false);
    } else {
      setStatus("No modal found on this page.", true);
    }
  } catch (err) {
    setStatus("Error: " + (err && err.message ? err.message : "unknown"), true);
  }
});
