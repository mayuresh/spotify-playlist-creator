# Spotify Playlist Creator Chrome Extension

A Chrome extension that allows users to create Spotify playlists from selected text on any webpage. The extension provides an intuitive interface for searching and selecting the correct songs, with support for artist refinement to ensure accuracy.

## Requirements

### Core Requirements
1. **Text Selection and Playlist Creation**
   - Users should be able to select song titles from any webpage
   - Support for multi-line text selection
   - Right-click context menu integration for playlist creation
   - Option to create new playlist or add to existing playlist

2. **Spotify Integration**
   - Secure OAuth 2.0 authentication with Spotify
   - Access to user's playlists
   - Ability to create new playlists
   - Ability to add songs to existing playlists
   - Search functionality using Spotify's Web API

3. **Song Selection Interface**
   - Display multiple search results for each song
   - Show album artwork, artist name, and release year
   - Allow artist name refinement for better search results
   - Support for selecting one version of each song
   - Real-time search updates

### Technical Requirements
1. **Authentication**
   - Use Chrome Identity API for OAuth flow
   - Secure token storage using Chrome Storage API
   - Handle token expiration and renewal

2. **User Interface**
   - Two-step dialog process:
     1. Playlist selection/creation
     2. Song selection and refinement
   - Responsive and user-friendly design
   - Clear feedback for user actions

3. **Performance**
   - Asynchronous API calls
   - Efficient storage usage
   - Minimal impact on webpage performance

## Design Decisions

### Architecture
- **Modular Structure**: Separated into distinct components (background, popup, dialogs, utils)
- **Service Worker**: Background script handles context menu and coordinates communication
- **Content Script**: Minimal content script only for text selection
- **Utility Class**: Centralized Spotify API interactions in SpotifyAPI class

### Security Considerations
- OAuth token stored securely in Chrome Storage
- No sensitive data stored in local storage
- Secure communication with Spotify API

### User Experience
- Two-step process to prevent overwhelming users
- Search refinement to ensure correct songs are added
- Visual feedback throughout the process
- Keyboard support (Enter key for search)

## Dependencies
- Chrome Extension APIs
- Spotify Web API
- No external JavaScript libraries required

## Installation Requirements
1. Spotify Developer Account
2. Registered Spotify Application
3. Chrome Developer Account (for store publication)

## Development Setup
1. Clone repository
    ```bash
    git clone https://github.com/yourusername/spotify-playlist-creator.git
    cd spotify-playlist-creator
    ```
2. Register Spotify Application
    - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
    - Create a new application
    - Note down the Client ID
3. Add Client ID to utils/spotify.js
4. Load unpacked extension in Chrome
    - Open Chrome and go to chrome://extensions/
    - Enable Developer Mode
    - Click "Load unpacked" and select the extension directory

## Future Enhancements
- Song preview functionality
- Batch song selection
- Custom playlist cover images
- Success notifications
- Direct Spotify web player integration

## Privacy Considerations
- Only requires necessary permissions
- No user data collection beyond Spotify authentication
- Transparent OAuth process 