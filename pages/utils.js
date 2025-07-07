/**
 * =============================================================================
 * utils.js – Reusable Utility Functions for Alumni Dashboard UI
 * -----------------------------------------------------------------------------
 * This module provides a set of simple, reusable helper functions to make
 * common UI and data tasks easier across the alumni dashboard. These utilities
 * help format names and dates, animate elements, manage button loading states,
 * debounce rapid function calls (like search), and generate consistent avatar
 * colors. By centralizing these helpers, the codebase stays cleaner, more
 * readable, and easier to maintain for beginners and experienced devs alike.
 *
 * How it works:
 * - All helpers are grouped under the `Utils` object for easy access.
 * - Each function solves a common UI/data problem (see comments below).
 * - Designed to be safe (null checks), efficient, and beginner-friendly.
 * =============================================================================
 */

const Utils = {
  /**
   * Get initials from first and last name.
   * Example: "Bibhu Mishra" → "BM"
   * Useful for avatar placeholders.
   * @param {string} first - First name
   * @param {string} last - Last name
   * @returns {string} Uppercase initials
   */
  getInitials: (first = "", last = "") =>
    `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`,

  /**
   * Format an ISO date string to "DD Mon YYYY".
   * Example: "2025-06-01T05:58:07.111Z" → "01 Jun 2025"
   * Makes dates user-friendly in the UI.
   * @param {string} iso - ISO date string
   * @returns {string} Formatted date
   */
  formatDate: iso =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }),

  /**
   * Add a CSS animation class to an element, then remove it after animation ends.
   * Useful for drawing attention to UI changes (e.g., fade-in, shake).
   * @param {HTMLElement} el - The element to animate
   * @param {string} name - Animation name (default: "fade-in")
   */
  animateElement(el, name = "fade-in") {
    if (!el) return;
    el.classList.add("animate__animated", `animate__${name}`);
    el.addEventListener(
      "animationend",
      () => el.classList.remove("animate__animated", `animate__${name}`),
      { once: true }
    );
  },

  /**
   * Show a loading spinner inside a button and disable it during async actions.
   * Stores the previous button text to restore later.
   * @param {HTMLButtonElement} btn - The button to show loading on
   * @param {string} text - Loading text (default: "Saving…")
   */
  showButtonLoading(btn, text = "Saving…") {
    if (!btn) return;
    btn.dataset.prevText = btn.innerHTML;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>${text}`;
    btn.disabled = true;
  },

  /**
   * Restore a button's original text and enabled state after loading.
   * @param {HTMLButtonElement} btn - The button to restore
   */
  hideButtonLoading(btn) {
    if (!btn || !btn.dataset.prevText) return;
    btn.innerHTML = btn.dataset.prevText;
    btn.disabled = false;
    delete btn.dataset.prevText;
  },

  /**
   * Debounce a function: delays its execution until after a pause in calls.
   * Useful for search boxes or resize events to avoid excessive calls.
   * @param {Function} fn - The function to debounce
   * @param {number} delay - Delay in ms (default: 300)
   * @returns {Function} Debounced function
   */
  debounce(fn, delay = 300) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Generate a deterministic pastel color for avatars based on a name.
   * Ensures the same name always gets the same color.
   * @param {string} name - The name to base the color on
   * @returns {string} HSL color string
   */
  generateAvatarColor(name = "") {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
  }
};

