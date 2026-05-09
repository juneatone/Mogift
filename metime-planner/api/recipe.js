export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { type, value } = req.query;

  let url = '';
  if (type === 'filter') {
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(value)}`;
  } else if (type === 'lookup') {
    url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(value)}`;
  } else {
    return res.status(400).json({ error: 'Invalid type' });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch recipe' });
  }
}
