
const BACKEND_URL = "http://localhost:8000";
const LOGIN_URL = `${BACKEND_URL}/auth/token`;
const CREATE_PROBLEM_URL = `${BACKEND_URL}/problemset/create`;

document.addEventListener('DOMContentLoaded', async () => {

    const loginSection = document.getElementById('loginSection');
    const appSection = document.getElementById('appSection');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const loginStatus = document.getElementById('loginStatus');

    const logoutBtn = document.getElementById('logoutBtn');
    const createBtn = document.getElementById('createBtn');
    const statusDiv = document.getElementById('statusMessage');

    chrome.storage.local.get(['access_token'], (result) => {
        if (result.access_token) {
            showApp();
        } else {
            showLogin();
        }
    });
    console.log("i'm here")

    loginBtn.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        loginBtn.innerText = "Logging in...";
        loginBtn.disabled = true;
        loginStatus.className = 'status-msg';

        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error("Login failed. Check credentials.");

            const data = await response.json();
            const token = data.access_token;

            chrome.storage.local.set({ access_token: token }, () => {
                showApp();
            });

        } catch (err) {
            loginStatus.innerText = err.message;
            loginStatus.classList.add('error');
        } finally {
            loginBtn.innerText = "Login";
            loginBtn.disabled = false;
        }
    });

    logoutBtn.addEventListener('click', () => {
        chrome.storage.local.remove('access_token', () => {
            showLogin();
        });
    });

    createBtn.addEventListener('click', async () => {
        createBtn.innerText = "Saving...";

        chrome.storage.local.get(['access_token'], async (res) => {
            const token = res.access_token;
            if(!token) { showLogin(); return; }

            const problemData = {
                title: document.getElementById('problemTitle').value,
                url: document.getElementById('problemUrl').value,
               tags: document.getElementById('tags').value,
                difficulty: document.getElementById('difficulty').value
            };

            try {
                const response = await fetch(CREATE_PROBLEM_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Attach Token
                    },
                    body: JSON.stringify(problemData)
                });
                console.log(problemData)

                if (response.ok) {
                    statusDiv.innerText = "Saved!";
                    statusDiv.classList.add('success');
                    setTimeout(() => window.close(), 1500);
                } else {
                    if(response.status === 401) {
                         // Token expired
                         logoutBtn.click();
                    }
                    throw new Error("Failed to save.");
                }
            } catch (err) {
                statusDiv.innerText = err.message;
                statusDiv.classList.add('error');
                createBtn.innerText = "Add to Sheet";
            }
        });
    });

    function showLogin() {
        loginSection.style.display = 'block';
        appSection.style.display = 'none';
    }

    function showApp() {
        loginSection.style.display = 'none';
        appSection.style.display = 'block';

        loadCurrentTabInfo();
    }

    async function loadCurrentTabInfo() {
         let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
         document.getElementById('problemUrl').value = tab.url;

         chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content_script.js']
        }, () => {
            chrome.tabs.sendMessage(tab.id, { action: "getTitle" }, (response) => {
                if (response && response.title) {
                    document.getElementById('problemTitle').value = response.title;
                }
            });
        });
    }
});