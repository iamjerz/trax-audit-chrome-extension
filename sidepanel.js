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
    $.ajax({
        url: 'https://audit-ops.traxtech.com/api/forms/menu',
        method: 'GET', // or POST
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
        }
    });
}

// function recon_call_form() {
//     showLoader();
//     const token = localStorage.getItem('token');
//     $.ajax({
//         url: 'https://audit-ops.traxtech.com/api/forms/recon',
//         method: 'GET', // or POST
//         headers: {
//             'Authorization': 'Bearer ' + token,
//             'Accept': 'application/json'
//         },
//         success: function(response) {
//             $('#page-body').html(response);

//             choicesInit(".choices-js");
//             dateTimeInit(".datetime-js");
//             document.getElementById("lda-email").value = localStorage.getItem('email').toLowerCase();
//             hideLoader();
//         },
//         error: function(xhr) {
//             console.log(xhr.responseText);
//         }
//     });
// }

function loadForm(endpoint) {
    showLoader();
    const token = localStorage.getItem('token');

    $.ajax({
        url: `https://audit-ops.traxtech.com/api/forms/${endpoint}`,
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
            fetch("https://audit-ops.traxtech.com/api/login/verify", {
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
                        $.ajax({
                            url: 'https://audit-ops.traxtech.com/api/forms/menu',
                            method: 'GET', // or POST
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
                            }
                        });
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


$(document).ready(function() {
    $(document).on('click', '#recon-form', function() {
        loadForm("recon")
    });
});

// $(document).ready(function() {
//     $(document).on('click', '#triad-form', function() {
//         loadForm("selection")
//     });
// });


