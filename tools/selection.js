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
            hideLoader();
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
            // When the LDA changes, repopulate the coaching-reference dropdown
            // (this cascade was previously missing from selection.js)
            if (this.name === "lda-name") {
                const refChoices = choicesMap['coaching-reference'];

                if (!refChoices) {
                    console.error('coaching-reference not initialized', choicesMap);
                    return;
                }

                refChoices.removeActiveItems();
                refChoices.clearChoices();
                refChoices.disable();

                if (!this.value) {
                    refChoices.setChoices([
                        { value: '', label: 'Select Coaching Reference', disabled: true }
                    ], 'value', 'label', true);
                    refChoices.enable();
                    return;
                }

                refChoices.setChoices([
                    { value: '', label: 'Loading coaching references...', disabled: true }
                ], 'value', 'label', true);

                appendCoachingReference(this.value);
                return;
            }

            if (this.name === "coaching-type") {
                appendCoachingForm(_form);
            }
        });
    });
}

// Populate the coaching-reference dropdown for the selected LDA
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
            const list = response.list || response.data || response.results || [];
            const items = list.map(u => ({
                value: u.audit_id,
                label: u.audit_id
            }));

            const refChoices = choicesMap['coaching-reference'];
            if (!refChoices) {
                console.error('Choices instance missing:', choicesMap);
                hideLoader();
                return;
            }

            refChoices.clearChoices();

            if (items.length === 0) {
                refChoices.setChoices([
                    { value: '', label: 'No coaching references found', disabled: true }
                ], 'value', 'label', true);
            } else {
                refChoices.setChoices(items, 'value', 'label', true);
            }

            refChoices.enable();
            hideLoader();
        },
        error: function(xhr) {
            console.log(xhr.responseText);
            const refChoices = choicesMap['coaching-reference'];
            if (refChoices) {
                refChoices.clearChoices();
                refChoices.setChoices([
                    { value: '', label: 'Could not load coaching references', disabled: true }
                ], 'value', 'label', true);
                refChoices.enable();
            }
            hideLoader();
        }
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

    // Do not fire a request to /api/forms/undefined
    if (!subtitle) {
        console.error("appendCoachingForm: unknown form title", title);
        hideLoader();
        return;
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
            hideLoader();
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