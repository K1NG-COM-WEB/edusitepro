-- Make Young Eagles visible in organizations directory
-- Update featured status and ensure registration is open

UPDATE organizations
SET 
  featured = true,
  registration_open = true,
  updated_at = NOW()
WHERE slug = 'young-eagles';

-- Verify the update
SELECT 
  name, 
  slug, 
  organization_type, 
  featured, 
  registration_open,
  city,
  province
FROM organizations
WHERE slug = 'young-eagles';
