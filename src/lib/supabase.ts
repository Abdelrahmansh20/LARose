import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://nulxhlvzsermklgdlcgj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51bHhobHZ6c2VybWtsZ2RsY2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MTc2NzAsImV4cCI6MjA1OTk5MzY3MH0.Bi3wuaZk9GoiScYdt0n_YWZi-GqVV0Tlke3p0ziiynk';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);