import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://exscmqdazkrtrfhstytk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4c2NtcWRhemtydHJmaHN0eXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDM4MTEsImV4cCI6MjA2OTAxOTgxMX0.dzfQmBkD8W47pbhZFZaeVbkKZxLIpumPM60lnqhFckM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
