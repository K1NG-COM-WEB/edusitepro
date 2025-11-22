import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bppuzibjlxgfwrujzfsz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwcHV6aWJqbHhnZndydWp6ZnN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc0MzczMCwiZXhwIjoyMDY5MzE5NzMwfQ.5zPPaAo1Jj5-SknVMDwvo1DBCXhmS60obAEckJV7o1I'
)

const { data: authUser } = await supabase.auth.admin.listUsers()
const admin = authUser?.users?.find(u => u.email === 'admin@edudashpro.org.za')

console.log('Admin auth user:', admin?.id, admin?.email)

if (admin) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', admin.id)
    .single()
  
  console.log('Admin profile:', JSON.stringify(profile, null, 2))
}
