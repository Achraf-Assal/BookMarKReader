function debug(text) {
  const p = document.createElement('p');
  p.textContent = text;
  document.body.appendChild(p);
}

function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

// Hide loading indicator
function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendBookmarks') {
    const bookmarks = message.bookmarks;
    displayBookmarks(bookmarks); // Function to render bookmarks on the popup
  }
});

// Function to display the bookmarks on the popup HTML
function displayBookmarks(bookmarks) {
  const bookmarkContainer = document.getElementById('bookmark-container');
  bookmarkContainer.innerHTML = ''; // Clear existing bookmarks
  const rootList = document.createElement('ul');
  bookmarkContainer.appendChild(rootList);
  BookLoop(bookmarks, rootList);
}

// Recursive function to loop through bookmarks and display them as files and folders
function BookLoop(bookmarks, list) {
  if (Array.isArray(bookmarks)) {
    bookmarks.forEach((bookmark) => {
      const { children, title, url } = bookmark;
      const listItem = document.createElement('li');
      
      if (children && Array.isArray(children)) {
        // This is a folder (bookmark with children)
        const folderIcon = document.createElement('span');
        folderIcon.className = 'folder-icon';
        folderIcon.textContent = '📁'; // Folder icon
        
        const folderTitle = document.createElement('span');
        folderTitle.textContent = (title === '') ? 'NoTitle' : title;
        folderTitle.className = 'folder-title';

        // Create a sublist for the child bookmarks
        const sublist = document.createElement('ul');
        sublist.classList.add('hidden'); // Initially hidden
        
        // Toggle children visibility on click
        folderTitle.addEventListener('click', () => {
          sublist.classList.toggle('hidden');
        });

        listItem.appendChild(folderIcon);
        listItem.appendChild(folderTitle);
        list.appendChild(listItem);
        listItem.appendChild(sublist);

        // Recursively render children
        BookLoop(children, sublist);
      } else {
        // This is a file (individual bookmark)
        const fileIcon = document.createElement('span');
        fileIcon.className = 'file-icon';
        fileIcon.textContent = '📄'; // File icon
        
        const bookmarkLink = document.createElement('a');
        bookmarkLink.href = '#'; // Prevent default link behavior
        bookmarkLink.textContent = title;
        bookmarkLink.className = 'file-link';

        // Handle bookmark click to open in a new tab
        bookmarkLink.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent the default link behavior
          chrome.tabs.create({ url }); // Open the bookmark in a new tab
        });

        listItem.appendChild(fileIcon);
        listItem.appendChild(bookmarkLink);
        list.appendChild(listItem);
      }
    });
  }
}

// Request bookmarks from background when popup is opened
chrome.runtime.sendMessage({ action: 'getBookmarks' });




