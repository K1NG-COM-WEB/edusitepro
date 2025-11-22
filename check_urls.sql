SELECT 
  payment_reference,
  substring(proof_of_payment_url from 1 for 120) as url
FROM registration_requests 
WHERE proof_of_payment_url IS NOT NULL
ORDER BY created_at DESC 
LIMIT 3;
