chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'console_log') {
        console.log(request.message)
    }
})