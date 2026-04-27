$(document).ready(function() {
    $(document).on('click', '#triad-form', function() {
        selection("Triad");
    });
});

$(document).ready(function() {
    $(document).on('click', '#coaching-form', function() {
        selection("Coaching");
    });
});

// // ✅ GLOBAL (only declare ONCE)
// const choicesMap = {};

function selection(title) {
    showLoader();

    const token = localStorage.getItem('token');
    console.log("TOKEN::::", token);

    $.ajax({
        url: `${CONFIG.API_BASE_URL}/api/forms/selection`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        success: function(response) {

            $('#page-body').html(response);
            appendTicket(title); // init Choices AFTER DOM is loaded
            document.getElementById("extension-title-page").textContent = title;
            hideLoader();
        },
        error: function(xhr) {
            console.log(xhr.responseText);
        }
    });
}
function appendTicket(_form) {

    if (_form === "Triad") {
        const coachingField = document.getElementById("coaching-type-field");
        if (coachingField) {
            coachingField.style.visibility = "hidden";
        }
        appendCoachingForm(_form);
    }

    const elements = document.querySelectorAll("[data-trigger]");
    elements.forEach(el => {
        const instance = new Choices(el, {
            searchEnabled: true,
            shouldSort: false,
            placeholder: true,
            itemSelectText: '',
        });

        choicesMap[el.id] = instance;

        el.addEventListener("change", function () {
            if (this.name === "coaching-type") {
                appendCoachingForm(_form);
            }
        });
    });
}

function appendCoachingForm(title) {
    showLoader();

    let subtitle;

    if (title === "Coaching") {
        subtitle = "coaching-ticket";
    } else if (title === "Triad") {
        subtitle = "triad-ticket";
    }

    const token = localStorage.getItem('token');

    $.ajax({
        url: `${CONFIG.API_BASE_URL}/api/forms/${subtitle}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        success: function(response) {
            $('.forms').html(response);
            choicesInit('.append-ticket');
            hideLoader();
        },
        error: function(xhr) {
            console.log(xhr.responseText);
        }
    });
}

function ShowAlertMessage(message, icon) {

    Swal.fire({
        position: "top-end",
        icon: icon,
        title: message,
        showConfirmButton: !1,
        timer: 2500
    })
}