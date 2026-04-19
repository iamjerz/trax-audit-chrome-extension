// ✅ GLOBAL (only declare ONCE)
const choicesMap = {};

function dynamicChoices() {

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
            if (data.name === "clientCode") {

                const coachingChoices = choicesMap['carrier-code'];

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

                appendCarrierCode(data.value);
            }

        });

    });

    console.log("CHOICES MAP:", choicesMap);
}

function appendCarrierCode(client_code) {
    const token = localStorage.getItem('token');
    showLoader();
    $.ajax({
        url: 'https://audit-ops.traxtech.com/api/dropdown/carrier-code',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        data: {
            client_code: client_code
        },
        success: function(response) {
            console.log("RAW API:", response);

            const list = response.list || response.data || response.results || [];
           console.log("LIST LIST LIST:", list);
            const items = list.map(u => ({
                value: u.combo_carrier_code,
                label: u.combo_carrier_code
            }));

            console.log("NORMALIZED:", list);

            const coachingChoices = choicesMap['carrier-code'];

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
