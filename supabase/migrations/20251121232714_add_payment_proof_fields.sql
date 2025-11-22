-- Add payment proof fields to registration_requests table
-- This supports the new workflow: Submit → Pay → Upload POP → Admin Approves

ALTER TABLE registration_requests
ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100),
ADD COLUMN IF NOT EXISTS proof_of_payment_url TEXT,
ADD COLUMN IF NOT EXISTS payment_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_verified_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS pop_uploaded_at TIMESTAMPTZ;

-- Add index for finding registrations with uploaded POPs
CREATE INDEX IF NOT EXISTS idx_registration_requests_pop_uploaded 
ON registration_requests(pop_uploaded_at) 
WHERE proof_of_payment_url IS NOT NULL;

-- Add index for payment verification status
CREATE INDEX IF NOT EXISTS idx_registration_requests_payment_verified 
ON registration_requests(payment_verified);

-- Comment on new columns
COMMENT ON COLUMN registration_requests.payment_reference IS 'Unique reference number for parent to use when making payment';
COMMENT ON COLUMN registration_requests.proof_of_payment_url IS 'URL to uploaded proof of payment document/image';
COMMENT ON COLUMN registration_requests.payment_verified IS 'Whether admin has verified the payment proof';
COMMENT ON COLUMN registration_requests.payment_verified_at IS 'When payment was verified by admin';
COMMENT ON COLUMN registration_requests.payment_verified_by IS 'Admin user who verified the payment';
COMMENT ON COLUMN registration_requests.pop_uploaded_at IS 'When proof of payment was uploaded by parent';
