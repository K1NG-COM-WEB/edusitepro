import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/registrations/send-confirmation
 * 
 * Sends a confirmation email to parents after registration submission
 */
export async function POST(request: NextRequest) {
  try {
    const {
      parentEmail,
      parentName,
      studentName,
      schoolName,
      registrationFee,
      discountApplied,
      discountAmount,
      registrationId,
      paymentReference,
    } = await request.json();

    if (!parentEmail || !parentName || !studentName || !registrationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique payment reference if not provided
    const reference = paymentReference || `REG${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const finalAmount = registrationFee || 300;

    // POP upload URL
    const popUploadUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/upload-payment?ref=${reference}`;

    // Generate confirmation email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                🎉 Registration Received!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Dear ${parentName},
              </p>
              
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                Thank you for registering <strong>${studentName}</strong> at <strong>${schoolName}</strong> for the 2026 academic year!
              </p>

              <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                We have received your registration application and it is currently being reviewed by our admissions team.
              </p>

              <!-- Registration Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 15px; color: #667eea; font-size: 18px;">
                      📋 Registration Summary
                    </h3>
                    <table width="100%" cellpadding="5" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 5px 0;"><strong>Student Name:</strong></td>
                        <td style="color: #333333; font-size: 14px; padding: 5px 0; text-align: right;">${studentName}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 5px 0;"><strong>School:</strong></td>
                        <td style="color: #333333; font-size: 14px; padding: 5px 0; text-align: right;">${schoolName}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 5px 0;"><strong>Academic Year:</strong></td>
                        <td style="color: #333333; font-size: 14px; padding: 5px 0; text-align: right;">2026</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 5px 0;"><strong>Registration Fee:</strong></td>
                        <td style="color: #333333; font-size: 14px; padding: 5px 0; text-align: right;">
                          ${discountApplied ? `<span style="text-decoration: line-through; color: #999;">R300.00</span> <span style="color: #28a745; font-weight: bold;">R${registrationFee.toFixed(2)}</span>` : `R${registrationFee.toFixed(2)}`}
                        </td>
                      </tr>
                      ${discountApplied ? `
                      <tr>
                        <td colspan="2" style="padding: 10px 0 5px; border-top: 1px solid #e0e0e0;">
                          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; padding: 10px; text-align: center;">
                            <span style="color: #155724; font-size: 14px;">
                              🎉 You saved R${(300 - registrationFee).toFixed(2)} with your discount code!
                            </span>
                          </div>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- PAYMENT REQUIRED -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); border-radius: 8px; padding: 25px; margin: 30px 0;">
                <tr>
                  <td style="text-align: center;">
                    <h3 style="margin: 0 0 10px; color: #ffffff; font-size: 20px; font-weight: bold;">
                      ⚠️ PAYMENT REQUIRED TO PROCEED
                    </h3>
                    <p style="margin: 0; color: #ffffff; font-size: 14px;">
                      Please complete payment and upload proof to process your application
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Banking Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff9e6; border: 2px solid #ffc107; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 15px; color: #f57c00; font-size: 18px; text-align: center;">
                      🏦 Banking Details for Payment
                    </h3>
                    <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #ffffff; border-radius: 6px; padding: 10px;">
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold; padding: 8px;">Bank Name:</td>
                        <td style="color: #333333; font-size: 14px; padding: 8px; text-align: right;">Capitec Bank</td>
                      </tr>
                      <tr style="background-color: #f8f9fa;">
                        <td style="color: #666666; font-size: 14px; font-weight: bold; padding: 8px;">Account Name:</td>
                        <td style="color: #333333; font-size: 14px; padding: 8px; text-align: right;">Young Eagles Preschool</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold; padding: 8px;">Account Number:</td>
                        <td style="color: #333333; font-size: 16px; font-weight: bold; padding: 8px; text-align: right; font-family: 'Courier New', monospace;">1441072267</td>
                      </tr>
                      <tr style="background-color: #f8f9fa;">
                        <td style="color: #666666; font-size: 14px; font-weight: bold; padding: 8px;">Branch Code:</td>
                        <td style="color: #333333; font-size: 14px; font-family: 'Courier New', monospace; padding: 8px; text-align: right;">470010</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold; padding: 8px;">Account Type:</td>
                        <td style="color: #333333; font-size: 14px; padding: 8px; text-align: right;">Savings</td>
                      </tr>
                      <tr style="background-color: #fff3cd; border-top: 2px solid #ffc107;">
                        <td style="color: #856404; font-size: 15px; font-weight: bold; padding: 12px;">Payment Reference:</td>
                        <td style="color: #856404; font-size: 18px; font-weight: bold; padding: 12px; text-align: right; font-family: 'Courier New', monospace; letter-spacing: 1px;">
                          ${reference}
                        </td>
                      </tr>
                      <tr style="background-color: #d4edda; border-top: 2px solid #28a745;">
                        <td style="color: #155724; font-size: 16px; font-weight: bold; padding: 12px;">Amount to Pay:</td>
                        <td style="color: #155724; font-size: 22px; font-weight: bold; padding: 12px; text-align: right;">
                          R${finalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </table>
                    <div style="margin-top: 15px; padding: 12px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                      <p style="margin: 0; color: #856404; font-size: 13px; line-height: 1.5;">
                        <strong>⚠️ IMPORTANT:</strong> Please use the reference number <strong>${reference}</strong> when making your payment. This helps us match your payment to your application automatically.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <div style="margin: 30px 0;">
                <h3 style="margin: 0 0 15px; color: #667eea; font-size: 18px;">
                  📌 Next Steps - PLEASE FOLLOW IN ORDER
                </h3>
                <ol style="margin: 0; padding-left: 20px; color: #333333; font-size: 15px; line-height: 1.8;">
                  <li style="margin-bottom: 15px;">
                    <strong>Make Payment:</strong> Transfer R${finalAmount.toFixed(2)} to the bank account above using reference <code style="background-color: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace;">${reference}</code>
                  </li>
                  <li style="margin-bottom: 15px;">
                    <strong>Upload Proof of Payment:</strong> Click the button below to upload your bank deposit slip or payment confirmation
                    <div style="margin-top: 15px; text-align: center;">
                      <a href="${popUploadUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 15px 40px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                        📤 Upload Proof of Payment
                      </a>
                    </div>
                    <p style="margin: 10px 0 0; font-size: 13px; color: #666666;">
                      Or copy this link: <a href="${popUploadUrl}" style="color: #667eea; word-break: break-all;">${popUploadUrl}</a>
                    </p>
                  </li>
                  <li style="margin-bottom: 15px;">
                    <strong>Admin Review:</strong> Once we receive your proof of payment, our team will verify and approve your registration within 1-2 business days.
                  </li>
                  <li style="margin-bottom: 15px;">
                    <strong>Welcome Pack:</strong> After payment verification and approval, you'll receive:
                    <ul style="margin: 10px 0; padding-left: 20px;">
                      <li>Parent portal login credentials</li>
                      <li>EduDash Pro mobile app access (Android & iOS)</li>
                      <li>School orientation schedule</li>
                      <li>Required documents checklist</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <!-- Contact Information -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 8px; padding: 20px; margin-top: 30px;">
                <tr>
                  <td>
                    <h4 style="margin: 0 0 10px; color: #667eea; font-size: 16px;">
                      📞 Contact Information
                    </h4>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Phone:</strong> <a href="tel:+27815236000" style="color: #667eea; text-decoration: none;">081 523 6000</a>
                    </p>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Email:</strong> <a href="mailto:info@youngeagles.org.za" style="color: #667eea; text-decoration: none;">info@youngeagles.org.za</a>
                    </p>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Address:</strong> 7118 Section U Shabangu Street, Mamelodi Pretoria 0122
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                We're excited to welcome ${studentName} to our ${schoolName} family!
              </p>
              
              <p style="margin: 15px 0 0; color: #666666; font-size: 14px;">
                Warm regards,<br>
                <strong>${schoolName} Admissions Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                This is an automated confirmation email. Please do not reply to this email.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} ${schoolName}. All rights reserved.
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

    // Call send-email Edge Function
    const emailResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          to: parentEmail,
          subject: `Registration Confirmation - ${studentName} at ${schoolName}`,
          body: emailHtml,
          is_html: true,
          confirmed: true,
        }),
      }
    );

    if (!emailResponse.ok) {
      const emailError = await emailResponse.json();
      console.error('Failed to send confirmation email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    console.log('Confirmation email sent successfully to:', parentEmail);

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully',
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
