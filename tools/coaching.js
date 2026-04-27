function isEmpty(value) {
    return !value || value.trim() === '';
}

// 🔴 Highlight invalid fields
function markInvalid(id) {
    const el = document.getElementById(id);
    if (!el) return false;

    if (isEmpty(el.value)) {
        el.style.border = '1px solid red';
        return true;
    } else {
        el.style.border = ''; // reset
        return false;
    }
}

// ✅ SMART data
function SmartCoaching() {
    return {
        specific: document.getElementById('specific')?.value || '',
        measurable: document.getElementById('measurable')?.value || '',
        achievable: document.getElementById('achievable')?.value || '',
        relevant: document.getElementById('relevant')?.value || '',
        time_bound: document.getElementById('time-bound')?.value || ''
    };
}

// ✅ GROW data
function GrowCoaching() {
    return {
        grow: {
            input: document.getElementById('grow-input')?.value || '',
            comments: document.getElementById('grow-comments')?.value || ''
        },
        reality: {
            input: document.getElementById('reality-input')?.value || '',
            comments: document.getElementById('reality-comments')?.value || ''
        },
        option: {
            input: document.getElementById('option-input')?.value || '',
            comments: document.getElementById('option-comments')?.value || ''
        },
        wayforward: {
            input: document.getElementById('wayforward-input')?.value || '',
            comments: document.getElementById('wayforward-comments')?.value || ''
        }
    };
}

// ✅ Validate SMART fields
function validateSmart() {
    let hasError = false;

    ['specific','measurable','achievable','relevant','time-bound'].forEach(id => {
        if (markInvalid(id)) hasError = true;
    });

    return !hasError;
}

// ✅ Validate GROW fields
function validateGrow() {
    let hasError = false;

    const ids = [
        'grow-input','grow-comments',
        'reality-input','reality-comments',
        'option-input','option-comments',
        'wayforward-input','wayforward-comments'
    ];

    ids.forEach(id => {
        if (markInvalid(id)) hasError = true;
    });

    return !hasError;
}

$(document).ready(function () {
    $(document).on('click', '#submit-coaching', async function () {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email')?.toLowerCase() || '';
            const coaching_reference = document.getElementById('coaching-reference')?.value || '';
            const coaching_type = document.getElementById('coaching-type')?.value || '';
            // 🔴 Validate Reference
            if (isEmpty(coaching_reference)) {
                markInvalid('coaching-reference');
                alert('Coaching reference is required');
                return;
            }
            // 🔴 Validate Reference
            if (isEmpty(coaching_type)) {
                markInvalid('coaching-type');
                alert('Coaching type is required');
                return;
            }

            // 🔴 Validate SMART
            if (!validateSmart()) {
                ShowAlertMessage("Please complete all SMART fields!", "error");
                return;
            }

            // 🔴 Validate GROW
            if (!validateGrow()) {
                ShowAlertMessage("Please complete all GROW fields!", "error");
                return;
            }

            // ✅ Build payload ONLY if valid
            const CoachingForm = {
                reference_type: coaching_type,
                reference: coaching_reference,
                smart: SmartCoaching(),
                grow: GrowCoaching(),
                apps: "Extension",
                email: email
            };

            console.log(CoachingForm);

            
            showLoader();
            const res = await fetch(`${CONFIG.API_BASE_URL}/api/coaching`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(CoachingForm)
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();

            if (data.status === 200) {
                hideLoader();
                ShowAlertMessage("Audit created successfully!", "success");
                
                
                setTimeout(() => {
                    selection("Coaching");
                }, 3000);
            }

        } catch (err) {
            console.error("Request failed:", err);
        }
    });
});