/**
 * Resend Registration Confirmation Emails
 * 
 * This script lists all approved registrations and provides
 * a simple way to resend confirmation emails.
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bppuzibjlxgfwrujzfsz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwcHV6aWJqbHhnZndydWp6ZnN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzc0MzczMCwiZXhwIjoyMDY5MzE5NzMwfQ.5zPPaAo1Jj5-SknVMDwvo1DBCXhmS60obAEckJV7o1I';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listApprovedRegistrations() {
  try {
    console.log('🔍 Fetching approved registrations...\n');
    
    // Get all approved registrations
    const { data: registrations, error } = await supabase
      .from('registration_requests')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching registrations:', error);
      return;
    }

    if (!registrations || registrations.length === 0) {
      console.log('ℹ️  No approved registrations found');
      return;
    }

    console.log(`📧 Found ${registrations.length} approved registration(s):\n`);

    registrations.forEach((reg, index) => {
      console.log(`${index + 1}. ${reg.guardian_name} (${reg.guardian_email})`);
      console.log(`   Student: ${reg.student_first_name} ${reg.student_last_name}`);
      console.log(`   Approved: ${new Date(reg.reviewed_date).toLocaleString()}`);
      console.log(`   Reference: ${reg.payment_reference || reg.id}`);
      console.log('');
    });

    console.log('\n📝 To resend emails:');
    console.log('   Option 1: Visit the admin panel at /dashboard/registrations');
    console.log('   Option 2: Run SQL script to trigger email resend');
    console.log('   Option 3: Use the API route directly\n');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the script
listApprovedRegistrations();
