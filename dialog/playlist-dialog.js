/**
 * Playlist Dialog Script
 * Handles the playlist creation/selection interface
 */

import SpotifyAPI from '../utils/spotify.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Get references to DOM elements
  const newPlaylistContainer = document.getElementById('new-playlist-container');
  const existingPlaylistContainer = document.getElementById('existing-playlist-container');
  const playlistSelect = document.getElementById('playlist-select');
  const newPlaylistName = document.getElementById('new-playlist-name');
  const createButton = document.getElementById('create-button');
  const cancelButton = document.getElementById('cancel-button');
  
  let selectedSongs = new Map(); // Store selected songs for each title
  let playlistData = null;

  // Get the selected text from storage
  const data = await chrome.storage.local.get(['pendingSelection', 'playlistData']);
  if (data.pendingSelection && data.playlistData) {
    // Parse selected text into song titles
    const songTitles = data.pendingSelection.text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    playlistData = data.playlistData;

    // Create search interface for each song
    for (const songTitle of songTitles) {
      const songGroup = document.createElement('div');
      songGroup.className = 'song-group';
      
      // Create search controls for this song
      const searchControls = document.createElement('div');
      searchControls.className = 'search-controls';
      searchControls.innerHTML = `
        <h3>Search for: ${songTitle}</h3>
        <div class="search-inputs">
          <input type="text" class="artist-input" placeholder="Specify artist (optional)">
          <button class="search-button">Search</button>
        </div>
      `;
      
      const resultsContainer = document.createElement('div');
      resultsContainer.className = 'results-container';
      
      /**
       * Performs search and updates results display
       * @param {string} artistName - Optional artist name for filtering
       */
      async function performSearch(artistName = '') {
        try {
          resultsContainer.innerHTML = '<p>Searching...</p>';
          const tracks = await SpotifyAPI.searchTracks(songTitle, artistName);
          
          if (tracks.length === 0) {
            resultsContainer.innerHTML = '<p>No results found</p>';
            return;
          }
          
          // Display search results
          resultsContainer.innerHTML = '';
          tracks.forEach(track => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'search-result';
            resultDiv.innerHTML = `
              <input type="radio" name="song-${songTitle}" value="${track.uri}">
              <img src="${track.album.images[track.album.images.length-1].url}" alt="Album art">
              <div class="song-info">
                <div class="song-title">${track.name}</div>
                <div class="song-artist">${track.artists.map(a => a.name).join(', ')}</div>
                <div class="song-album">${track.album.name} (${new Date(track.album.release_date).getFullYear()})</div>
              </div>
            `;
            
            // Handle song selection
            const radio = resultDiv.querySelector('input');
            radio.addEventListener('change', () => {
              selectedSongs.set(songTitle, track.uri);
            });
            
            resultsContainer.appendChild(resultDiv);
          });
        } catch (error) {
          console.error('Error searching for song:', error);
          resultsContainer.innerHTML = '<p>Error loading results</p>';
        }
      }
      
      // Set up search button handler
      const searchButton = searchControls.querySelector('.search-button');
      const artistInput = searchControls.querySelector('.artist-input');
      
      searchButton.addEventListener('click', () => {
        performSearch(artistInput.value.trim());
      });
      
      // Add enter key support for artist input
      artistInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch(artistInput.value.trim());
        }
      });
      
      // Assemble and add the song group
      songGroup.appendChild(searchControls);
      songGroup.appendChild(resultsContainer);
      songsContainer.appendChild(songGroup);
      
      // Perform initial search
      performSearch();
    }
  }

  // Handle add selected songs button click
  addSelectedButton.addEventListener('click', async () => {
    if (selectedSongs.size > 0) {
      const trackUris = Array.from(selectedSongs.values());
      
      try {
        // Create or get target playlist
        let targetPlaylistId;
        if (playlistData.playlistChoice === 'new') {
          const playlist = await SpotifyAPI.createPlaylist(
            playlistData.newPlaylistName || 'My Web Selection Playlist'
          );
          targetPlaylistId = playlist.id;
        } else {
          targetPlaylistId = playlistData.playlistId;
        }

        // Add selected tracks to playlist
        await SpotifyAPI.addTracksToPlaylist(targetPlaylistId, trackUris);
        window.close();
      } catch (error) {
        console.error('Error adding tracks:', error);
      }
    }
  });

  // Handle cancel button click
  cancelButton.addEventListener('click', () => {
    window.close();
  });
}); 