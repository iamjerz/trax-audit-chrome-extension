function showLoader() {
    document.getElementById("page-loader").classList.add("active");
}

function hideLoader() {
    document.getElementById("page-loader").classList.remove("active");
}


// ===================================================================
// Session helpers
// ===================================================================

// Null-safe lowercase email (returns "" instead of throwing when not set)
function getEmail() {
    const email = localStorage.getItem('email');
    return email ? email.toLowerCase() : '';
}

// Returns true if no token, or the stored token has passed its expiry
function isTokenExpired() {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') return true;

    const expiry = parseInt(localStorage.getItem('token_expiry'), 10);
    if (!expiry) return false; // no expiry recorded -> let the server decide
    return Date.now() >= expiry;
}

// Clear the session and send the user back to the login view
function forceLogin(message) {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('email');
    hideLoader();

    const loginBtn = document.getElementById('login');
    if (loginBtn) loginBtn.disabled = false;

    if (message) {
        try {
            ShowAlertMessage(message, "warning");
        } catch (e) {
            console.warn(message);
        }
    }
    // Reload the panel so the static login view is shown again
    location.reload();
}

// Centralised auth-failure handling for all jQuery AJAX calls
$(document).ajaxError(function(event, xhr) {
    if (xhr && (xhr.status === 401 || xhr.status === 403)) {
        forceLogin("Your session has expired. Please sign in again.");
    }
});


function choicesInit(className) {
    const elements = document.querySelectorAll(className);

    elements.forEach(function(element) {
        new Choices(element, {
            searchPlaceholderValue: "This is a search placeholder"
        });
    });
}




function dateTimeInit(className) {
    flatpickr(className)
}

function back_to_menu() {
    showLoader();

    const token = localStorage.getItem('token');
    const email = getEmail();

    $.ajax({
        url: `${CONFIG.API_BASE_URL}/api/forms/menu`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email: email
        }),
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        },
        success: function(response) {
            $('#page-body').html(response);
            hideLoader();
        },
        error: function(xhr) {
            console.log(xhr.responseText);
            hideLoader(); // 👈 don’t forget this
        }
    });
}



function loadForm(endpoint) {
    showLoader();
    const token = localStorage.getItem('token');

    $.ajax({
        url: `${CONFIG.API_BASE_URL}/api/forms/${endpoint}`,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        },
        success: function(response) {
            $('#page-body').html(response);
            choicesInit(".choices-js");
            dateTimeInit(".datetime-js");

            if (endpoint == "recon") {
                document.getElementById("lda-email").value = getEmail();
            }

            hideLoader();
        },
        error: function(xhr) {
            console.log(xhr.responseText);
            hideLoader();
        }
    });
}
// ===================================================================
// Check the Details of the Chrome Extension START
// ===================================================================
function checkDetails() {
    showLoader();

    const version = chrome.runtime.getManifest().version;
    const item_id = chrome.runtime.id;

    $.ajax({
        url: `${CONFIG.API_BASE_URL}/api/extension/details/check`,
        method: 'POST',
        headers: {
            Accept: 'application/json'
        },
        data: {
            version: version,
            item_id: item_id
        },
        success: function(response) {
            if (response.status == "invalid") {
                const modal = new bootstrap.Modal(
                    document.getElementById('message-alert-details')
                );
                modal.show();
            }
            hideLoader();
        },
        error: function(xhr) {
            console.log(xhr.responseText);
            hideLoader();
        }
    });
}

// ===================================================================
// Check the Details of the Chrome Extension END
// ===================================================================


let serverStatus = false;

const serverLink = `${CONFIG.API_BASE_URL}/api/extension/connector/check`;

async function checkLink(url) {
    try {
        const response = await fetch(url, {
            method: 'HEAD' // lightweight (no full download)
        });

        if (response.ok) {
            console.log("Accessible:", url);
            modalAlert(true)
            return true;
        } else {
            console.log("Not accessible (status):", response.status);

            modalAlert(false)
            return false;
        }
    } catch (error) {
        console.log("Error / Not reachable:", error);
        modalAlert(false)
        return false;
    }
}

checkLink(serverLink);
checkDetails()


function modalAlert(status) {
    if (!status) {
        const modal = new bootstrap.Modal(
            document.getElementById('message-alert')
        );
        modal.show();
    } else {
        document.getElementById("login").disabled = false;
    }
}


document.getElementById("login").addEventListener("click", () => {

    showLoader();
    chrome.runtime.sendMessage({
            action: "login"
        },
        async (response) => {

            // Background worker returned nothing (e.g. inactive/crashed)
            if (!response) {
                hideLoader();
                const out = document.getElementById("output");
                if (out) out.textContent = "Login failed: no response from extension.";
                return;
            }

            if (response.error) {
                hideLoader();
                const out = document.getElementById("output");
                if (out) out.textContent = response.error;
                return;
            }

            const token = response.token;

            // Guard against a missing/blank token coming back from the auth flow
            if (!token) {
                hideLoader();
                const out = document.getElementById("output");
                if (out) out.textContent = "Login failed: no access token returned.";
                return;
            }

            localStorage.setItem('token', token);

            // Record expiry (seconds from now) so we can detect stale tokens
            const expiresIn = parseInt(response.expiresIn, 10);
            if (expiresIn) {
                localStorage.setItem('token_expiry', String(Date.now() + expiresIn * 1000));
            }

            fetch(`${CONFIG.API_BASE_URL}/api/login/verify`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status == "success") {
                        localStorage.setItem('email', data.email);
                        back_to_menu();
                    } else {
                        // Verify rejected the token - surface it instead of spinning forever
                        hideLoader();
                        const out = document.getElementById("output");
                        if (out) out.textContent = "Login verification failed. Please try again.";
                    }
                })
                .catch(err => {
                    hideLoader();
                    console.error(err);
                    const out = document.getElementById("output");
                    if (out) out.textContent = "Login verification failed. Please try again.";
                });
        }
    );
});



$(document).ready(function() {
    $(document).on('click', '#back-button', function() {
        back_to_menu()
    });
});


// $(document).ready(function() {
//     $(document).on('click', '#recon-form', function() {
//         loadForm("recon")
//     });
// });

// $(document).ready(function() {
//     $(document).on('click', '#triad-form', function() {
//         loadForm("selection")
//     });
// });


