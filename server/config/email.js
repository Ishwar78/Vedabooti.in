import nodemailer from "nodemailer";

/**
 * Configure Nodemailer Transporter using environment variables
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("[Mailer Warning]: SMTP_USER or SMTP_PASS is missing in environment variables.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587 / other
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send 6-digit OTP email with high-quality Veda Booti branding
 */
export const sendOtpEmail = async ({ email, otp, purpose = "signup", name = "" }) => {
  const transporter = createTransporter();

  const isSignUp = purpose === "signup";
  const actionTitle = isSignUp ? "Sign Up & Register" : "Login & Sign In";
  const greeting = name ? `Namaste <b>${name}</b>,` : "Namaste,";

  const subject = isSignUp
    ? `${otp} is your Veda Booti Registration OTP`
    : `${otp} is your Veda Booti Login Verification Code`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #05140d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2ede6;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05140d; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #092116; border: 1px solid #1c4731; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.45);">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 30px 20px 20px; background: linear-gradient(180deg, #0f3523 0%, #092116 100%); border-bottom: 1px solid #173d2b;">
                    <h1 style="margin: 0; font-size: 26px; color: #e5c57b; letter-spacing: 2px; text-transform: uppercase; font-family: Georgia, serif;">VEDA BOOTI</h1>
                    <p style="margin: 6px 0 0; font-size: 12px; color: #94ad9f; letter-spacing: 1.5px; text-transform: uppercase;">Pure Ayurvedic Wellness</p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 35px 35px 25px;">
                    <p style="margin: 0 0 16px; font-size: 16px; color: #d6e4dc; line-height: 1.6;">${greeting}</p>
                    <p style="margin: 0 0 24px; font-size: 14px; color: #9bb2a5; line-height: 1.6;">
                      Use the One-Time Password (OTP) below to complete your <b>${actionTitle}</b> on Veda Booti.
                    </p>

                    <!-- OTP Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 25px 0;">
                      <tr>
                        <td align="center" style="background: #04120b; border: 2px dashed #d8b56a; border-radius: 12px; padding: 22px 15px;">
                          <div style="font-size: 34px; font-weight: 700; letter-spacing: 10px; color: #ffd67a; font-family: 'Courier New', Courier, monospace;">
                            ${otp}
                          </div>
                          <div style="margin-top: 8px; font-size: 11px; color: #789283; letter-spacing: 0.5px;">
                            Valid for <b>10 minutes</b>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0 0 10px; font-size: 13px; color: #e7948a; line-height: 1.5;">
                      ⚠️ <b>Security Notice:</b> Never share this OTP with anyone. Veda Booti will never call or message to ask for your verification code.
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #6a8275; line-height: 1.5;">
                      If you did not request this OTP, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 20px 30px 25px; background-color: #061910; border-top: 1px solid #143524;">
                    <p style="margin: 0 0 6px; font-size: 12px; color: #758c80;">
                      © ${new Date().getFullYear()} Veda Booti. All rights reserved.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #4e6559;">
                      Goodness from Nature · 100% Herbal & Authentic Ayurveda
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: `"Veda Booti" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });

  return info;
};

export default {
  sendOtpEmail,
};
