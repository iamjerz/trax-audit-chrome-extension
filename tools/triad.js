function TriadCoach(){
    const body_language_input = document.getElementById('body-language-input')?.value || '';
    const body_language_score = document.getElementById('body-language-score')?.value || '';

    const clear_mind_input = document.getElementById('clear-mind-input')?.value || '';
    const clear_mind_score = document.getElementById('clear-mind-score')?.value || '';

    const permission_notes_input = document.getElementById('permission-notes-input')?.value || '';
    const permission_notes_score = document.getElementById('permission-notes-score')?.value || '';

    const choices_question_input = document.getElementById('choices-question-input')?.value || '';
    const choices_question_score = document.getElementById('choices-question-score')?.value || '';

    const was_sme_input = document.getElementById('was-sme-input')?.value || '';
    const was_sme_score = document.getElementById('was-sme-score')?.value || '';

    const recap_summary_input = document.getElementById('recap-summary-input')?.value || '';
    const recap_summary_score = document.getElementById('recap-summary-score')?.value || '';

    const sme_adhere_input = document.getElementById('sme-adhere-input')?.value || '';
    const sme_adhere_score = document.getElementById('sme-adhere-score')?.value || '';

    const clearly_defined_input = document.getElementById('clearly-defined-input')?.value || '';
    const clearly_defined_score = document.getElementById('clearly-defined-score')?.value || '';

    const rca_input = document.getElementById('rca-input')?.value || '';
    const rca_score = document.getElementById('rca-score')?.value || '';

    const line_situation_input = document.getElementById('line-situation-input')?.value || '';
    const line_situation_score = document.getElementById('line-situation-score')?.value || '';

    const Triad = {
        body_language: {
            input: body_language_input,
            score: body_language_score
        },
        clear_mind: {
            input: clear_mind_input,
            score: clear_mind_score
        },
        permission_notes: {
            input: permission_notes_input,
            score: permission_notes_score
        },
        choices_question: {
            input: choices_question_input,
            score: choices_question_score
        },
        was_sme: {
            input: was_sme_input,
            score: was_sme_score
        },
        recap_summary: {
            input: recap_summary_input,
            score: recap_summary_score
        },
        sme_adhere: {
            input: sme_adhere_input,
            score: sme_adhere_score
        },
        clearly_defined: {
            input: clearly_defined_input,
            score: clearly_defined_score
        },
        rca: {
            input: rca_input,
            score: rca_score
        },
        line_situation: {
            input: line_situation_input,
            score: line_situation_score
        }
    };
    return Triad
}



$(document).ready(function() {
    $(document).on('click', '#submit-triad', async function() {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email').toLowerCase();
            const coaching_reference = document.getElementById('coaching-reference')?.value || '';

            const TriadForm = {
                Reference: coaching_reference,
                Triad: TriadCoach(),
                Origin: "Extension",
                email: email
            };

            console.log(TriadForm);
            showLoader();
            const res = await fetch(`${CONFIG.API_BASE_URL}/api/triad`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' // ✅ important
                },
                body: JSON.stringify(TriadForm)
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            if (data.status === 200) {
                hideLoader();

                ShowAlertMessage("Audit created successfully!", "success");

                setTimeout(() => {
                    selection("Triad");
                }, 3000);
                
            }

        } catch (err) {
            console.error("Request failed:", err);
        }
    });
});