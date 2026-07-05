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
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { lat, lng } = req.query;

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from('psikolog').select('*');

    if (error) return res.status(500).json({ error: 'Database error' });
    if (!data || data.length === 0) {
      return res.json({ results: [], fallback: true, fallback_url: 'https://www.himpsi.or.id/cari-psikolog' });
    }

    let results;
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      results = data
        .map(d => ({
          ...d,
          jarak_km: Math.round(haversine(userLat, userLng, d.latitude || -7.556, d.longitude || 110.831) * 10) / 10
        }))
        .sort((a, b) => a.jarak_km - b.jarak_km);
    } else {
      results = data;
    }

    const minDistance = results.length > 0 ? results[0].jarak_km : Infinity;
    res.json({
      results: minDistance <= 50 ? results.slice(0, 15) : [],
      fallback: minDistance > 50 || results.length === 0,
      fallback_url: 'https://www.himpsi.or.id/cari-psikolog'
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal error' });
  }
}
