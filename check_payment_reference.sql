SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'registration_requests' 
AND column_name = 'payment_reference';
