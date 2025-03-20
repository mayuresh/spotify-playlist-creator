// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelection') {
    const selectedText = window.getSelection().toString();
    sendResponse({ selectedText });
  }
  return true; // Required for async response
});

// Optional: Add visual feedback when text is selected
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString();
  if (selectedText) {
    // You could add a small floating button or indicator here
    console.log('Text selected:', selectedText);
  }
}); 