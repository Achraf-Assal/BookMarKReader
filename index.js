// const ul = document.getElementById('bookmarksList');
//  const li = document.createElement('li');
//  li.textContent = 'test';
//  ul.appendChild(li);
console.log(1,'index file');
chrome.runtime.sendMessage({ action: 'getBookmarks' }, (bookmarks) => {
    console.log(2,"action has beensent");
    const ul = document.getElementById('bookmarksList');
    console.log(bookmarks);
    // bookmarks.forEach((bookmark) => {
    //     const li = document.createElement('li');
    //     li.textContent = bookmark.title;
    //     ul.appendChild(li);
    // });
});