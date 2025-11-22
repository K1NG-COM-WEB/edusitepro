/**
 * Registration Confirmation Email Template
 * 
 * Sent immediately after a parent submits a registration.
 * Provides next steps and important information about the approval process.
 */

interface RegistrationConfirmationData {
  parentName: string;
  parentEmail: string;
  studentName: string;
  schoolName: string;
  registrationId: string;
  registrationFee?: number;
  discountApplied?: boolean;
  originalFee?: number;
  paymentReference?: string;
}

export function generateRegistrationConfirmation(data: RegistrationConfirmationData): { subject: string; html: string; text: string } {
  const {
    parentName,
    parentEmail,
    studentName,
    schoolName,
    registrationId,
    registrationFee = 300,
    discountApplied = false,
    originalFee = 300,
    paymentReference,
  } = data;

  // Shorten payment reference to last 12 characters for display
  const shortReference = paymentReference ? paymentReference.slice(-12) : registrationId.slice(-12);

  const subject = `✅ Registration Received - Next Steps Required`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Received</title>
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
    
    <h1 style="color: #f59e0b; font-size: 24px; margin: 0 0 10px 0;">✅ Registration Received!</h1>
    
    <p style="margin: 0 0 20px 0;">Dear ${parentName},</p>
    
    <p style="margin: 0 0 20px 0;">We've successfully received your registration for <strong>${studentName}</strong> at <strong>${schoolName}</strong>.</p>
    
    <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0 0 10px 0;"><strong>⚠️ SAVE THIS REFERENCE:</strong></p>
      <p style="margin: 0; font-size: 18px; font-weight: bold; color: #dc2626; font-family: 'Courier New', monospace; letter-spacing: 1px;">${paymentReference || shortReference}</p>
      <p style="margin: 10px 0 0 0; font-size: 14px;">Use this exact reference when making payment.</p>
    </div>

    <h2 style="color: #292524; font-size: 18px; margin: 25px 0 12px 0; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">💰 Payment Details</h2>
    
    ${discountApplied 
      ? `<p style="margin: 0 0 15px 0;"><strike>R${originalFee.toFixed(2)}</strike> <span style="font-size: 22px; font-weight: bold; color: #16a34a;">R${registrationFee.toFixed(2)}</span> <span style="background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">50% OFF</span></p>`
      : `<p style="margin: 0 0 15px 0; font-size: 22px; font-weight: bold; color: #16a34a;">R${registrationFee.toFixed(2)}</p>`
    }

    <h2 style="color: #292524; font-size: 18px; margin: 25px 0 12px 0; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">🏦 Banking Details</h2>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
      <p style="margin: 8px 0;"><strong>Bank:</strong> FNB</p>
      <p style="margin: 8px 0;"><strong>Account Name:</strong> Young Eagles Home Care Centre</p>
      <p style="margin: 8px 0;"><strong>Account Number:</strong> 62777403181</p>
      <p style="margin: 8px 0;"><strong>Branch Code:</strong> 250655</p>
      <p style="margin: 8px 0;"><strong>Account Type:</strong> Business</p>
      <p style="margin: 8px 0;"><strong>Reference:</strong> <span style="font-size: 16px; font-weight: bold; color: #dc2626; font-family: 'Courier New', monospace;">${paymentReference || shortReference}</span></p>
    </div>

    <h2 style="color: #292524; font-size: 18px; margin: 25px 0 12px 0; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">📋 Payment Methods</h2>
    
    <ul style="margin: 10px 0; padding-left: 20px;">
      <li style="margin: 8px 0;"><strong>Bank Transfer (EFT):</strong> FREE ✅</li>
      <li style="margin: 8px 0;"><strong>ATM Deposit:</strong> +R20.00 fee</li>
      <li style="margin: 8px 0;"><strong>Cash:</strong> +R20.00 fee</li>
    </ul>

    <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #f59e0b;">
      <p style="margin: 0;"><strong>⚠️ IMPORTANT:</strong> Your registration cannot be approved without proof of payment. Please upload it as soon as possible!</p>
    </div>

    <h2 style="color: #292524; font-size: 18px; margin: 25px 0 12px 0; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">📤 Upload Proof of Payment</h2>
    
    <p style="margin: 0 0 15px 0;">After making payment:</p>
    
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://youngeagles.org.za'}/upload-payment?ref=${paymentReference || registrationId}" style="display: inline-block; background-color: #f59e0b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 15px 0;">
      Upload Proof of Payment
    </a>

    <h2 style="color: #292524; font-size: 18px; margin: 25px 0 12px 0; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">💰 Monthly Fee Structure</h2>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
      <p style="margin: 8px 0;"><strong>6 months - 1 year:</strong> R850.00/month</p>
      <p style="margin: 8px 0;"><strong>1 - 3 years:</strong> R720.00/month</p>
      <p style="margin: 8px 0;"><strong>4 - 6 years:</strong> R680.00/month</p>
    </div>
    
    <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">Note: Monthly fees are charged in addition to the one-time registration fee.</p>

    <h2 style="color: #292524; font-size: 18px; margin: 25px 0 12px 0; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">📞 Need Help?</h2>
    
    <p style="margin: 0 0 8px 0;"><strong>Email:</strong> admin@youngeagles.org.za</p>
    <p style="margin: 0 0 15px 0;"><strong>Phone:</strong> +27 60 482 8855 / +27 82 067 3133</p>

    <p style="margin: 25px 0 15px 0;">Thank you for choosing ${schoolName}!</p>
    
    <p style="margin: 0;">Best regards,<br>
    <strong>${schoolName} Team</strong></p>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
      <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} ${schoolName}. All rights reserved.</p>
      <p style="margin: 0;">Registration Reference: ${registrationId}</p>
    </div>
  </div>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
REGISTRATION RECEIVED - ACTION REQUIRED

Dear ${parentName},

We've successfully received your registration for ${studentName} at ${schoolName}.

Registration Reference: ${registrationId}

⚠️ IMPORTANT: PROOF OF PAYMENT REQUIRED
---------------------------------------
Your registration CANNOT be approved without proof of payment. Please upload your proof of payment as soon as possible to avoid delays.

NEXT STEPS
----------
1. Make Your Payment
   - Transfer the registration fee to the school's bank account

2. Upload Proof of Payment
   - Log in to your registration dashboard
   - Upload your bank transfer receipt

3. Wait for Verification
   - Our admin team will verify your payment (1-2 business days)

4. Receive Approval
   - Once verified, we'll send you login credentials for EduDash Pro

5. Download the App
   - Access homework, attendance, and teacher communication

MONTHLY FEE STRUCTURE
--------------------
6 months - 1 year: R850.00/month
1 - 3 years: R720.00/month
4 - 6 years: R680.00/month

Note: Monthly fees are charged in addition to the one-time registration fee.

PAYMENT INSTRUCTIONS
-------------------
Please make your payment using the following banking details:

Bank: FNB
Account Number: 62777403181
Account Name: Young Eagles Home Care Centre

⚠️ IMPORTANT: Use ${shortReference} as your payment reference!
This links your payment to your registration.

PAYMENT METHOD FEES:
- Bank Transfer (EFT): FREE ✅
- ATM Deposit: +R20.00 processing fee
- Cash Payment: +R20.00 handling fee

UPLOAD PROOF OF PAYMENT
-----------------------
After making payment, upload your proof here:
https://edusitepro.edudashpro.org.za/upload-payment?ref=${paymentReference || registrationId}

EXPECTED TIMELINE
----------------
- Payment verification: 1-2 business days after upload
- Approval & account creation: Within 24 hours of verification
- Welcome email with login details: Immediately after approval

NEED HELP?
----------
Contact: admin@youngeagles.org.za
Phone: +27 60 482 8855 / +27 82 067 3133
WhatsApp: https://wa.me/27604828855

Thank you for choosing ${schoolName}. We look forward to welcoming ${studentName}!

Best regards,
${schoolName} Admin Team

© ${new Date().getFullYear()} ${schoolName} powered by EduDash Pro
Registration Reference: ${registrationId}
  `.trim();

  return { subject, html, text };
}
