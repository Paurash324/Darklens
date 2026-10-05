chrome.runtime.onInstalled.addListener(() => chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false }));
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
 if (message.type === 'open-sidepanel' && sender.tab?.windowId !== undefined) chrome.sidePanel.open({ windowId: sender.tab.windowId });
 if (message.type === 'highlight') { chrome.tabs.sendMessage(message.tabId, { type: 'highlight', selector: message.selector }); }
 sendResponse({ ok: true }); return true;
});
