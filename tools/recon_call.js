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
        const $submitBtn = $(this);

        const data = {
            submission_id: Date.now().toString(), // temporary unique ID
            is_cancelled: document.getElementById("isCancelled")?.checked || false,
            recon_call_date: document.getElementById("recon-call-date").value,
            lda_email: document.getElementById("lda-email").value || null,
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
            },
            is_cancelled: document.getElementById("isCancelled").value,
            who_cancelled: document.getElementById("who-cancel").value,
            cancellation_reason: document.getElementById("cancellation-reason").value,

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
            data.invoice_status,
            data.is_cancelled
        ];

        const hasEmpty = requiredFields.some(field => !field || field.trim() === "");

        if (hasEmpty) {
            alert("Please fill out all required fields.");
            return;
        }


        // 🔴 Lock the button while the request is in flight to prevent double-submission.
        $submitBtn.prop('disabled', true);

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
                hideLoader();
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
        } finally {
            // Always release the lock, whether the request succeeded, failed, or threw.
            $submitBtn.prop('disabled', false);
        }


    });
});
$(document).ready(function() {

    $(document).on('change', '#isCancelled', function() {

        const isCancelled = $(this).is(':checked');

        // Show / hide cancellation sections
        $('#cancel-section-1').prop('hidden', !isCancelled);
        $('#cancel-section-2').prop('hidden', !isCancelled);


        // =====================================================
        // TEXT FIELDS
        // =====================================================

        $('#action-item-summary')
            .val(isCancelled ? 'N/A' : '')
            .prop('readonly', isCancelled);

        $('#action-item-detail')
            .val(isCancelled ? 'N/A' : '')
            .prop('readonly', isCancelled);

        $('#jira-link')
            .val(isCancelled ? 'N/A' : '')
            .prop('readonly', isCancelled);


        // =====================================================
        // INVOICE STATUS
        // =====================================================

        const invoiceStatus = choicesMap['invoice-status'];

        if (invoiceStatus) {

            if (isCancelled) {

                invoiceStatus.setChoices([{
                    value: 'N/A',
                    label: 'N/A',
                    selected: true
                }], 'value', 'label', true);

                invoiceStatus.disable();

            } else {

                invoiceStatus.enable();

            }
        }


        // =====================================================
        // STATUS
        // =====================================================

        const statusOnly = choicesMap['status'];

        if (statusOnly) {

            if (isCancelled) {

                statusOnly.setChoices([{
                    value: 'Done',
                    label: 'Done',
                    selected: true
                }], 'value', 'label', true);

                statusOnly.disable();

            } else {

                statusOnly.enable();

            }
        }


        // =====================================================
        // ACTION OWNER
        // =====================================================

        const actionOwner = choicesMap['action-owner'];

        if (actionOwner) {

            if (isCancelled) {

                actionOwner.setChoices([{
                    value: 'N/A',
                    label: 'N/A',
                    selected: true
                }], 'value', 'label', true);

                actionOwner.disable();

            } else {

                actionOwner.enable();

            }
        }


        // =====================================================
        // COMPLETION DATE - FLATPICKR
        // =====================================================

        const fp = $('#completion-date')[0]?._flatpickr;

        if (fp) {

            if (isCancelled) {

                fp.clear();

                fp._input.value = 'N/A';
                fp.altInput.value = 'N/A';

                fp.set('clickOpens', false);

                fp._input.disabled = true;
                fp.altInput.disabled = true;
                fp.altInput.readOnly = true;

            } else {

                fp._input.disabled = false;
                fp.altInput.disabled = false;
                fp.altInput.readOnly = false;

                fp.set('clickOpens', true);
            }
        }

    });

});