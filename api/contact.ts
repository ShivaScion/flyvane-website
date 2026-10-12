export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { name, contactInfo, projectType, message } = body;

    if (!name?.trim() || !contactInfo?.trim()) {
      return res.status(400).json({ error: 'Name and contact info are required.' });
    }

    const receiptId = `FV-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toISOString();

    console.log(`[FLYVANE CLIENT INTAKE] Receipt: ${receiptId} | Lead: ${name} (${contactInfo}) | Scope: ${projectType}`);

    return res.status(200).json({
      success: true,
      receiptId,
      timestamp,
      destination: 'contact@flyvane.com',
      message: 'Project brief received and registered in Flyvane client intake queue.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
