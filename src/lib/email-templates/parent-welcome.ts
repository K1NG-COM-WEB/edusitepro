/**
 * Welcome Email Template for New Parents
 * 
 * Sent when a registration is approved and parent account is created.
 * Includes login credentials and app download links.
 */

interface WelcomeEmailData {
  parentName: string;
  parentEmail: string;
  tempPassword: string;
  studentName: string;
  studentId: string;
  schoolName: string;
  androidAppUrl: string;
  iosAppUrl?: string;
}

export function generateParentWelcomeEmail(data: WelcomeEmailData): { subject: string; html: string; text: string } {
  const {
    parentName,
    parentEmail,
    tempPassword,
    studentName,
    studentId,
    schoolName,
    androidAppUrl,
    iosAppUrl,
  } = data;

  const subject = `🎉 Welcome to EduDash Pro - Your Account is Ready!`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to EduDash Pro</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Welcome to EduDash Pro!</h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">Your registration has been approved</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Dear ${parentName},
              </p>

              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Great news! Your registration for <strong>${studentName}</strong> at <strong>${schoolName}</strong> has been approved. 🎉
              </p>

              <!-- Credentials Box -->
              <table role="presentation" style="width: 100%; background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0; border-left: 4px solid #667eea;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 15px; color: #333333; font-size: 18px; font-weight: 600;">Your Login Credentials</h2>
                    
                    <p style="margin: 0 0 10px; color: #555555; font-size: 14px;">
                      <strong>Email:</strong><br>
                      <span style="color: #667eea; font-size: 16px;">${parentEmail}</span>
                    </p>
                    
                    <p style="margin: 15px 0 10px; color: #555555; font-size: 14px;">
                      <strong>Temporary Password:</strong><br>
                      <span style="color: #667eea; font-size: 16px; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 8px 12px; border-radius: 4px; display: inline-block;">${tempPassword}</span>
                    </p>

                    <p style="margin: 15px 0 10px; color: #555555; font-size: 14px;">
                      <strong>Student ID:</strong><br>
                      <span style="color: #667eea; font-size: 16px; font-family: 'Courier New', monospace;">${studentId}</span>
                    </p>

                    <p style="margin: 20px 0 0; color: #dc3545; font-size: 13px; font-style: italic;">
                      ⚠️ Please change your password after your first login for security.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Trial Info -->
              <table role="presentation" style="width: 100%; background-color: #e8f5e9; border-radius: 8px; padding: 20px; margin: 30px 0; border-left: 4px solid #4caf50;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 10px; color: #2e7d32; font-size: 16px; font-weight: 600;">🎁 7-Day Free Trial Activated</h3>
                    <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
                      Enjoy full access to all EduDash Pro features for the next 7 days. Explore homework tracking, attendance monitoring, communication tools, and more!
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Getting Started -->
              <h2 style="margin: 30px 0 20px; color: #333333; font-size: 20px; font-weight: 600;">Getting Started</h2>
              
              <ol style="margin: 0 0 30px; padding-left: 20px; color: #555555; font-size: 15px; line-height: 1.8;">
                <li style="margin-bottom: 12px;">Click "Open EduDash Pro App" button below</li>
                <li style="margin-bottom: 12px;">Tap "Sign In" in the app</li>
                <li style="margin-bottom: 12px;">Enter your email and temporary password</li>
                <li style="margin-bottom: 12px;">Set a new secure password</li>
                <li style="margin-bottom: 12px;">For easy access, install the app to your home screen</li>
                <li style="margin-bottom: 12px;">Start tracking your child's progress!</li>
              </ol>

              <!-- Download Buttons -->
              <table role="presentation" style="width: 100%; margin: 30px 0;">
                <tr>
                  <td align="center">
                    <h3 style="margin: 0 0 20px; color: #333333; font-size: 18px; font-weight: 600;">Access the Parent App</h3>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <!-- PWA Button -->
                    <a href="${androidAppUrl}" style="display: inline-block; margin: 0 10px 15px; padding: 15px 30px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                      🌐 Open EduDash Pro App
                    </a>
                    <br>
                    <p style="margin: 10px 0 0; color: #666666; font-size: 13px;">
                      Works on all devices - Install to your home screen for the best experience!
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Support -->
              <table role="presentation" style="width: 100%; background-color: #fff3cd; border-radius: 8px; padding: 20px; margin: 30px 0; border-left: 4px solid #ffc107;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 10px; color: #856404; font-size: 16px; font-weight: 600;">Need Help?</h3>
                    <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
                      If you have any questions or need assistance, please contact your school directly or reach out to our support team at <a href="mailto:support@edudashpro.org.za" style="color: #667eea; text-decoration: none;">support@edudashpro.org.za</a>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Closing -->
              <p style="margin: 30px 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                We're excited to have you and ${studentName} as part of the EduDash Pro family!
              </p>

              <p style="margin: 20px 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong>The EduDash Pro Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px; color: #6c757d; font-size: 13px;">
                © ${new Date().getFullYear()} EduDash Pro. All rights reserved.
              </p>
              <p style="margin: 0; color: #6c757d; font-size: 12px;">
                You received this email because your registration was approved at ${schoolName}.
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

  const text = `
Welcome to EduDash Pro!

Dear ${parentName},

Great news! Your registration for ${studentName} at ${schoolName} has been approved.

YOUR LOGIN CREDENTIALS
----------------------
Email: ${parentEmail}
Temporary Password: ${tempPassword}
Student ID: ${studentId}

⚠️ Please change your password after your first login for security.

7-DAY FREE TRIAL ACTIVATED
---------------------------
Enjoy full access to all EduDash Pro features for the next 7 days!

GETTING STARTED
--------------
1. Open the EduDash Pro app: ${androidAppUrl}
2. Tap "Sign In"
3. Enter your email and temporary password
4. Set a new secure password
5. Install the app to your home screen for easy access
6. Start tracking your child's progress!

ACCESS THE APP
--------------
Open on any device: ${androidAppUrl}
Works on phones, tablets, and computers!

NEED HELP?
---------
If you have any questions or need assistance, please contact your school directly or reach out to our support team at support@edudashpro.org.za

We're excited to have you and ${studentName} as part of the EduDash Pro family!

Best regards,
The EduDash Pro Team

© ${new Date().getFullYear()} EduDash Pro. All rights reserved.
You received this email because your registration was approved at ${schoolName}.
  `.trim();

  return { subject, html, text };
}
