# Audit Ops – Chrome Extension

> A Chrome side panel extension for Audit Operations at Trax Group Inc., enabling auditors to perform QA monitoring, coaching, reconciliation, and triad audits directly within their browser.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Authentication](#authentication)
- [Permissions](#permissions)
- [Privacy Policy](#privacy-policy)
- [Version](#version)
- [Contact](#contact)

---

## Overview

**Audit Ops** is a Chrome Extension (Manifest V3) built for internal use by the Trax Group Operations Analytics team. It opens as a side panel inside Chrome, allowing auditors to log in via Microsoft SSO and access audit forms — QA monitoring, coaching sessions, reconciliation calls, and triad reviews — all powered by the `audit-ops.traxtech.com` backend API.

---

## Features

- 🔐 **Microsoft SSO Login** — Secure single sign-on via Azure AD (OAuth 2.0)
- 📋 **QA Monitoring Form** — Full audit scoring with verification, process compliance, engagement, and business analytics sections
- 🧑‍🏫 **Coaching Form** — SMART & GROW coaching framework submission
- 📞 **Reconciliation Call Form** — Recon call audit logging
- 🔺 **Triad Form** — Triad-based audit selection and submission
- 🗂️ **Side Panel UI** — Seamlessly embedded alongside any browser tab
- ⚡ **Dynamic Dropdowns** — API-driven carrier code and client code selectors

---

## Tech Stack

| Layer | Technology |
|---|---|
| Extension Platform | Chrome Manifest V3 |
| UI Framework | Bootstrap 5 |
| JavaScript | jQuery 4, Vanilla JS |
| Dropdowns | Choices.js |
| Date Picker | Flatpickr |
| Alerts | SweetAlert2 |
| Auth | Microsoft OAuth 2.0 (Azure AD) |
| Backend API | `https://audit-ops.traxtech.com` |

---

## Project Structure

```
trax-audit-chrome-extension/
│
├── manifest.json              # Extension manifest (MV3)
├── background.js              # Service worker — handles Microsoft SSO auth flow
├── index.html                 # Main side panel HTML (login + dynamic content)
├── sidepanel.js               # Core panel logic — login, menu, form loader
│
├── tools/
│   ├── config.js              # API base URL config (prod / dev toggle)
│   ├── default.js             # Dynamic choices & carrier code loader
│   ├── selection.js           # Coaching & Triad form selection logic
│   ├── coaching.js            # Coaching form submission (SMART + GROW)
│   ├── qa_form.js             # QA monitoring form logic & scoring
│   ├── recon_call.js          # Reconciliation call form
│   ├── triad.js               # Triad audit form
│   └── backup-selection.js    # Backup selection utility
│
├── images/                    # Extension icons (16, 32, 48, 128px)
├── assets/                    # CSS, JS libraries (Bootstrap, Choices, etc.)
│
├── privacy-policy.html        # Privacy Policy (HTML)
└── README.md                  # This file
```

---

## Installation

### Load Unpacked (Development)

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the root folder of this repository.
5. The **Audit Ops** extension will appear in your extensions list.
6. Click the extension icon in the toolbar — the side panel will open automatically.

### Production

Install via the Chrome Web Store *(link to be added upon publishing)*.

---

## Configuration

Environment switching is handled in `tools/config.js`:

```js
const APP_ENV = true; // true = production, false = development

const link = {
    prod: "https://audit-ops.traxtech.com",
    dev: "http://127.0.0.1:8000"
};
```

Set `APP_ENV = false` to point all API calls to your local development server.

---

## Authentication

The extension uses **Microsoft Azure AD OAuth 2.0** for authentication via `chrome.identity.launchWebAuthFlow`.

- **Tenant ID:** Configured in `background.js`
- **Scope:** `api://<client_id>/access_as_user openid profile email`
- **Token storage:** Access token is stored in `localStorage` for the session duration
- **Redirect URI:** Automatically handled by `chrome.identity.getRedirectURL()`

Users must have a valid Trax organizational Microsoft account to log in.

---

## Permissions

| Permission | Purpose |
|---|---|
| `identity` | Microsoft SSO login via `chrome.identity` |
| `storage` | Local session state management |
| `sidePanel` | Renders the extension UI as a Chrome side panel |
| `login.microsoftonline.com` | Microsoft OAuth authentication endpoint |
| `graph.microsoft.com` | Retrieves basic user profile (name & email) |
| `audit-ops.traxtech.com` | Trax backend API for all audit operations |

---

## Privacy Policy

A full Privacy Policy is included in this repository:

📄 [`privacy-policy.html`](./privacy-policy.html)

Key points:
- Only **name and email** are collected upon login
- All data is transmitted over **HTTPS/TLS**
- Session data is stored locally via **localStorage** — no traditional cookies are used
- Compliant with **CCPA** and **GDPR**
- No data is sold to third parties

---

## Version

| Field | Value |
|---|---|
| Version | `1.0.0.5` |
| Manifest Version | 3 |
| Last Updated | April 2026 |

---

## Contact

**Trax Group Inc.**
909 Lake Carolyn Pkwy Suite #260
Irving, Texas 75039
📞 1-800-755-0110

| Role | Name | Email |
|---|---|---|
| Developer | Jerramy Calites | [jerramy.calites@traxtech.com](mailto:jerramy.calites@traxtech.com) |
| Operations Analytics Manager | Julius Christian Ilagan | [julius.ilagan@traxtech.com](mailto:julius.ilagan@traxtech.com) |
