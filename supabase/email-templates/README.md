# Branded sign-in emails

Paste each file into **Supabase → Authentication → Emails** (Templates tab), with its subject:

| Supabase template | File | Subject |
|---|---|---|
| Confirm signup | `confirm-signup.html` | Welcome to Dazzle Warehouse! Please confirm your email 👑 |
| Magic Link | `magic-link.html` | Your Dazzle Warehouse sign-in link |
| Change Email Address | `change-email.html` | Confirm your new email for Dazzle Warehouse |
| Reset Password | `reset-password.html` | Your Dazzle Warehouse password reset code |

Supabase only lets you edit templates once custom SMTP is set up (Authentication → Emails → SMTP Settings).
The sender name ("Supabase Auth") and address also change there, e.g. to "Dazzle Warehouse <hello@yourdomain.com>".
