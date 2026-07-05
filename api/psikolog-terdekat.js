import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: 'Supabase not configured' });
  }

  const { lat, lng, kota } = req.query;

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let query = supabase
      .from('psikolog')
      .select('*')
      .or('str_status.eq.aktif,sippk_status.eq.aktif');

    if (kota) {
      query = query.ilike('kota', `%${kota}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (!data || data.length === 0) {
      return res.json({
        results: [],
        fallback: true,
        fallback_url: 'https://data.ipkindonesia.or.id/cari-psikolog/'
      });
    }

    let results;
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      results = data
        .filter(d => d.latitude != null && d.longitude != null)
        .map(d => ({
          ...d,
          jarak_km: Math.round(haversine(userLat, userLng, d.latitude, d.longitude) * 10) / 10
        }))
        .sort((a, b) => a.jarak_km - b.jarak_km);

      const inRadius = results.filter(d => d.jarak_km <= 50);
      if (inRadius.length > 0) {
        results = inRadius.slice(0, 10);
      } else if (results.length > 0) {
        results = results.slice(0, 10);
      }
    } else {
      results = data.slice(0, 10);
    }

    res.json({
      results,
      fallback: results.length === 0,
      fallback_url: results.length === 0 ? 'https://data.ipkindonesia.or.id/cari-psikolog/' : null
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
