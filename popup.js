let currentUrl = '';

// Get the current tab's URL
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = new URL(tabs[0].url);
  currentUrl = url.hostname;
  initializePopup();
});

async function initializePopup() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const localhostDefault = document.getElementById('localhostDefault');
  const sitesList = document.getElementById('sitesList');
  const addSiteBtn = document.getElementById('addSite');
  const newSiteInput = document.getElementById('newSite');

  // Load saved sites and settings
  const { disabledSites = [], enableLocalhostByDefault = true } = 
    await chrome.storage.sync.get(['disabledSites', 'enableLocalhostByDefault']);
  
  // Check if current site is localhost
  const isLocalhost = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1');
  
  // Set initial states
  toggleSwitch.checked = isLocalhost || disabledSites.includes(currentUrl);
  localhostDefault.checked = enableLocalhostByDefault;

  // Handle localhost default setting
  localhostDefault.addEventListener('change', async () => {
    await chrome.storage.sync.set({ 
      enableLocalhostByDefault: localhostDefault.checked 
    });
  });

  // Update localStorage based on toggle state
  toggleSwitch.addEventListener('change', async () => {
    const isChecked = toggleSwitch.checked;
    
    await chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (isChecked) => {
          if (isChecked) {
            localStorage.setItem('datafast_ignore', 'true');
          } else {
            localStorage.removeItem('datafast_ignore');
          }
        },
        args: [isChecked]
      });
    });

    // Update disabled sites list
    const { disabledSites = [] } = await chrome.storage.sync.get('disabledSites');
    if (isChecked && !disabledSites.includes(currentUrl)) {
      disabledSites.push(currentUrl);
    } else if (!isChecked) {
      const index = disabledSites.indexOf(currentUrl);
      if (index > -1) disabledSites.splice(index, 1);
    }
    await chrome.storage.sync.set({ disabledSites });
    renderSitesList();
  });

  // Add new site
  addSiteBtn?.addEventListener('click', async () => {
    const newSite = newSiteInput.value.trim();
    if (newSite) {
      const { disabledSites = [] } = await chrome.storage.sync.get('disabledSites');
      if (!disabledSites.includes(newSite)) {
        disabledSites.push(newSite);
        await chrome.storage.sync.set({ disabledSites });
        newSiteInput.value = '';
        renderSitesList();
      }
    }
  });

  function renderSitesList() {
    chrome.storage.sync.get('disabledSites', ({ disabledSites = [] }) => {
      if (sitesList) {
        sitesList.innerHTML = disabledSites.map(site => `
          <div class="flex justify-between items-center p-2 bg-white rounded-md shadow-sm">
            <span class="text-gray-700">${site}</span>
            <button class="text-red-500 hover:text-red-700" onclick="removeSite('${site}')">
              Remove
            </button>
          </div>
        `).join('');
      }
    });
  }

  renderSitesList();
}

// Add this to window object to make it accessible from inline onclick
window.removeSite = async (site) => {
  const { disabledSites = [] } = await chrome.storage.sync.get('disabledSites');
  const index = disabledSites.indexOf(site);
  if (index > -1) {
    disabledSites.splice(index, 1);
    await chrome.storage.sync.set({ disabledSites });
    document.getElementById('sitesList')?.dispatchEvent(new Event('render'));
  }
}; 