function debug(text) {
  const p = document.createElement('p');
  p.textContent = text;
  document.body.appendChild(p);
}
var BOOKMARKS = []
var VBookmarks = [];

function extractFaviconUrl(url) {
  const regex = /^(https?:\/\/)?(www\.)?([^\/]+)/;
  const match = url.match(regex);
  
  // Capture the protocol, www, and domain
  const protocol = match && match[1] ? match[1] : 'http://'; // default to 'http://' if no protocol found
  const subdomain = match && match[2] ? match[2] : '';        // 'www.' if present
  const domain = match ? match[3] : null;                     // main domain part
  
  // Return the full favicon URL if the domain exists, otherwise return a default icon
  // return domain ? `${protocol}${subdomain}${domain}/favicon.ico` : 'https://freesvg.org/img/Simple-Image-Not-Found-Icon.png';
  return domain ? `https://www.google.com/s2/favicons?sz=64&domain_url=${protocol}${subdomain}${domain}` : 'https://freesvg.org/img/Simple-Image-Not-Found-Icon.png';
}

function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

// Hide loading indicator
function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}
document.getElementById('search').addEventListener('input',async function(){
  console.log('quary')
  var quary = this.value
  var data = []
  var escapedInput = quary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  var regex = new RegExp(escapedInput, 'i')
  VBookmarks = []
  if (this.value !== "") {
    data = await Search(BOOKMARKS,regex)
  }else{
    data = BOOKMARKS
  }
  
  displayBookmarks(data)
}  
);
async function Search(bookmarks,regex) {
  console.log('serch')
  var result = await SearchLoop(bookmarks,regex)
  console.log("result",result);
  return result 
}

async function SearchLoop(bookmarks, regex) {
  console.log('Optimized search loop');
  const stack = [...bookmarks]; // Use a stack for iterative approach

  while (stack.length > 0) {
    const bookmark = stack.pop();

    if (!bookmark) continue;

    const { title, children } = bookmark;
    
    if (title && typeof title === 'string' && regex.test(title)) {
      VBookmarks.push(bookmark);
    }

    if (Array.isArray(children)) {
      stack.push(...children); // Add children to the stack
    }
  }
  
  console.log("Final VBookmarks:", VBookmarks);
  return VBookmarks;
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'sendBookmarks') {
    const bookmarks = message.bookmarks;
    BOOKMARKS.push(...bookmarks)
    displayBookmarks(BOOKMARKS); // Function to render bookmarks on the popup
  }
});

// Function to display the bookmarks on the popup HTML
function displayBookmarks(bookmarks) {
  console.log("display",bookmarks);
  
  const bookmarkContainer = document.getElementById('bookmarks-container');
  bookmarkContainer.innerHTML = ''; // Clear existing bookmarks
  const rootList = document.createElement('ul');
  bookmarkContainer.appendChild(rootList);
  BookLoop(bookmarks, rootList);
}

// Recursive function to loop through bookmarks and display them as files and folders
function BookLoop(bookmarks, list) {
  if (Array.isArray(bookmarks)) {
    bookmarks.forEach((bookmark) => {
      var { children, title, url } = bookmark;
      const listItem = document.createElement('li');
      if (!title || title.trim() === '' && children && Array.isArray(children)) {
        BookLoop(children, list);
      }else{
        if (children && Array.isArray(children) && (url === null || url === '') ) {
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
          listItem.classList.add('Folder');
          listItem.appendChild(folderIcon);
          listItem.appendChild(folderTitle);
          list.appendChild(listItem);
          listItem.appendChild(sublist);
  
          // Recursively render children
          BookLoop(children, sublist);
        } else if(title || title.trim() !== '') {
          // This is a file (individual bookmark)
          let fileIcon = document.createElement('img');
          fileIcon.className = 'file-icon';
          let favicon = extractFaviconUrl(url);
          
          fileIcon.src = favicon; // File icon
          
          let bookmarkLink = document.createElement('a');
          bookmarkLink.href = url; 
          bookmarkLink.textContent = title;
          bookmarkLink.className = 'file-link';
  
          // // Handle bookmark click to open in a new tab
          // bookmarkLink.addEventListener('click', (e) => {
          //   e.preventDefault(); // Prevent the default link behavior
          //   chrome.tabs.create({ url }); // Open the bookmark in a new tab
          // });
          listItem.classList.add('bookmark')
          listItem.appendChild(fileIcon)
          listItem.appendChild(bookmarkLink)
          list.appendChild(listItem);
        }
      }

    });
  }
}

// Request bookmarks from background when popup is opened
chrome.runtime.sendMessage({ action: 'getBookmarks' });




