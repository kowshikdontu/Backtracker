
function getProblemTitle() {
    const host = window.location.hostname;
    let title = "";
    let sitePrefix = "";

    if (host.includes("codeforces.com")) {
        sitePrefix = "[Codeforces]";
        const titleElement = document.querySelector('.problem-statement .title');
        if (titleElement) {

            title = titleElement.innerText.replace(/^[A-Z]\.\s*/, '');
        }
    }
    else if (host.includes("leetcode.com")) {
        sitePrefix = "[LeetCode]";
        const titleElement = document.querySelector('div[data-cy="question-title"]');
         if (!titleElement) {
             title = document.title.split('-')[0].trim();
         } else {
              title = titleElement.innerText;
         }
    }
    else if (host.includes("geeksforgeeks.org")) {
         sitePrefix = "[GFG]";
         const titleElement = document.querySelector('.problem-header__title');
         if(titleElement) title = titleElement.innerText;
    }

    if (!title) {
        title = document.title;
    }

    return `${sitePrefix} ${title.trim()}`.trim();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTitle") {
        const extractedTitle = getProblemTitle();
        sendResponse({ title: extractedTitle });
    }
});