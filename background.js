chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      const url = new URL(tab.url);
      const hostname = url.hostname;
      
      const { disabledSites = [] } = await chrome.storage.sync.get('disabledSites');
      const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
      
      if (isLocalhost || disabledSites.includes(hostname)) {
        chrome.scripting.executeScript({
          target: { tabId },
          func: () => {
            localStorage.setItem('datafast_ignore', 'true');
          }
        });
      }
    }
  });