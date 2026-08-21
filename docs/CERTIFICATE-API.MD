# UP-SKILLS HUB
# CERTIFICATE API DOCUMENTATION
## Frontend Integration Guide

---

# 1. Purpose

This document explains how the frontend should communicate with the Up-Skills Hub Certificate Backend.

The certificate backend provides functionality for:

- Creating certificates
- Viewing certificates
- Viewing one certificate
- Updating certificates
- Deleting certificates
- Revoking certificates
- Verifying certificates
- Downloading certificate PDFs
- Sending certificates to students by email
- Generating certificate numbers
- Generating QR codes

This document is written for the frontend developer so that the frontend can connect to the backend correctly.

---

# 2. Backend Server

The backend runs on:

http://localhost:5000

The certificate API base URL is:

http://localhost:5000/api/certificates

Authentication API:

http://localhost:5000/api/auth/login

---

# 3. Important Frontend URLs

During local development:

```text
Backend:
http://localhost:5000

Certificate API:
http://localhost:5000/api/certificates

Login:
http://localhost:5000/api/auth/login