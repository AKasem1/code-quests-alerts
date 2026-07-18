import nodemailer from "nodemailer";

function createTransport() {
  const user = process.env.COMPANY_EMAIL?.trim();
  const pass = process.env.COMPANY_EMAIL_PASSWORD?.trim();

  if (!user || !pass) {
    throw new Error("COMPANY_EMAIL or COMPANY_EMAIL_PASSWORD environment variable is not set");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = createTransport();
  await transporter.sendMail({
    from: `"Code Quests" <${process.env.COMPANY_EMAIL?.trim()}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
