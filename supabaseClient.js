import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hxiwnjidhkgghlytbfci.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4aXduamlkaGtnZ2hseXRiZmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MDkzNzQsImV4cCI6MjA4ODE4NTM3NH0.1K-w5uFhkRdnPXE-493n7B0Mj-4wRoYNGVObrSrHJ44'

export const supabase = createClient(supabaseUrl, supabaseKey)