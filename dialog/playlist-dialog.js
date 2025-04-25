/**
 * Playlist Dialog Script
 * Handles the playlist creation/selection interface
 */

import SpotifyAPI from '../utils/spotify.js';

document.addEventListener('DOMContentLoaded', async () => {
  const newPlaylistContainer = document.getElementById('new-playlist-container');
  const existingPlaylistContainer = document.getElementById('existing-playlist-container');
  const playlistSelect = document.getElementById('playlist-select');
  const newPlaylistName = document.getElementById('new-playlist-name');
  const createButton = document.getElementById('create-button');
  const cancelButton = document.getElementById('cancel-button');

  // Handle radio button changes
  document.querySelectorAll('input[name="playlist-choice"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'new') {
        newPlaylistContainer.style.display = 'block';
        existingPlaylistContainer.style.display = 'none';
      } else {
        newPlaylistContainer.style.display = 'none';
        existingPlaylistContainer.style.display = 'block';
        loadPlaylists();
      }
    });
  });

  // Load user's playlists
  async function loadPlaylists() {
    try {
      const playlists = await SpotifyAPI.getUserPlaylists();
      playlistSelect.innerHTML = playlists
        .map(playlist => `<option value="${playlist.id}">${playlist.name}</option>`)
        .join('');
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  }

  // Handle create button click
  createButton.addEventListener('click', () => {
    const playlistChoice = document.querySelector('input[name="playlist-choice"]:checked').value;
    const data = {
      playlistChoice,
      playlistId: playlistChoice === 'existing' ? playlistSelect.value : null,
      newPlaylistName: playlistChoice === 'new' ? newPlaylistName.value : null
    };

    chrome.runtime.sendMessage({
      type: 'PROCESS_PLAYLIST',
      data
    });
  });

  // Handle cancel button click
  cancelButton.addEventListener('click', () => {
    window.close();
  });
}); 