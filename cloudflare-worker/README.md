# Contact form — Cloudflare setup

This replaces the Tally embed with a plain HTML form that posts to a Cloudflare
Worker, which emails the submission straight to info@letsuan.com using
Cloudflare's native Email Service binding (`env.EMAIL.send()`) — no Tally, no
Resend/SendGrid/MailChannels, no API keys to manage.

## 1. Create a Turnstile widget (replaces the Tally CAPTCHA)

1. Cloudflare dashboard → **Turnstile** → **Add widget**
2. Domain: `letsuan.com`
3. Widget mode: Managed (default is fine)
4. After creating it, copy the **Site Key** and **Secret Key**

Then, in both `astro/src/pages/contact.astro` and
`astro/src/pages/zh-TW/contact.astro`, replace this placeholder:

```html
<div class="cf-turnstile" data-sitekey="0x0000000000000000000000" ...>
```

with your real Site Key.

## 2. Enable Email Service and verify the sending address

1. Cloudflare dashboard → your zone (`letsuan.com`) → **Email** → **Email Service** (or Email Routing, if that's what it's still called in your dashboard)
2. Verify `info@letsuan.com` as a **sending** address (the `FROM_ADDRESS` constant in `contact-form-worker.js` — it's also the `TO_ADDRESS`, so submissions are sent from and to the same inbox).

## 3. Install Wrangler and log in (one-time, on your machine)

```bash
npm install -g wrangler
wrangler login
```

## 4. Set the Turnstile secret as a Worker secret

From inside `cloudflare-worker/`:

```bash
cd cloudflare-worker
wrangler secret put TURNSTILE_SECRET_KEY
```

Paste the Secret Key from step 1 when prompted. This keeps it out of the
codebase entirely.

## 5. Deploy the Worker

```bash
wrangler deploy
```

`wrangler.toml` already routes it to `letsuan.com/api/contact`, so the
form's `fetch('/api/contact')` call is same-origin — no CORS setup needed.

## 6. Test

Fill out the live contact form and submit. You should get an email at
info@letsuan.com within a few seconds. If it fails, check:

```bash
wrangler tail
```

while submitting, to see the Worker's live logs and error messages.

## Files

- `contact-form-worker.js` — the Worker itself
- `wrangler.toml` — Worker config (name, route, email binding)
