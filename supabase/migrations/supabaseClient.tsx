// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nulxhlvzsermklgdlcgj.supabase.co'; // حط اللينك بتاعك من Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51bHhobHZ6c2VybWtsZ2RsY2dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MTc2NzAsImV4cCI6MjA1OTk5MzY3MH0.Bi3wuaZk9GoiScYdt0n_YWZi-GqVV0Tlke3p0ziiynk'; // حط الـ anon key بتاعك

export const supabase = createClient(supabaseUrl, supabaseKey);
