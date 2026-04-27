function showLoader() {
    document.getElementById("page-loader").classList.add("active");
}

function hideLoader() {
    document.getElementById("page-loader").classList.remove("active");
}



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
    const email = localStorage.getItem('email').toLowerCase();

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
                document.getElementById("lda-email").value = localStorage.getItem('email').toLowerCase();
            }

            hideLoader();
        },
        error: function(xhr) {
            console.log(xhr.responseText);
        }
    });
}



document.getElementById("login").addEventListener("click", () => {
    showLoader();
    chrome.runtime.sendMessage({
            action: "login"
        },
        async (response) => {

            if (response.error) {
                document.getElementById("output").textContent = response.error;
                return;
            }

            const token = response.token;
            localStorage.setItem('token', token);
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
                    }
                })
                .catch(err => {
                    console.error(err);
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


