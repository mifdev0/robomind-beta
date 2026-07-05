-- Allow anon key to insert/update/delete (for import script)
-- Jalankan ini di Supabase SQL Editor setelah migration 001

drop policy if exists "Service full access" on psikolog;
create policy "Anon full access"
  on psikolog for all
  to anon
  using (true)
  with check (true);
