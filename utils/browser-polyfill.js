/**
 * Browser compatibility layer
 * Handles differences between Chrome and Edge
 */
const browserAPI = {
  // Get the current browser's identity API
  getRedirectURL: () => {
    if (typeof browser !== 'undefined') {
      // Firefox/Edge style
      return browser.identity.getRedirectURL();
    }
    // Chrome style
    return chrome.identity.getRedirectURL();
  },

  // Use the appropriate API namespace
  runtime: chrome.runtime || browser.runtime,
  storage: chrome.storage || browser.storage,
  identity: chrome.identity || browser.identity
};

export default browserAPI; 