import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ivrwhksigigwhqhdachy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cndoa3NpZ2lnd2hxaGRhY2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyNjc1MjEsImV4cCI6MjEwNzg0MzUyMX0.gY1ij5O2xzlwSlHfd7xWx4GJB7XSJn7krR0-SWP7jdU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
