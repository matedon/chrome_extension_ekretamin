// background.js manifest v2 to v3 replacement!

// Importing and using functionality from external files is also possible.
importScripts('service-worker-utils.js')

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'console_log') {
        console.log(request.message)
    }
})