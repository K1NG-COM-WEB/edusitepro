-- Check current URLs
SELECT payment_reference, 
       substring(proof_of_payment_url from 1 for 100) as url_preview
FROM registration_requests
WHERE proof_of_payment_url IS NOT NULL;

-- Fix duplicate path
UPDATE registration_requests
SET proof_of_payment_url = replace(proof_of_payment_url, 'payment-proofs/payment-proofs/', 'payment-proofs/')
WHERE proof_of_payment_url LIKE '%payment-proofs/payment-proofs/%';

-- Verify fix
SELECT payment_reference, proof_of_payment_url
FROM registration_requests
WHERE proof_of_payment_url IS NOT NULL;
