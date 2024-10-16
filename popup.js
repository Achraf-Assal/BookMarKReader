document.getElementById('openPopup').addEventListener('click', () => {
    // Send a message to the content script to open the popup
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'openPopup' });
    });
});
