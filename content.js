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


function ImportJsonFile(event) {
  try {
    showLoading()
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async function (event) {
      const jsonContents = await event.target.result;
      const jsonData = await JSON.parse(jsonContents);
      await chrome.runtime.sendMessage({ action: 'createBookmarks', jsonData }, (bookmarks) => {});
    };

    reader.readAsText(file);
    hideLoading() 
  } catch (error) {
    debug(error)
  }
}



document.addEventListener('DOMContentLoaded', function () {
  const exportBtn = document.getElementById('exportBtn');
  exportBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'getBookmarks' }, (bookmarks) => { });
  });

  const fileInput = document.getElementById('fileInput');
  const importBtn = document.getElementById('importBtn');
  importBtn.addEventListener('click', () => {
    //  chrome.runtime.sendMessage({ action: 'createBookmarks' }, (bookmarks) => {});
    fileInput.click();

  });

  fileInput.addEventListener('change', ImportJsonFile)

});






