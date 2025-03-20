/**
 * Spotify API Integration Utility Class
 * Handles all interactions with the Spotify Web API
 */

// Configuration constants
const SPOTIFY_CLIENT_ID = 'your_client_id'; // Client ID from Spotify Developer Dashboard
const REDIRECT_URI = chrome.identity.getRedirectURL(); // Chrome extension redirect URI
const SPOTIFY_SCOPES = 'playlist-modify-public playlist-modify-private'; // Required Spotify permissions

class SpotifyAPI {
  /**
   * Retrieves the stored authentication token
   * @returns {Promise<string>} The stored Spotify access token
   */
  static async getAuthToken() {
    const token = await chrome.storage.local.get('spotify_token');
    return token.spotify_token;
  }

  /**
   * Performs OAuth authentication with Spotify
   * Uses Chrome Identity API for secure auth flow
   * @returns {Promise<string>} The new access token
   */
  static async authenticate() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SPOTIFY_SCOPES)}`;
    
    console.log('Starting authentication...');
    console.log('Redirect URI:', REDIRECT_URI);
    
    try {
      // Launch OAuth flow
      const redirectUrl = await chrome.identity.launchWebAuthFlow({
        url: authUrl,
        interactive: true
      });
      
      console.log('Got redirect URL:', redirectUrl);
      
      // Extract token from redirect URL
      const hash = new URLSearchParams(redirectUrl.split('#')[1]);
      const accessToken = hash.get('access_token');
      
      if (!accessToken) {
        throw new Error('No access token received');
      }
      
      // Store token for future use
      console.log('Authentication successful');
      await chrome.storage.local.set({ spotify_token: accessToken });
      return accessToken;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }

  /**
   * Searches for a single track on Spotify
   * @param {string} query - The search query
   * @returns {Promise<Object>} The first matching track
   */
  static async searchTrack(query) {
    const token = await this.getAuthToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.tracks.items[0];
  }

  /**
   * Creates a new Spotify playlist
   * @param {string} name - The name for the new playlist
   * @returns {Promise<Object>} The created playlist object
   */
  static async createPlaylist(name) {
    const token = await this.getAuthToken();
    
    // Get user profile first
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const userData = await userResponse.json();
    
    // Create the playlist
    const response = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        description: 'Created using Spotify Playlist Creator extension'
      })
    });
    return await response.json();
  }

  /**
   * Adds tracks to a playlist
   * @param {string} playlistId - The Spotify playlist ID
   * @param {string[]} trackUris - Array of Spotify track URIs
   */
  static async addTracksToPlaylist(playlistId, trackUris) {
    const token = await this.getAuthToken();
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: trackUris
      })
    });
  }

  /**
   * Retrieves user's playlists
   * @returns {Promise<Object[]>} Array of user's playlists
   */
  static async getUserPlaylists() {
    const token = await this.getAuthToken();
    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.items;
  }

  /**
   * Searches for tracks with optional artist filter
   * @param {string} query - The search query
   * @param {string} artist - Optional artist name to filter results
   * @param {number} limit - Maximum number of results to return
   * @returns {Promise<Object[]>} Array of matching tracks
   */
  static async searchTracks(query, artist = '', limit = 5) {
    const token = await this.getAuthToken();
    let searchQuery = query;
    if (artist) {
      searchQuery = `track:${query} artist:${artist}`;
    }
    
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    return data.tracks.items;
  }
}

export default SpotifyAPI; 