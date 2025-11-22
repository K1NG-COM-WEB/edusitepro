# Yoco Payment Integration Guide for EduSitePro
## Complete Implementation Plan for Young Eagles Preschool

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Business Setup](#business-setup)
3. [Technical Implementation](#technical-implementation)
4. [Registration Payment Flow](#registration-payment-flow)
5. [Monthly Subscription Setup](#monthly-subscription-setup)
6. [Webhook Integration](#webhook-integration)
7. [Testing & Go-Live](#testing--go-live)
8. [Cost Analysis](#cost-analysis)
9. [Alternative Solutions](#alternative-solutions)

---

## 🎯 Overview

### Why Yoco?
- **South African-focused**: Designed for SA businesses, trusted by parents
- **No monthly fees**: Only pay per transaction (2.95%)
- **Multiple payment methods**: Cards, EFT, SnapScan, QR codes
- **Easy integration**: REST API with comprehensive docs
- **Recurring billing**: Built-in subscription management
- **Parent-friendly**: Simple payment links via email/WhatsApp

### Use Cases for Young Eagles
1. **Registration Fee**: R150-300 one-time payment
2. **Monthly Fees**: R680-850 recurring monthly charges
3. **Additional Fees**: Ad-hoc charges (events, materials, etc.)

---

## 🏢 Business Setup

### Step 1: Create Yoco Business Account
1. Visit https://www.yoco.com/za/sign-up/
2. Select "Online payments" option
3. Fill in business details:
   - Business Name: **Young Eagles Home Care Centre**
   - Business Type: **Educational Services**
   - Bank Account: **FNB 62777403181**
   - Registration Number: [Your CIPC number]
   - Contact: admin@youngeagles.org.za

### Step 2: Verification (2-3 business days)
Required documents:
- ✅ CIPC Registration Certificate
- ✅ Bank Statement (showing FNB account)
- ✅ ID of authorized signatory
- ✅ Proof of address (< 3 months old)

### Step 3: Get API Credentials
Once approved:
1. Log in to Yoco Portal: https://portal.yoco.com/
2. Go to **Settings → Developer Tools**
3. Copy your credentials:
   ```
   Live Secret Key: sk_live_xxxxxxxxxxxxx
   Live Public Key: pk_live_xxxxxxxxxxxxx
   Test Secret Key: sk_test_xxxxxxxxxxxxx
   Test Public Key: pk_test_xxxxxxxxxxxxx
   ```

---

## 💻 Technical Implementation

### Phase 1: Environment Setup

**1. Install Yoco SDK**
```bash
cd /home/king/Desktop/edusitepro
npm install @yoco/node-sdk
```

**2. Add Environment Variables**
Add to `.env.local`:
```env
# Yoco API Keys
YOCO_SECRET_KEY=sk_test_your_test_key_here
YOCO_PUBLIC_KEY=pk_test_your_test_key_here
NEXT_PUBLIC_YOCO_PUBLIC_KEY=pk_test_your_test_key_here

# Webhook Secret (get from Yoco Portal)
YOCO_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Base URLs
NEXT_PUBLIC_APP_URL=https://register.youngeagles.org.za
YOCO_WEBHOOK_URL=https://register.youngeagles.org.za/api/webhooks/yoco
```

**3. Create Yoco Client Utility**
Create `/src/lib/yoco/client.ts`:
```typescript
import { Yoco } from '@yoco/node-sdk';

// Initialize Yoco client
const yoco = new Yoco(process.env.YOCO_SECRET_KEY!);

export interface PaymentLinkOptions {
  amount: number; // Amount in cents (e.g., 15000 = R150)
  currency: 'ZAR';
  reference: string; // Unique reference (e.g., REG-2025-001234)
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  description: string;
  metadata?: Record<string, any>;
  successUrl?: string;
  cancelUrl?: string;
  failureUrl?: string;
}

/**
 * Create a payment link for one-time payments (registration fees)
 */
export async function createPaymentLink(options: PaymentLinkOptions) {
  try {
    const paymentLink = await yoco.paymentLinks.create({
      amount: options.amount,
      currency: options.currency,
      reference: options.reference,
      customer: {
        name: options.customer.name,
        email: options.customer.email,
        phone: options.customer.phone,
      },
      description: options.description,
      metadata: {
        registrationId: options.reference,
        studentName: options.metadata?.studentName,
        ageGroup: options.metadata?.ageGroup,
        ...options.metadata,
      },
      redirectUrls: {
        success: options.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/registration/payment/success`,
        cancel: options.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/registration/payment/cancelled`,
        failure: options.failureUrl || `${process.env.NEXT_PUBLIC_APP_URL}/registration/payment/failed`,
      },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });

    return {
      success: true,
      paymentUrl: paymentLink.url,
      paymentId: paymentLink.id,
      expiresAt: paymentLink.expiresAt,
    };
  } catch (error) {
    console.error('Yoco payment link creation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create a subscription for recurring monthly fees
 */
export async function createSubscription(options: {
  customerId: string;
  planId: string; // Created in Yoco Portal
  reference: string;
  metadata?: Record<string, any>;
}) {
  try {
    const subscription = await yoco.subscriptions.create({
      customerId: options.customerId,
      planId: options.planId,
      reference: options.reference,
      metadata: options.metadata,
    });

    return {
      success: true,
      subscriptionId: subscription.id,
      status: subscription.status,
      nextBillingDate: subscription.nextBillingDate,
    };
  } catch (error) {
    console.error('Yoco subscription creation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify webhook signature for security
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export { yoco };
```

---

## 💳 Registration Payment Flow

### Step 1: Update Registration API
Modify `/src/app/api/registrations/route.ts`:

```typescript
import { createPaymentLink } from '@/lib/yoco/client';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // ... existing validation ...

    // Insert registration
    const { data, error } = await supabase
      .from('registration_requests')
      .insert([insertPayload])
      .select()
      .single();

    if (error) throw error;

    // Create Yoco payment link
    const paymentResult = await createPaymentLink({
      amount: 15000, // R150 in cents (or calculate based on discount)
      currency: 'ZAR',
      reference: data.payment_reference,
      customer: {
        name: payload.guardian_name,
        email: payload.guardian_email,
        phone: payload.guardian_phone,
      },
      description: `Registration Fee - ${payload.student_first_name} ${payload.student_last_name}`,
      metadata: {
        registrationId: data.id,
        studentName: `${payload.student_first_name} ${payload.student_last_name}`,
        organizationId: payload.organization_id,
      },
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/registration/success?ref=${data.payment_reference}`,
    });

    if (!paymentResult.success) {
      console.error('Failed to create payment link:', paymentResult.error);
      // Continue anyway - manual payment still works
    }

    // Update registration with payment URL
    if (paymentResult.success) {
      await supabase
        .from('registration_requests')
        .update({ payment_url: paymentResult.paymentUrl })
        .eq('id', data.id);
    }

    // Send confirmation email (existing code)
    const emailContent = generateRegistrationConfirmation({
      parentName: payload.guardian_name,
      parentEmail: payload.guardian_email,
      studentName: `${payload.student_first_name} ${payload.student_last_name}`,
      schoolName: schoolName,
      registrationId: data.payment_reference,
      paymentUrl: paymentResult.paymentUrl, // Add this field
    });

    // ... rest of existing code ...

    return NextResponse.json({ 
      success: true, 
      registration: data,
      paymentUrl: paymentResult.paymentUrl, // Return to frontend
    }, { status: 200 });
  } catch (err) {
    // ... error handling ...
  }
}
```

### Step 2: Add Payment URL to Database
Create migration:
```sql
-- Add payment_url column to registration_requests
ALTER TABLE registration_requests
ADD COLUMN IF NOT EXISTS payment_url TEXT;

COMMENT ON COLUMN registration_requests.payment_url 
IS 'Yoco payment link URL for easy online payment';
```

### Step 3: Update Email Template
Modify `/src/lib/email-templates/registration-confirmation.ts`:

```typescript
export interface RegistrationConfirmationData {
  parentName: string;
  parentEmail: string;
  studentName: string;
  schoolName: string;
  registrationId: string;
  paymentUrl?: string; // Add this
}

// In HTML template, add payment button after banking details:
```html
<!-- Quick Pay Button (if payment URL available) -->
${data.paymentUrl ? `
<table role="presentation" style="width: 100%; margin: 30px 0;">
  <tr>
    <td align="center">
      <a href="${data.paymentUrl}" 
         style="display: inline-block; background-color: #2e7d32; color: white; padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        💳 Pay Now with Card/EFT
      </a>
      <p style="margin: 12px 0 0; color: #555555; font-size: 13px;">
        Fast, secure payment via Yoco (no registration required)
      </p>
    </td>
  </tr>
</table>

<div style="text-align: center; margin: 20px 0;">
  <p style="color: #666; font-size: 14px; font-weight: 600;">— OR —</p>
</div>
` : ''}

<!-- Banking Details (existing code) -->
```

---

## 📅 Monthly Subscription Setup

### Step 1: Create Subscription Plans in Yoco Portal
1. Log in to https://portal.yoco.com/
2. Go to **Subscriptions → Plans**
3. Create 3 plans:

**Plan 1: Baby Plan (6mo-1yr)**
- Name: "Baby Plan"
- Amount: R850.00
- Billing Frequency: Monthly
- Plan ID: `plan_baby_6mo_1yr`

**Plan 2: Toddler Plan (1-3yrs)**
- Name: "Toddler Plan"
- Amount: R720.00
- Billing Frequency: Monthly
- Plan ID: `plan_toddler_1_3yrs`

**Plan 3: Preschool Plan (4-6yrs)**
- Name: "Preschool Plan"
- Amount: R680.00
- Billing Frequency: Monthly
- Plan ID: `plan_preschool_4_6yrs`

### Step 2: Create Subscription API
Create `/src/app/api/subscriptions/create/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { yoco } from '@/lib/yoco/client';

export async function POST(request: NextRequest) {
  try {
    const { studentId, parentEmail, ageGroup } = await request.json();
    
    const supabase = createClient();
    
    // Get student details
    const { data: student } = await supabase
      .from('students')
      .select('*, parent:parent_id(*)')
      .eq('id', studentId)
      .single();

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Determine plan based on age
    const age = calculateAge(student.date_of_birth);
    let planId: string;
    
    if (age >= 0.5 && age < 1) {
      planId = 'plan_baby_6mo_1yr';
    } else if (age >= 1 && age < 4) {
      planId = 'plan_toddler_1_3yrs';
    } else {
      planId = 'plan_preschool_4_6yrs';
    }

    // Create or get Yoco customer
    let yocoCustomer = await yoco.customers.list({
      email: parentEmail,
    });

    if (yocoCustomer.data.length === 0) {
      yocoCustomer = await yoco.customers.create({
        name: student.parent.full_name,
        email: parentEmail,
        phone: student.parent.phone_number,
      });
    }

    // Create subscription
    const subscription = await yoco.subscriptions.create({
      customerId: yocoCustomer.data[0].id,
      planId: planId,
      reference: `SUB-${student.id}`,
      metadata: {
        studentId: student.id,
        studentName: `${student.first_name} ${student.last_name}`,
        ageGroup: ageGroup,
      },
    });

    // Save subscription to database
    await supabase.from('subscriptions').insert({
      student_id: studentId,
      yoco_subscription_id: subscription.id,
      yoco_customer_id: yocoCustomer.data[0].id,
      plan_id: planId,
      amount: subscription.amount,
      status: subscription.status,
      next_billing_date: subscription.nextBillingDate,
    });

    return NextResponse.json({ 
      success: true, 
      subscriptionId: subscription.id,
      setupUrl: subscription.setupUrl, // Parent completes card details here
    });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create subscription' 
    }, { status: 500 });
  }
}

function calculateAge(dob: string): number {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age + (monthDiff / 12);
}
```

---

## 🔔 Webhook Integration

### Step 1: Create Webhook Handler
Create `/src/app/api/webhooks/yoco/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyWebhookSignature } from '@/lib/yoco/client';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-yoco-signature');
    const payload = await request.text();
    
    // Verify webhook authenticity
    if (!signature || !verifyWebhookSignature(
      payload, 
      signature, 
      process.env.YOCO_WEBHOOK_SECRET!
    )) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(payload);
    const supabase = createClient();

    switch (event.type) {
      case 'payment.succeeded':
        // Handle successful payment
        const paymentRef = event.data.reference; // REG-2025-001234
        
        await supabase
          .from('registration_requests')
          .update({
            payment_verified: true,
            payment_verified_at: new Date().toISOString(),
            proof_of_payment_url: event.data.receiptUrl,
            payment_method: 'yoco_online',
          })
          .eq('payment_reference', paymentRef);
        
        // Send confirmation email
        // ... email logic ...
        
        break;

      case 'payment.failed':
        // Notify parent of failed payment
        console.error('Payment failed:', event.data);
        // Send failure notification email
        break;

      case 'subscription.activated':
        // Update subscription status
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            activated_at: new Date().toISOString(),
          })
          .eq('yoco_subscription_id', event.data.id);
        break;

      case 'subscription.payment_succeeded':
        // Log successful monthly payment
        await supabase.from('payment_history').insert({
          subscription_id: event.data.subscriptionId,
          amount: event.data.amount,
          status: 'paid',
          payment_date: event.data.paidAt,
          yoco_payment_id: event.data.id,
        });
        break;

      case 'subscription.payment_failed':
        // Notify parent and admin of failed payment
        await supabase
          .from('subscriptions')
          .update({ status: 'payment_failed' })
          .eq('yoco_subscription_id', event.data.subscriptionId);
        
        // Send notification email
        break;

      default:
        console.log('Unhandled webhook event:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

### Step 2: Configure Webhook in Yoco Portal
1. Go to https://portal.yoco.com/settings/webhooks
2. Add new webhook:
   - URL: `https://register.youngeagles.org.za/api/webhooks/yoco`
   - Events: Select all payment and subscription events
3. Copy the Webhook Secret and add to `.env.local`

---

## 🧪 Testing & Go-Live

### Testing Phase (Use Test Keys)

**Test Cards:**
```
Success: 4000 0000 0000 0002
Decline: 4000 0000 0000 0127
3D Secure: 4000 0000 0000 3220
CVV: Any 3 digits
Expiry: Any future date
```

**Test Flow:**
1. Submit registration form
2. Receive email with payment link
3. Click payment link
4. Complete payment with test card
5. Verify webhook triggers
6. Check registration status updates

### Go-Live Checklist

- [ ] Replace test keys with live keys in production `.env`
- [ ] Verify webhook URL is publicly accessible (HTTPS)
- [ ] Test live payment with R1 transaction
- [ ] Confirm email delivery with payment links
- [ ] Set up Yoco email notifications
- [ ] Configure settlement schedule (daily/weekly)
- [ ] Enable fraud detection rules in Yoco Portal
- [ ] Add business logo to payment pages
- [ ] Test refund process
- [ ] Document customer support procedures

---

## 💰 Cost Analysis

### Registration Fees (50 students)
```
Revenue: 50 × R150 = R7,500
Yoco Fee (2.95%): R7,500 × 0.0295 = R221.25
Net Revenue: R7,500 - R221.25 = R7,278.75
```

### Monthly Fees (50 students, avg R733/month)
```
Monthly Revenue: 50 × R733 = R36,650
Yoco Fee (2.95%): R36,650 × 0.0295 = R1,081.18
Net Revenue: R36,650 - R1,081.18 = R35,568.82

Annual Revenue: R35,568.82 × 12 = R426,825.84
Annual Yoco Fees: R1,081.18 × 12 = R12,974.16
```

### Cost Comparison
| Payment Method | Fee | Example (R150) |
|----------------|-----|----------------|
| **Yoco** | 2.95% | R4.43 |
| Manual EFT | R0 | R0 |
| Cash/ATM (your fee) | R20 | R20 |
| Credit Card Terminal | 3.5% | R5.25 |

**Verdict**: Yoco is cost-effective for convenience, but EFT remains cheapest.

---

## 🔄 Alternative Solutions

### 1. **PayFast** (Similar to Yoco)
- **Pros**: R0 monthly, 2.9% transaction fee, SA-based
- **Cons**: Less modern UI, fewer features
- **Best for**: Schools wanting simplicity over features

### 2. **Peach Payments** (Enterprise)
- **Pros**: Lower fees (2.5%), better for high volume
- **Cons**: R299/month minimum, complex setup
- **Best for**: Schools with >100 students

### 3. **Stripe** (International)
- **Pros**: Best API, advanced features
- **Cons**: 2.9% + R4.50 per transaction, USD-based
- **Best for**: Schools planning international expansion

### 4. **Hybrid Approach** (Recommended)
Use Yoco for convenience + manual EFT for cost savings:
- Offer both options in email
- Yoco payment button for urgent/easy payment
- Banking details for cost-conscious parents
- Track which parents prefer which method

---

## 📞 Support & Resources

### Yoco Support
- Email: support@yoco.com
- Phone: 087 550 9626
- Hours: Mon-Fri 8am-5pm
- Portal: https://portal.yoco.com/

### Documentation
- API Docs: https://developer.yoco.com/docs
- SDK Reference: https://www.npmjs.com/package/@yoco/node-sdk
- Webhooks Guide: https://developer.yoco.com/webhooks

### Young Eagles Contacts
- Technical: [Your dev email]
- Finance: admin@youngeagles.org.za
- Support: +27 60 482 8855

---

## 🎬 Next Steps

### Immediate (This Week)
1. ✅ Sign up for Yoco Business account
2. ✅ Submit verification documents
3. ✅ Add pricing to registration form (DONE)
4. ✅ Update email template branding (DONE)

### Short-term (1-2 Weeks)
1. Get Yoco API keys
2. Install SDK and create utility functions
3. Add payment_url to database
4. Update registration API
5. Test with test cards

### Medium-term (3-4 Weeks)
1. Configure webhook endpoint
2. Test webhook events
3. Go live with registration payments
4. Monitor first 10 transactions

### Long-term (2-3 Months)
1. Set up subscription plans
2. Migrate existing students to subscriptions
3. Automate payment reminders
4. Build parent payment portal

---

**Document Version**: 1.0  
**Last Updated**: November 22, 2025  
**Author**: GitHub Copilot for Young Eagles  
**Status**: Ready for Implementation
