const logoUrl = "https://i.ibb.co/PzrQZ7m7/code-quests-logo.png";

// Lucide icons hosted on CDN — reliable for email <img> tags
const icons = {
  zap: "https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/zap.svg",
  checkCircle: "https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/circle-check.svg",
  mail: "https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/mail.svg",
  handWave: "https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/hand.svg",
  briefcase: "https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/briefcase.svg",
  mapPin: "https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/map-pin.svg",
  clock: "https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/clock.svg",
  dollarSign: "https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/dollar-sign.svg",
};

const sharedStyles = `
  <style type="text/css">
    body, table, td { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; }

    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .email-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .feature-col { display: block !important; width: 100% !important; max-width: 100% !important; padding: 0 0 20px 0 !important; }
      .feature-col:last-child { padding-bottom: 0 !important; }
      .feature-table { width: 100% !important; }
      .heading { font-size: 22px !important; }
      .body-text { font-size: 14px !important; }
      .logo { width: 130px !important; }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    .fallback-font { font-family: Arial, sans-serif; }
  </style>
  <![endif]-->
`;

function featureColumn({
  iconSrc,
  iconAlt,
  bgColor,
  title,
  description,
}: {
  iconSrc: string;
  iconAlt: string;
  bgColor: string;
  title: string;
  description: string;
}) {
  return `
    <td class="feature-col" width="33%" align="center" valign="top" style="padding:0 6px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          <td align="center" style="padding-bottom:8px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="40" height="40" align="center" valign="middle" style="background-color:${bgColor};border-radius:10px;text-align:center;">
                  <img src="${iconSrc}" alt="${iconAlt}" width="20" height="20" style="display:block;margin:0 auto;width:20px;height:20px;" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center">
            <p class="fallback-font" style="margin:0 0 4px;font-size:12px;font-weight:700;color:#0f172a;text-align:center;">${title}</p>
            <p class="fallback-font" style="margin:0;font-size:11px;color:#94a3b8;line-height:1.5;text-align:center;">${description}</p>
          </td>
        </tr>
      </table>
    </td>`;
}

function divider() {
  return `
    <tr>
      <td class="email-padding" style="padding:0 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="border-top:1px solid #f1f5f9;font-size:0;height:1px;line-height:1px;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>`;
}

export function subscriptionConfirmationEmail({
  name,
  unsubscribeUrl,
}: {
  name: string;
  unsubscribeUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>You're subscribed to Code Quests Job Alerts</title>
  ${sharedStyles}
</head>
<body style="margin:0;padding:0;background-color:#eeeeee;font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eeeeee;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" class="email-container" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">

          <!-- Logo -->
          <tr>
            <td align="center" class="email-padding" style="padding:36px 40px 24px;">
              <img src="${logoUrl}" alt="Code Quests" class="logo" width="160" style="display:block;height:auto;max-width:160px;" />
            </td>
          </tr>

          <!-- Badge -->
          <tr>
            <td align="center" class="email-padding" style="padding:0 40px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#FFF1EB;color:#F26722;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:6px 18px;border-radius:20px;text-align:center;">
                    Job Alerts
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" class="email-padding" style="padding:0 40px 10px;">
              <h1 class="heading fallback-font" style="margin:0;font-size:26px;font-weight:800;color:#0f172a;line-height:1.3;text-align:center;">
                You're in, ${name}!
              </h1>
            </td>
          </tr>

          <!-- Body text -->
          <tr>
            <td align="center" class="email-padding" style="padding:0 40px 28px;">
              <p class="body-text fallback-font" style="margin:0;font-size:15px;line-height:1.7;color:#64748b;text-align:center;">
                Thanks for subscribing to <strong style="color:#0f172a;">Code Quests Job Alerts</strong>.
                You'll be among the first to know whenever a new developer opportunity is posted.
              </p>
            </td>
          </tr>

          ${divider()}

          <!-- Features -->
          <tr>
            <td class="email-padding" style="padding:28px 40px;">
              <table role="presentation" class="feature-table" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  ${featureColumn({
                    iconSrc: icons.zap,
                    iconAlt: "Lightning bolt",
                    bgColor: "#FFF3E8",
                    title: "Instant Alerts",
                    description: "Get notified as soon as new jobs are posted",
                  })}
                  ${featureColumn({
                    iconSrc: icons.checkCircle,
                    iconAlt: "Checkmark",
                    bgColor: "#ecfdf5",
                    title: "Curated Jobs",
                    description: "Hand-picked developer opportunities",
                  })}
                  ${featureColumn({
                    iconSrc: icons.mail,
                    iconAlt: "Envelope",
                    bgColor: "#f5f3ff",
                    title: "Daily Summary",
                    description: "Receive a daily digest of new opportunities",
                  })}
                </tr>
              </table>
            </td>
          </tr>

          ${divider()}

          <!-- Footer -->
          <tr>
            <td align="center" class="email-padding" style="padding:24px 40px 32px;">
              <p class="fallback-font" style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                Don't want these emails?
                <a href="${unsubscribeUrl}" style="color:#F26722;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

export function unsubscriptionConfirmationEmail({
  name,
  resubscribeUrl,
}: {
  name: string;
  resubscribeUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>You've been unsubscribed from Code Quests</title>
  ${sharedStyles}
</head>
<body style="margin:0;padding:0;background-color:#eeeeee;font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eeeeee;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" class="email-container" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">

          <!-- Logo -->
          <tr>
            <td align="center" class="email-padding" style="padding:36px 40px 24px;">
              <img src="${logoUrl}" alt="Code Quests" class="logo" width="160" style="display:block;height:auto;max-width:160px;" />
            </td>
          </tr>

          <!-- Icon -->
          <tr>
            <td align="center" style="padding:0 40px 16px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="56" height="56" align="center" valign="middle" style="background-color:#FFF1EB;border-radius:14px;text-align:center;">
                    <img src="${icons.handWave}" alt="Wave" width="28" height="28" style="display:block;margin:0 auto;width:28px;height:28px;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" class="email-padding" style="padding:0 40px 10px;">
              <h1 class="heading fallback-font" style="margin:0;font-size:26px;font-weight:800;color:#0f172a;line-height:1.3;text-align:center;">
                You've been unsubscribed
              </h1>
            </td>
          </tr>

          <!-- Body text -->
          <tr>
            <td align="center" class="email-padding" style="padding:0 40px 28px;">
              <p class="body-text fallback-font" style="margin:0;font-size:15px;line-height:1.7;color:#64748b;text-align:center;">
                Hi ${name}, you will no longer receive job alert emails from
                <strong style="color:#0f172a;">Code Quests</strong>.
                We're sorry to see you go!
              </p>
            </td>
          </tr>

          <!-- Re-subscribe section -->
          <tr>
            <td align="center" class="email-padding" style="padding:0 40px 28px;">
              <p class="fallback-font" style="margin:0 0 16px;font-size:14px;color:#64748b;text-align:center;">
                Changed your mind? You can re-subscribe anytime.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td align="center" style="background-color:#F26722;border-radius:10px;">
                    <a href="${resubscribeUrl}" target="_blank" style="display:inline-block;background-color:#F26722;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:10px;text-align:center;">
                      Re-subscribe to Job Alerts
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${divider()}

          <!-- Footer -->
          <tr>
            <td align="center" class="email-padding" style="padding:24px 40px 32px;">
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Job Alert Email
// ---------------------------------------------------------------------------

export interface JobAlertItem {
  id: number;
  title: string;
  orgName: string;
  categoryName: string;
  salary: string | null;
  workingStatus: string | null;
  hiringType: string | null;
  registrationDeadline: string | null;
  technologies: string[];
  questUrl: string;
}

function stripEmojis(str: string): string {
  return str
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu,
      ""
    )
    .replace(/^[\s⚛]+/, "")
    .trim();
}

function formatDeadline(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function jobCard(job: JobAlertItem): string {
  const title = stripEmojis(job.title);
  const deadline = formatDeadline(job.registrationDeadline);

  const metaItems: string[] = [];
  if (job.orgName) metaItems.push(job.orgName);
  if (job.workingStatus) metaItems.push(job.workingStatus);
  if (job.hiringType) metaItems.push(job.hiringType);
  const metaLine = metaItems.join(" &middot; ");

  const techHtml =
    job.technologies.length > 0
      ? `<tr>
          <td style="padding:8px 0 0;">
            <p class="fallback-font" style="margin:0;font-size:11px;color:#94a3b8;">
              ${job.technologies.map((t) => t.trim()).join(" &middot; ")}
            </p>
          </td>
        </tr>`
      : "";

  return `
    <tr>
      <td style="padding:0 0 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #f1f5f9;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:16px 20px;">
              <!-- Category badge -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#FFF1EB;color:#F26722;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:3px 10px;border-radius:12px;">
                    ${stripEmojis(job.categoryName)}
                  </td>
                </tr>
              </table>

              <!-- Title -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:10px 0 4px;">
                    <a href="${job.questUrl}" target="_blank" class="fallback-font" style="font-size:15px;font-weight:700;color:#0f172a;text-decoration:none;">
                      ${title}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Meta line -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p class="fallback-font" style="margin:0;font-size:12px;color:#64748b;">
                      ${metaLine}
                    </p>
                  </td>
                </tr>
                ${
                  job.salary
                    ? `<tr>
                        <td style="padding:4px 0 0;">
                          <p class="fallback-font" style="margin:0;font-size:12px;color:#0f172a;font-weight:600;">
                            ${job.salary}
                          </p>
                        </td>
                      </tr>`
                    : ""
                }
                ${techHtml}
                ${
                  deadline
                    ? `<tr>
                        <td style="padding:8px 0 0;">
                          <p class="fallback-font" style="margin:0;font-size:11px;color:#F26722;">
                            Registration deadline: ${deadline}
                          </p>
                        </td>
                      </tr>`
                    : ""
                }
              </table>

              <!-- CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="padding-top:12px;">
                <tr>
                  <td align="center" style="background-color:#F26722;border-radius:8px;">
                    <a href="${job.questUrl}" target="_blank" style="display:inline-block;background-color:#F26722;color:#ffffff;font-size:12px;font-weight:700;text-decoration:none;padding:8px 20px;border-radius:8px;">
                      View Quest
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

export function jobAlertEmail({
  name,
  jobs,
  unsubscribeUrl,
}: {
  name: string;
  jobs: JobAlertItem[];
  unsubscribeUrl: string;
}): string {
  const jobCardsHtml = jobs.map((j) => jobCard(j)).join("");
  const jobCount = jobs.length;
  const subject = jobCount === 1 ? "1 new quest" : `${jobCount} new quests`;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${subject} matching your interests</title>
  ${sharedStyles}
</head>
<body style="margin:0;padding:0;background-color:#eeeeee;font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eeeeee;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" class="email-container" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;">

          <!-- Logo -->
          <tr>
            <td align="center" class="email-padding" style="padding:36px 40px 24px;">
              <img src="${logoUrl}" alt="Code Quests" class="logo" width="160" style="display:block;height:auto;max-width:160px;" />
            </td>
          </tr>

          <!-- Badge -->
          <tr>
            <td align="center" class="email-padding" style="padding:0 40px 20px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:#FFF1EB;color:#F26722;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:6px 18px;border-radius:20px;text-align:center;">
                    New Job Alerts
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center" class="email-padding" style="padding:0 40px 10px;">
              <h1 class="heading fallback-font" style="margin:0;font-size:26px;font-weight:800;color:#0f172a;line-height:1.3;text-align:center;">
                Hey ${name}, ${subject} for you!
              </h1>
            </td>
          </tr>

          <!-- Body text -->
          <tr>
            <td align="center" class="email-padding" style="padding:0 40px 28px;">
              <p class="body-text fallback-font" style="margin:0;font-size:15px;line-height:1.7;color:#64748b;text-align:center;">
                We found new opportunities matching your selected categories. Registration is open — don't miss out!
              </p>
            </td>
          </tr>

          ${divider()}

          <!-- Job Cards -->
          <tr>
            <td class="email-padding" style="padding:24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${jobCardsHtml}
              </table>
            </td>
          </tr>

          ${divider()}

          <!-- Footer -->
          <tr>
            <td align="center" class="email-padding" style="padding:24px 40px 32px;">
              <p class="fallback-font" style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                Don't want these emails?
                <a href="${unsubscribeUrl}" style="color:#F26722;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}
