import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }
  return new Resend(apiKey);
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResendClient();
  const fromEmail = process.env.COMPANY_EMAIL?.trim() || "onboarding@resend.dev";

  const { error } = await resend.emails.send({
    from: `Code Quests <${fromEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
