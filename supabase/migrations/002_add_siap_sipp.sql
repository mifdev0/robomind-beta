-- Add SIAP/SIPP columns to existing psikolog table
-- Jalankan ini jika tabel psikolog sudah ada

alter table psikolog add column if not exists gelar text;
alter table psikolog add column if not exists no_siap text;
alter table psikolog add column if not exists siap_status text;
alter table psikolog add column if not exists siap_berlaku text;
alter table psikolog add column if not exists no_sipp text;
alter table psikolog add column if not exists sipp_status text;
alter table psikolog add column if not exists sipp_berlaku text;
alter table psikolog add column if not exists layanan text;
