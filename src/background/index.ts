chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
});

type Tab = { windowId?: number };
type MessageResponse = (response: { ok: boolean }) => void;

chrome.runtime.onMessage.addListener((message: { type?: string; tabId?: number; selector?: string }, _sender: unknown, sendResponse: MessageResponse) => {
  if (message.type === 'open-sidepanel') {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs: Tab[]) => {
      const windowId = tabs[0]?.windowId;
      if (windowId !== undefined) return chrome.sidePanel.open({ windowId });
      return undefined;
    }).then(() => sendResponse({ ok: true })).catch(() => sendResponse({ ok: false }));
    return true;
  }

  if (message.type === 'highlight' && message.tabId !== undefined && message.selector) {
    chrome.tabs.sendMessage(message.tabId, { type: 'highlight', selector: message.selector })
      .then(() => sendResponse({ ok: true }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }

  sendResponse({ ok: false });
  return false;
});
