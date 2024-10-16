
// function ManegingJsonFil(bookmarks) {
//   try {
//     const jsonBookmarks = JSON.stringify(bookmarks);
//     // const blob = new Blob([jsonBookmarks], { type: 'application/json' });
//     // const url = URL.createObjectURL(blob);
//     const dataURI = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonBookmarks);
//     chrome.downloads.download({
//       url: dataURI,
//       filename: 'bookmarks.json'
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }


function CreateBookmark(bookmark) {
  const { children, ...createdData } = bookmark; // Destructure 'children' from the bookmark object

  // Check if the bookmark is a folder or a bookmark
  if (children && Array.isArray(children)) {
    // If it's a folder, first create the folder
    chrome.bookmarks.create(createdData, (createdFolder) => {
      // Recursively add children to the folder
      children.forEach((child) => {
        child.parentId = createdFolder.id; // Set parentId to the id of the created folder
        CreateBookmark(child);
      });
    });
  } else {
    // If it's a bookmark, simply create it
    chrome.bookmarks.create(createdData);
  }
}

function GetCheldrenNode(bookmark) {
  try {
    const bookmarksJSON = [];
    bookmark.forEach((node) => {
      const _bookmark = {
        // id: node.id || null,
        title: node.title,
        url: node.url || null,
        parentId: node.parentId? node.parentId :null,
        children: node.children ? GetCheldrenNode(node.children) : null
      }

      bookmarksJSON.push(_bookmark);

    });
    return bookmarksJSON;
  } catch (error) {
    console.log(error);
  }

}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getBookmarks') {
    chrome.bookmarks.getTree(function (bookmarkTreeNodes) {
      const bookmarksJSON = GetCheldrenNode(bookmarkTreeNodes);
      // ManegingJsonFil(bookmarksJSON);
      console.log(bookmarksJSON);
    });
  }
  if (message.action === 'createBookmarks') {

    const jsonData = message.jsonData;
    jsonData.forEach((bookmark)=>{
      CreateBookmark(bookmark)
    });
  }
});

