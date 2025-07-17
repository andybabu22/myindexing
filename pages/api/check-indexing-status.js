export default async function handler(req, res) {
  const { task_id } = req.body;
  const apiKey = process.env.DEFAULT_API_KEY;

  try {
    const response = await fetch('https://api.speedyindex.com/v2/task/google/checker/status', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task_ids: [task_id] }),
    });

    const data = await response.json();
    const result = data?.result?.[0]?.result || [];

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check status', details: error.message });
  }
}
