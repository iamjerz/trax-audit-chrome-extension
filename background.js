const CLIENT_ID = "6f505bfd-7c3f-4e89-9d10-ad5df53b6d39";
const TENANT_ID = "498e7996-208f-4634-90c8-198d2a2626d0";
const SCOPE = "api://6f505bfd-7c3f-4e89-9d10-ad5df53b6d39/access_as_user openid profile email"

const REDIRECT_URI = chrome.identity.getRedirectURL();

const AUTH_URL =
    `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&response_type=token` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPE)}` +
    `&response_mode=fragment`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "login") {

        chrome.identity.launchWebAuthFlow({
                url: AUTH_URL,
                interactive: true
            },
            (redirectUrl) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    sendResponse({
                        error: chrome.runtime.lastError.message
                    });
                    return;
                }

                const params = new URLSearchParams(
                    new URL(redirectUrl).hash.substring(1)
                );

                const accessToken = params.get("access_token");
                const expiresIn = params.get("expires_in"); // seconds

                sendResponse({
                    token: accessToken,
                    expiresIn: expiresIn,
                    parameters: params
                });
            }
        );

        return true; // async
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({
        openPanelOnActionClick: true
    });
});
