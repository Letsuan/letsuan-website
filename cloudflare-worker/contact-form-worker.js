const TO_ADDRESS = 'info@letsuan.com';
const FROM_ADDRESS = 'contact-form@letsuan.com'; // must be on a domain you've verified for sending

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function verifyTurnstile(token, secretKey, ip) {
  const body = new URLSearchParams();
  body.set('secret', secretKey);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = await res.json();
  return data.success === true;
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ success: false, error: 'Invalid request body' }, 400);
    }

    const { firstName, lastName, phone, email, company, question, turnstileToken } = payload;

    if (!firstName || !lastName || !email || !question) {
      return json({ success: false, error: 'Missing required fields' }, 400);
    }
    if (!turnstileToken) {
      return json({ success: false, error: 'Missing verification token' }, 400);
    }

    const ip = request.headers.get('CF-Connecting-IP');
    const verified = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
    if (!verified) {
      return json({ success: false, error: 'Verification failed' }, 400);
    }

    const subject = `New contact form submission — ${firstName} ${lastName}`;
    const text = [
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Phone: ${phone || '(not provided)'}`,
      `Company: ${company || '(not provided)'}`,
      '',
      'Question:',
      question,
    ].join('\n');

    const html = `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone || '(not provided)')}</p>
      <p><strong>Company:</strong> ${escapeHtml(company || '(not provided)')}</p>
      <p><strong>Question:</strong></p>
      <p>${escapeHtml(question).replace(/\n/g, '<br>')}</p>
    `;

    try {
      await env.EMAIL.send({
        to: TO_ADDRESS,
        from: FROM_ADDRESS,
        subject,
        text,
        html,
      });
    } catch (err) {
      return json({ success: false, error: 'Failed to send email: ' + err.message }, 500);
    }

    return json({ success: true });
  },
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
