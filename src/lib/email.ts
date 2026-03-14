import { Resend } from "resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

/**
 * Send a transactional email via Resend.
 * In development without RESEND_API_KEY, logs to console instead.
 * Set RESEND_API_KEY + EMAIL_FROM in .env.local to enable real sending.
 *
 * Note: Resend is instantiated lazily (inside the function) so that the
 * module can be imported during build without a key being present.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`\n[Email Mock]\nTo: ${to}\nSubject: ${subject}\n${text ?? html}\n`);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const from =
    process.env.EMAIL_FROM ??
    `noreply@${new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").hostname}`;

  // Resend requires at least one of: html, text, react, or template
  await resend.emails.send({
    from,
    to,
    subject,
    ...(html ? { html } : { text: text ?? "" }),
  });
}
