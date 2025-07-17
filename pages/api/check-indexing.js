export default async function handler(req, res) {
  const { urls, title } = req.body;
  const apiKey = process.env.DEFAULT_API_KEY;

  try {
    const response = await fetch('https://api.speedyindex.com/v2/task/google/checker/create', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, urls }),
    });

    const json = await response.json();

    if (json.code !== 0) {
      return res.status(400).json({ error: 'Task creation failed', details: json });
    }

    res.status(200).json({ task_id: json.task_id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
