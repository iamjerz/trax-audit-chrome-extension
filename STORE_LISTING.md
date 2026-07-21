# Chrome Web Store Listing — Audit Management Dashboard

---

## Short description (132 characters max — appears in search results)

Side panel for Trax Group auditors to complete QA, coaching, reconciliation, and triad audit forms via Microsoft sign-in.

---

## Detailed description (main listing field — 15,000 character max; this is ~3,300)

Audit Management Dashboard is an internal productivity tool built by Trax Group Inc. for its Operations Analytics and Audit teams. It opens as a Chrome side panel that sits next to the auditor's current browser tab, so team members can complete structured audit forms while they work in the systems they are reviewing — without switching windows or copying data between screens.

The extension connects to Trax Group's audit platform (audit-ops.traxtech.com). After a user signs in with their Trax Microsoft 365 (Azure AD) work account, the side panel loads the audit forms and reference data that person is authorized to access, and submits completed audits back to the Trax platform.

WHO THIS IS FOR
This is a business tool intended for authorized Trax Group employees who perform audit and quality-assurance work. A valid Trax organizational Microsoft account is required to sign in. The extension is not useful to the general public and does not provide any functionality without an authenticated Trax account.

WHAT YOU CAN DO
Once signed in, the side panel gives auditors a menu of audit workflows:

• QA Monitoring — Complete a full quality-assurance review with sections for verification, process compliance, engagement, and business analytics. The form calculates section scores and an overall score automatically as the auditor fills it in.

• Coaching — Record coaching sessions using the SMART and GROW coaching frameworks, linked to a specific audit reference.

• Reconciliation Call — Log the outcome of a reconciliation call, including client and carrier codes, region, action items, status, and a linked ticket reference.

• Triad Audit — Complete a triad review with scored criteria such as body language, questioning, summarizing, and root-cause analysis.

HOW IT WORKS
1. Click the extension icon to open the Audit Management Dashboard side panel.
2. Sign in with your Trax Microsoft 365 account (secure OAuth 2.0 single sign-on).
3. Choose an audit type from the menu.
4. Select the relevant client, carrier, and reference values from dropdowns that are populated from the Trax audit platform.
5. Fill in the form and submit. The audit is saved to the Trax platform.

DATA AND PRIVACY
The extension collects only the signed-in user's name and email address (used to identify the auditor on submitted forms). All data is transmitted over HTTPS/TLS to Trax Group's audit platform. Session information is stored locally in the browser for the duration of the session. No data is sold or shared with third parties. A full privacy policy is provided in the listing.

PERMISSIONS — WHY THEY ARE NEEDED
• Side panel — Displays the audit forms in Chrome's side panel next to the current tab.
• Identity — Enables secure Microsoft 365 single sign-on so auditors can authenticate with their Trax work account.
• Storage — Temporarily holds the sign-in session so the user does not have to log in repeatedly during a session.
• Host access to login.microsoftonline.com — Microsoft's OAuth sign-in endpoint used for authentication.
• Host access to audit-ops.traxtech.com — Trax Group's audit platform, where forms and reference data are loaded from and where completed audits are submitted.

SUPPORT
For access requests or support, contact Trax Group Inc. at 1-800-755-0110 or jerramy.calites@traxtech.com.

---

## Reviewer note (paste into "Notes for reviewer" / permissions justification, not the public description)

This is an internal enterprise tool for employees of Trax Group Inc. It requires a Trax-issued Microsoft 365 (Azure AD) account to sign in; the login is restricted to our organization's Azure AD tenant, so a public/test Google account cannot authenticate or see the audit forms.

To allow full review, we can provide either (a) temporary test credentials for our Azure AD tenant, or (b) a short screen recording that walks through sign-in and each audit form (QA Monitoring, Coaching, Reconciliation Call, Triad). Please let us know which you prefer.

Single purpose: the extension provides a side panel for authorized Trax auditors to complete and submit audit/QA forms to the Trax audit platform (audit-ops.traxtech.com). All host permissions and the identity/storage permissions exist solely to support that authenticated workflow.
