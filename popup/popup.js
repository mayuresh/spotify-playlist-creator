/**
 * Popup Script
 * Handles the extension popup UI and authentication flow
 */

import SpotifyAPI from '../utils/spotify.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Get references to DOM elements
  const loginContainer = document.getElementById('login-container');
  const statusContainer = document.getElementById('status-container');
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');
  const statusMessage = document.getElementById('status-message');
  
  /**
   * Checks and updates the authentication status in the UI
   * Shows/hides appropriate containers based on auth state
   */
  async function checkAuthStatus() {
    const token = await SpotifyAPI.getAuthToken();
    if (token) {
      loginContainer.style.display = 'none';
      statusContainer.style.display = 'block';
      statusMessage.textContent = 'Connected to Spotify';
    } else {
      loginContainer.style.display = 'block';
      statusContainer.style.display = 'none';
    }
  }

  // Handle login button click
  loginButton.addEventListener('click', async () => {
    try {
      console.log('Login button clicked');
      await SpotifyAPI.authenticate();
      await checkAuthStatus();
      // Close popup after successful authentication
      window.close();
    } catch (error) {
      console.error('Login error:', error);
      statusMessage.textContent = 'Login failed. Please try again.';
    }
  });

  // Handle logout button click
  logoutButton.addEventListener('click', async () => {
    await chrome.storage.local.remove('spotify_token');
    await checkAuthStatus();
  });

  /**
   * Listen for messages from background script
   * Updates UI based on playlist creation status
   */
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'PLAYLIST_CREATED') {
      // Show success message with playlist link
      statusMessage.innerHTML = `
        Playlist created successfully!<br>
        Found ${message.data.totalTracks} of ${message.data.totalAttempted} songs.<br>
        <a href="${message.data.playlistUrl}" target="_blank">Open in Spotify</a>
      `;
    } else if (message.type === 'ERROR') {
      statusMessage.textContent = message.error;
    }
  });

  // Check authentication status when popup opens
  await checkAuthStatus();
}); 