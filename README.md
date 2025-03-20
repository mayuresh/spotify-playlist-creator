# Spotify Playlist Creator Chrome Extension

**Author:** Mayuresh Phadke

A Chrome extension that allows users to create Spotify playlists from selected text on any webpage. The extension provides an intuitive interface for searching and selecting the correct songs, with support for artist refinement to ensure accuracy.

## Acknowledgments
This extension was developed by Mayuresh Phadke with the assistance of Cursor AI, a code generation tool that helped in creating the initial codebase and documentation. The code was then reviewed, refined, and tested to ensure quality and functionality.

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
3. Browser Developer Account (for store publication)
   - Chrome Web Store Developer Account for Chrome
   - Microsoft Partner Center account for Edge

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
4. Load unpacked extension in your browser
   For Chrome:
     - Open Chrome and go to chrome://extensions/
     - Enable Developer Mode
     - Click "Load unpacked" and select the extension directory
   For Edge:
     - Open Edge and go to edge://extensions/
     - Enable Developer Mode
     - Click "Load unpacked" and select the extension directory

## Testing the Extension

### Testing in Chrome
1. **Development Mode**
   - Navigate to chrome://extensions/
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select your extension directory

2. **Debug Tools**
   - Click the "Inspect views" link under your extension
   - Use Chrome DevTools to debug popup and background scripts
   - Check the "Console" tab for logs and errors

3. **Testing Flow**
   - Click the extension icon to test authentication
   - Select text on any webpage and use context menu
   - Verify playlist creation and song search functionality

### Testing in Microsoft Edge
1. **Enable Extension Development**
   - Navigate to edge://extensions/
   - Toggle on "Developer mode" in the left sidebar
   - Click "Load unpacked" and select your extension directory

2. **Debug Tools**
   - Right-click the extension icon and select "Inspect popup"
   - For background script: Click "Background page" under your extension
   - Use Edge DevTools to monitor network requests and console output

3. **Testing Checklist**
   - Verify Spotify authentication works in Edge
   - Test context menu integration
   - Check if playlist creation works
   - Verify song search and selection
   - Test existing playlist selection

### Common Testing Scenarios
- Authentication flow
- Text selection and context menu
- Playlist creation (new and existing)
- Song search with artist refinement
- Error handling and user feedback

### Testing Tips
- Clear extension data between tests
- Test with different text selections
- Verify error messages are displayed
- Check console for any browser-specific issues
- Test with both signed-in and signed-out states

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

## Store Submission Guidelines

### Chrome Web Store Submission
1. **Prepare Store Listing**
   - Create a detailed description (up to 132 characters)
   - Prepare promotional tiles:
     - Small tile: 440x280px
     - Large tile: 920x680px
     - Marquee: 1400x560px
   - Take screenshots (1280x800px or 640x400px)
   - Create a promotional video (optional)

2. **Package the Extension**
   - Remove any development-specific files
   - Ensure manifest.json is properly formatted
   - Create a ZIP file of your extension directory

3. **Submit to Chrome Web Store**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Pay one-time registration fee ($5)
   - Click "New Item" and upload your ZIP file
   - Fill in store listing information
   - Set up pricing and distribution
   - Submit for review (typically 2-3 business days)

### Microsoft Edge Add-ons Store
1. **Prepare Store Assets**
   - Create store listing images:
     - Logo: 300x300px
     - Screenshots: 1280x800px
   - Write compelling description
   - Prepare privacy policy URL

2. **Package Requirements**
   - Same package as Chrome submission
   - Edge Add-ons store accepts Chrome extension packages

3. **Submit to Edge Add-ons**
   - Go to [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview)
   - Create a Microsoft account (free)
   - Submit extension package
   - Provide store listing details
   - Submit for certification (typically 3-5 business days)

### Important Notes
- Both stores require:
  - Privacy policy
  - Clear description of functionality
  - Accurate permission justification
  - No misleading content or branding
- Keep your extension updated
- Monitor store reviews and feedback
- Maintain compliance with store policies 