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
            appendTicket(); // init Choices AFTER DOM is loaded
            document.getElementById("extension-title-page").textContent = title;
            hideLoader();
        },
        error: function(xhr) {
            console.log(xhr.responseText);
        }
    });
}

function appendTicket() {

    const elements = document.querySelectorAll("[data-trigger]");

    elements.forEach(el => {

        const instance = new Choices(el, {
            searchEnabled: true,
            shouldSort: false,
            placeholder: true,
            itemSelectText: '',
        });

        // ✅ store globally (NO redeclaration)
        choicesMap[el.id] = instance;

        el.addEventListener("change", function () {

            const data = {
                value: this.value,
                label: this.options[this.selectedIndex]?.text || "",
                name: this.name,
                id: this.id
            };

            console.log("CHANGE:", data);

            // 🔹 LDA changed
            if (data.name === "lda-name") {

                const coachingChoices = choicesMap['coaching-reference'];

                if (!coachingChoices) {
                    console.error('coaching-reference not initialized', choicesMap);
                    return;
                }

                coachingChoices.removeActiveItems();
                coachingChoices.clearChoices();
                coachingChoices.disable();

                coachingChoices.setChoices([
                    { value: '', label: 'Loading coaching references...', disabled: true }
                ], 'value', 'label', true);

                if (!data.value) {
                    coachingChoices.clearChoices();
                    coachingChoices.setChoices([
                        { value: '', label: 'Select Coaching Reference', disabled: true }
                    ], 'value', 'label', true);
                    coachingChoices.enable();
                    return;
                }

                appendCoachingReference(data.value);
            }

            // 🔹 Coaching reference changed
            else if (data.name === "coaching-reference") {
                console.log("DATA DATA", data);
                // appendTicketInformation(data.value);
                appendCoachingForm()
            }

        });

    });

    console.log("CHOICES MAP:", choicesMap);
}

function appendCoachingReference(ldaId) {
    const token = localStorage.getItem('token');
    showLoader();
    $.ajax({
        url: `${CONFIG.API_BASE_URL}/api/selection/ticket`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        data: {
            id: ldaId
        },
        success: function(response) {
            console.log("RAW API:", response);

            const list = response.list || response.data || response.results || [];

            const items = list.map(u => ({
                value: u.audit_id,
                label: u.audit_id
            }));

            console.log("NORMALIZED:", items);

            const coachingChoices = choicesMap['coaching-reference'];

            if (!coachingChoices) {
                console.error('Choices instance missing:', choicesMap);
                return;
            }

            coachingChoices.clearChoices();

            if (items.length === 0) {
                coachingChoices.setChoices([
                    { value: '', label: 'No coaching references found', disabled: true }
                ], 'value', 'label', true);
            } else {
                coachingChoices.setChoices(items, 'value', 'label', true);
            }

            coachingChoices.enable();
            hideLoader();
        },
        error: function(xhr) {
            console.log(xhr.responseText);
        }
    });
}


function appendCoachingForm() {
    showLoader();
    let subtitle;

    const title = document.getElementById("extension-title-page").textContent.trim();

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
            choicesInit('.append-ticket')
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