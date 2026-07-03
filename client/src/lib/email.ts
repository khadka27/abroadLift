/* eslint-disable @typescript-eslint/no-explicit-any */
import dns from "node:dns";
import nodemailer from "nodemailer";

/**
 * Checks email validity by verifying syntax and checking DNS MX records.
 * Falls back to syntax validation in case of timeouts or general DNS resolution errors.
 */
export async function isValidEmail(email: string): Promise<{ valid: boolean; error?: string }> {
  // 1. Basic syntax check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email syntax format." };
  }

  // 2. Extract domain and check MX records
  const domain = email.split("@")[1];
  if (!domain) {
    return { valid: false, error: "Invalid email domain." };
  }

  // Allow bypass for local testing domains if any, but default to MX check
  try {
    const mxRecords = await Promise.race([
      new Promise<dns.MxRecord[]>((resolve, reject) => {
        dns.resolveMx(domain, (err, addresses) => {
          if (err) reject(err);
          else resolve(addresses);
        });
      }),
      new Promise<dns.MxRecord[]>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 3000)
      )
    ]);

    if (!mxRecords || mxRecords.length === 0) {
      return { valid: false, error: "The email domain does not have valid mail server (MX) records." };
    }
    return { valid: true };
  } catch (err: any) {
    if (err.message === "Timeout") {
      console.warn(`[EMAIL_VALIDATION] DNS MX lookup timed out for domain ${domain}. Defaulting to true.`);
      return { valid: true };
    }
    const code = err.code || "";
    if (code === "ENOTFOUND" || code === "ENODATA") {
      return { valid: false, error: `The email domain '${domain}' does not exist or cannot receive emails.` };
    }
    // For other DNS/network errors, fallback to true to prevent blocking users
    console.warn(`[EMAIL_VALIDATION] DNS MX check encountered an error for ${domain}:`, err);
    return { valid: true };
  }
}

/**
 * Sends a transactional email using Nodemailer or falls back to console logging.
 */
async function sendMail({ to, subject, html, text }: { to: string; subject: string; html: string; text?: string }) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || '"AbroadLift" <noreply@abroadlift.com>';

  if (!host || !user || !pass) {
    console.log(`
==================================================
[MAIL FALLBACK] SMTP not fully configured.
To: ${to}
Subject: ${subject}
Text: ${text || "No plain text"}
HTML:
${html}
==================================================
    `);
    return { success: true, messageId: "console-fallback-id" };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    console.log(`[MAIL] Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[MAIL_ERROR] Failed to send email via SMTP:", error);
    return { success: false, error };
  }
}

/**
 * Sends a welcome email to a newly registered and verified user.
 */
export async function sendWelcomeEmail({ to, name, username }: { to: string; name: string; username: string }) {
  const subject = "Welcome to AbroadLift!";
  const dashboardUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3001"}/dashboard`;
  const year = new Date().getFullYear();

  const html = `
<div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
  <div style="text-align: center; margin-bottom: 24px;">
    <h2 style="color: #3686FF; margin: 0; font-size: 26px; font-weight: 800; tracking-tight: -0.025em;">Welcome to AbroadLift!</h2>
    <p style="color: #64748b; font-size: 14px; margin-top: 4px; font-weight: 500;">Your journey to study abroad starts here.</p>
  </div>
  <div style="color: #334155; line-height: 1.6; font-size: 15px;">
    <p>Hi <strong>${name}</strong>,</p>
    <p>Thank you for registering on AbroadLift. We are thrilled to welcome you to our community!</p>
    <p>AbroadLift is designed to help you navigate your global study options, estimate costs, verify visa readiness, and search for admissions matches easily.</p>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #475569; font-size: 14px;">YOUR USERNAME FOR LOGGING IN:</p>
      <span style="display: inline-block; background-color: #3686FF; color: white; padding: 10px 24px; border-radius: 12px; font-weight: bold; font-size: 16px; letter-spacing: 0.05em;">${username}</span>
    </div>
    <p>Log in to your student dashboard to start matching with universities and tracking your applications.</p>
    <div style="text-align: center; margin-top: 32px; margin-bottom: 12px;">
      <a href="${dashboardUrl}" style="background-color: #3686FF; color: white; padding: 14px 32px; border-radius: 16px; font-weight: 800; text-decoration: none; display: inline-block; box-shadow: 0 10px 15px -3px rgba(54, 134, 255, 0.3);">Go to Dashboard</a>
    </div>
  </div>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">
  <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0; font-weight: 500; line-height: 1.5;">
    © ${year} AbroadLift. All rights reserved.<br>
    Pokhara / Kathmandu, Nepal
  </p>
</div>
  `;

  return sendMail({
    to,
    subject,
    html,
    text: `Hi ${name}, welcome to AbroadLift! Thank you for registering. Your username is: ${username}. Visit your dashboard at: ${dashboardUrl}`,
  });
}

/**
 * Sends a welcome back email (security notice) when a user logs in.
 */
export async function sendWelcomeBackEmail({ to, name, role, userId }: { to: string; name: string; role: string; userId: string }) {
  const subject = "AbroadLift Login Security Alert";
  const dashboardUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3001"}/dashboard`;
  const time = new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" }) + " (Nepal Time)";
  const year = new Date().getFullYear();

  const html = `
<div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
  <div style="text-align: center; margin-bottom: 24px;">
    <h2 style="color: #3686FF; margin: 0; font-size: 24px; font-weight: 800;">Welcome Back to AbroadLift!</h2>
    <p style="color: #64748b; font-size: 14px; margin-top: 4px; font-weight: 500;">Security Login Alert</p>
  </div>
  <div style="color: #334155; line-height: 1.6; font-size: 15px;">
    <p>Hi <strong>${name}</strong>,</p>
    <p>We detected a new login to your AbroadLift account. Here are the login details:</p>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #475569;">
        <tr>
          <td style="padding: 6px 0; font-weight: 700; width: 100px;">Time:</td>
          <td style="padding: 6px 0;">${time}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 700;">Account Role:</td>
          <td style="padding: 6px 0; text-transform: uppercase; font-weight: 700; font-size: 12px; color: #3686FF;">${role}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 700;">User ID:</td>
          <td style="padding: 6px 0; font-family: monospace; font-size: 12px;">${userId}</td>
        </tr>
      </table>
    </div>
    <p>If this login was you, there is no action required. If you did not log in, please contact our support team immediately.</p>
    <div style="text-align: center; margin-top: 32px; margin-bottom: 12px;">
      <a href="${dashboardUrl}" style="background-color: #3686FF; color: white; padding: 14px 32px; border-radius: 16px; font-weight: 800; text-decoration: none; display: inline-block; box-shadow: 0 10px 15px -3px rgba(54, 134, 255, 0.3);">Go to Dashboard</a>
    </div>
  </div>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">
  <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0; font-weight: 500;">
    © ${year} AbroadLift. All rights reserved.<br>
    This is a security notification regarding your AbroadLift account.
  </p>
</div>
  `;

  return sendMail({
    to,
    subject,
    html,
    text: `Hi ${name}, welcome back to AbroadLift! We detected a new login to your account at ${time}. If this wasn't you, contact support.`,
  });
}

/**
 * Sends a notification email to a student when their university application status is updated.
 */
export async function sendApplicationStatusEmail({
  to,
  studentName,
  universityName,
  country,
  status,
  reviewerComments,
}: {
  to: string;
  studentName: string;
  universityName: string;
  country: string;
  status: string;
  reviewerComments?: string | null;
}) {
  const subject = `AbroadLift - Application Update: ${universityName}`;
  const dashboardUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3001"}/dashboard`;
  const year = new Date().getFullYear();

  // Status-specific color formatting
  let statusColor = "#f1f5f9";
  let statusTextColor = "#475569";

  if (status === "ACCEPTED") {
    statusColor = "#dcfce7";
    statusTextColor = "#166534";
  } else if (status === "REJECTED") {
    statusColor = "#fee2e2";
    statusTextColor = "#991b1b";
  } else if (status === "APPLIED") {
    statusColor = "#dbeafe";
    statusTextColor = "#1e40af";
  }

  const html = `
<div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
  <div style="text-align: center; margin-bottom: 24px;">
    <h2 style="color: #3686FF; margin: 0; font-size: 24px; font-weight: 800;">Application Status Update</h2>
    <p style="color: #64748b; font-size: 14px; margin-top: 4px; font-weight: 500;">An update has been made to your university application</p>
  </div>
  <div style="color: #334155; line-height: 1.6; font-size: 15px;">
    <p>Hi <strong>${studentName}</strong>,</p>
    <p>Your application status for <strong>${universityName}</strong> (${country}) has been updated.</p>
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #475569;">
        <tr>
          <td style="padding: 6px 0; font-weight: 700; width: 120px;">New Status:</td>
          <td style="padding: 6px 0;">
            <span style="background-color: ${statusColor}; color: ${statusTextColor}; padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.02em;">${status}</span>
          </td>
        </tr>
        ${reviewerComments ? `
        <tr>
          <td style="padding: 12px 0 6px 0; font-weight: 700; vertical-align: top;">Advisor Comments:</td>
          <td style="padding: 12px 0 6px 0; color: #1e293b; line-height: 1.5; white-space: pre-wrap;">${reviewerComments}</td>
        </tr>
        ` : ""}
      </table>
    </div>
    <p>Please log in to your student dashboard to review details, view requirements, or complete any necessary follow-up tasks.</p>
    <div style="text-align: center; margin-top: 32px; margin-bottom: 12px;">
      <a href="${dashboardUrl}" style="background-color: #3686FF; color: white; padding: 14px 32px; border-radius: 16px; font-weight: 800; text-decoration: none; display: inline-block; box-shadow: 0 10px 15px -3px rgba(54, 134, 255, 0.3);">View Application</a>
    </div>
  </div>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">
  <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0; font-weight: 500;">
    © ${year} AbroadLift. All rights reserved.<br>
    If you have any questions, please reach out directly to your assigned advisor.
  </p>
</div>
  `;

  return sendMail({
    to,
    subject,
    html,
    text: `Hi ${studentName}, your application for ${universityName} has been updated to ${status}. Log in to your dashboard to read comments: ${dashboardUrl}`,
  });
}

/**
 * Sends a notification email to a student when an advisor leaves a new note on their profile.
 */
export async function sendAdvisorNoteEmail({
  to,
  studentName,
  noteContent,
}: {
  to: string;
  studentName: string;
  noteContent: string;
}) {
  const subject = "AbroadLift - New Advisor Note Added";
  const dashboardUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3001"}/dashboard`;
  const year = new Date().getFullYear();

  const html = `
<div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 24px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);">
  <div style="text-align: center; margin-bottom: 24px;">
    <h2 style="color: #3686FF; margin: 0; font-size: 24px; font-weight: 800;">New Advisor Note Added</h2>
    <p style="color: #64748b; font-size: 14px; margin-top: 4px; font-weight: 500;">Your advisor has left feedback on your profile</p>
  </div>
  <div style="color: #334155; line-height: 1.6; font-size: 15px;">
    <p>Hi <strong>${studentName}</strong>,</p>
    <p>An advisor has added a new note or recommendation to your AbroadLift student profile:</p>
    <div style="background-color: #f8fafc; border-left: 4px solid #3686FF; border-radius: 4px 12px 12px 4px; padding: 16px 20px; margin: 24px 0; font-style: italic; color: #1e293b; white-space: pre-wrap; font-size: 14px; line-height: 1.5; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">${noteContent}</div>
    <p>Please review this guidance and adjust your academic information or shortlist as needed.</p>
    <div style="text-align: center; margin-top: 32px; margin-bottom: 12px;">
      <a href="${dashboardUrl}" style="background-color: #3686FF; color: white; padding: 14px 32px; border-radius: 16px; font-weight: 800; text-decoration: none; display: inline-block; box-shadow: 0 10px 15px -3px rgba(54, 134, 255, 0.3);">View Profile</a>
    </div>
  </div>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">
  <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0; font-weight: 500;">
    © ${year} AbroadLift. All rights reserved.<br>
    You are receiving this automated message because an advisor edited your student file.
  </p>
</div>
  `;

  return sendMail({
    to,
    subject,
    html,
    text: `Hi ${studentName}, your advisor added a new note to your profile: "${noteContent}". Log in to your dashboard to review it: ${dashboardUrl}`,
  });
}
