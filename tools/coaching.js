function SmartCoaching(){
    const specific = document.getElementById('specific').value;
    const measurable = document.getElementById('measurable').value;
    const achievable = document.getElementById('achievable').value;
    const relevant = document.getElementById('relevant').value;
    const time_bound = document.getElementById('time-bound').value;

    const Smart = {
        specific: specific,
        measurable: measurable,
        achievable: achievable,
        relevant: relevant,
        time_bound: time_bound
    };

    return Smart
}

function GrowCoaching(){
    const grow_input = document.getElementById('grow-input')?.value || '';
    const grow_comments = document.getElementById('grow-comments')?.value || '';

    const reality_input = document.getElementById('reality-input')?.value || '';
    const reality_comments = document.getElementById('reality-comments')?.value || '';
    
    const option_input = document.getElementById('option-input')?.value || '';
    const option_comments = document.getElementById('option-comments')?.value || '';

    const wayforward_input = document.getElementById('wayforward-input')?.value || '';
    const wayforward_comments = document.getElementById('wayforward-comments')?.value || '';

    const SmartPlan = {
        grow: {
            input: grow_input,
            comments: grow_comments
        },
        reality: {
            input: reality_input,
            comments: reality_comments
        },
        option: {
            input: option_input,
            comments: option_comments
        },
        wayforward: {
            input: wayforward_input,
            comments: wayforward_comments
        }
    };
    return SmartPlan
}


$(document).ready(function() {
    $(document).on('click', '#submit-coaching', async function() {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email').toLowerCase();
            const coaching_reference = document.getElementById('coaching-reference')?.value || '';

            const CoachingForm = {
                Reference: coaching_reference,
                Smart: SmartCoaching(),
                Grow: GrowCoaching(),
                Origin: "Extension",
                email: email
            };

            console.log(CoachingForm);
            showLoader();
            const res = await fetch('https://audit-ops.traxtech.com/api/coaching', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // ✅ important
                },
                body: JSON.stringify(CoachingForm)
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            if (data.status === 200) {

                selection("Coaching");
                hideLoader();
            }

        } catch (err) {
            console.error("Request failed:", err);
        }
    });
});