/**
 * Background Service Worker
 * Handles context menu creation and coordinates communication between components
 */

import SpotifyAPI from '../utils/spotify.js';

// Create context menu item when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'createSpotifyPlaylist',
    title: 'Create Spotify Playlist from Selection',
    contexts: ['selection']
  });
});

/**
 * Shows the playlist creation dialog
 * @param {string} selectedText - The text selected by the user
 * @returns {Promise<void>}
 */
async function showPlaylistDialog(selectedText) {
  // Create and show dialog window
  const dialogUrl = chrome.runtime.getURL('dialog/playlist-dialog.html');
  const dialogWindow = await chrome.windows.create({
    url: dialogUrl,
    type: 'popup',
    width: 400,
    height: 500
  });

  // Store the selected text for the dialog to access
  await chrome.storage.local.set({ 
    pendingSelection: {
      text: selectedText,
      dialogId: dialogWindow.id
    }
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'createSpotifyPlaylist') {
    // Get the selected text directly from the context menu info
    if (info.selectionText) {
      showPlaylistDialog(info.selectionText);
    }
  }
});

/**
 * Message handler for communication between components
 * Processes playlist creation requests and shows song selection dialog
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PROCESS_PLAYLIST') {
    // Store playlist data and show song selection dialog
    chrome.storage.local.set({ playlistData: message.data }, async () => {
      // Create and show the song selection dialog
      const dialogUrl = chrome.runtime.getURL('dialog/song-selection-dialog.html');
      await chrome.windows.create({
        url: dialogUrl,
        type: 'popup',
        width: 650,
        height: 600
      });
      
      // Close the playlist creation dialog
      if (sender.tab) {
        chrome.windows.remove(sender.tab.windowId);
      }
    });
    
    return true; // Required for async response
  }
});