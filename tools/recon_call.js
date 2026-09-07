$(document).ready(function() {
    $(document).on('click', '#recon-form', function() {
        reconSelect("recon")
    });
});


function reconSelect(title) {
    showLoader();

    const token = localStorage.getItem('token');
    console.log("TOKEN::::", token);

    $.ajax({
        url: `${CONFIG.API_BASE_URL}/api/forms/recon`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        success: function(response) {
            $('#page-body').html(response);
            
            dynamicChoices();
            flatpickr(".datetime-js")


            const email = localStorage.getItem('email');
            document.getElementById("lda-email").value = email ? email.toLowerCase() : '';
            hideLoader();
        },
        error: function(xhr) {
            console.log(xhr.responseText);
            hideLoader();
        }
    });
}


$(document).ready(function() {
    $(document).on('click', '#submitBtn', async function() {
        
        const data = {
            submission_id: Date.now().toString(), // temporary unique ID
            recon_call_date: document.getElementById("recon-call-date").value,
            lda_email: document.getElementById("lda-email").value  || null,
            audit_sup_email: document.getElementById("audit-sup-email").value,
            client_code: document.getElementById("client-code").value,
            carrier_code: document.getElementById("carrier-code").value,
            region: document.getElementById("region").value,
            completion_date: document.getElementById("completion-date").value,
            action_owner: document.getElementById("action-owner").value,
            action_item_summary: document.getElementById("action-item-summary").value,
            action_item_details: document.getElementById("action-item-detail").value,
            jira_ticket: document.getElementById("jira-link").value,
            invoice_status: document.getElementById("invoice-status").value,
            status: document.getElementById("status").value,
            raw_data: {
                source: "Chrome Extension",
                branch: "Test Data Only"
            }
        };

        const requiredFields = [
            data.recon_call_date,
            data.audit_sup_email,
            data.client_code,
            data.carrier_code,
            data.region,
            data.action_item_summary,
            data.action_item_details,
            data.jira_ticket,
            data.status,
            data.completion_date,
            data.action_owner,
            data.invoice_status
        ];

        const hasEmpty = requiredFields.some(field => !field || field.trim() === "");

        if (hasEmpty) {
            alert("Please fill out all required fields.");
            return;
        }


        // showLoader();
        const token = localStorage.getItem('token');

        console.log("DATA DATA: ", data)

        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/recon`, {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + token,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            console.log(result);

            if (response.ok) {
                // alert("✅ Saved successfully!");
                ShowAlertMessage("Recon Call Submitted Successfully!", "success");
                setTimeout(() => {
                    reconSelect("recon")
                }, 3000);
                
            } else {
                hideLoader();
                alert("❌ Error: " + JSON.stringify(result));
            }

        } catch (error) {
            hideLoader();
            console.error(error);
            alert("❌ Request failed");
        }


    });
});

