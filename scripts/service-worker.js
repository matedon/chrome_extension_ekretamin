// background.js manifest v2 to v3 replacement!

// Importing and using functionality from external files is also possible.
importScripts('service-worker-utils.js')

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'console_log') {
        console.log(request.message)
    }
})

/*
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Execute script in the current tab
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        //executeScript doesn't work with extension files
        //Error: Cannot access a chrome:// URL
        //files: [ "inject/data.bridge.js" ]
    })
})
*/