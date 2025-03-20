import SpotifyAPI from '../utils/spotify.js';

document.addEventListener('DOMContentLoaded', async () => {
  const songsContainer = document.getElementById('songs-container');
  const addSelectedButton = document.getElementById('add-selected-button');
  const cancelButton = document.getElementById('cancel-button');
  
  let selectedSongs = new Map(); // Store selected songs
  let playlistData = null;

  // Get the data from storage
  const data = await chrome.storage.local.get(['pendingSelection', 'playlistData']);
  if (data.pendingSelection && data.playlistData) {
    const songTitles = data.pendingSelection.text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    playlistData = data.playlistData;

    // Search for each song and display results
    for (const songTitle of songTitles) {
      const songGroup = document.createElement('div');
      songGroup.className = 'song-group';
      
      // Create search controls
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
      
      // Function to perform search and update results
      async function performSearch(artistName = '') {
        try {
          resultsContainer.innerHTML = '<p>Searching...</p>';
          const tracks = await SpotifyAPI.searchTracks(songTitle, artistName);
          
          if (tracks.length === 0) {
            resultsContainer.innerHTML = '<p>No results found</p>';
            return;
          }
          
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
      
      // Add search button handler
      const searchButton = searchControls.querySelector('.search-button');
      const artistInput = searchControls.querySelector('.artist-input');
      
      searchButton.addEventListener('click', () => {
        performSearch(artistInput.value.trim());
      });
      
      // Add enter key handler for artist input
      artistInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch(artistInput.value.trim());
        }
      });
      
      songGroup.appendChild(searchControls);
      songGroup.appendChild(resultsContainer);
      songsContainer.appendChild(songGroup);
      
      // Perform initial search
      performSearch();
    }
  }

  // Handle add selected songs
  addSelectedButton.addEventListener('click', async () => {
    if (selectedSongs.size > 0) {
      const trackUris = Array.from(selectedSongs.values());
      
      try {
        let targetPlaylistId;
        if (playlistData.playlistChoice === 'new') {
          const playlist = await SpotifyAPI.createPlaylist(
            playlistData.newPlaylistName || 'My Web Selection Playlist'
          );
          targetPlaylistId = playlist.id;
        } else {
          targetPlaylistId = playlistData.playlistId;
        }

        await SpotifyAPI.addTracksToPlaylist(targetPlaylistId, trackUris);
        window.close();
      } catch (error) {
        console.error('Error adding tracks:', error);
      }
    }
  });

  // Handle cancel
  cancelButton.addEventListener('click', () => {
    window.close();
  });
}); 